import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updateUserSubscription } from "@/lib/user-service";
import UserModel from "@/lib/models/User";
import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
}

export async function POST(req: Request) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("Checkout session completed:", event);
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.userId && session.metadata?.planId) {
          const userId = session.metadata.userId;
          const planId = session.metadata.planId as "pro" | "business";
          const billingPeriod = session.metadata.billingPeriod as
            | "monthly"
            | "yearly";

          console.log(
            `Updating subscription for user ${userId} to plan ${planId} with billing period ${billingPeriod}`
          );

          if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            console.log("Customer ID:", session.customer);
            console.log("Subscription ID:", session.subscription);
          }

          let stripeCustomerId: string | null = null;
          if (session.customer) {
            try {
              await dbConnect();
              stripeCustomerId =
                typeof session.customer === "string"
                  ? session.customer
                  : session.customer.toString();

              console.log(
                `Saving Stripe customer ID ${stripeCustomerId} for user ${userId}`
              );

              const updatedUserDoc = await UserModel.findOneAndUpdate(
                { clerkId: userId },
                {
                  $set: {
                    stripeCustomerId: stripeCustomerId,
                    subscriptionStatus: planId,
                    subscriptionPeriod: billingPeriod,
                    searchLimit: 1000, // Pro and business plans get 1000 searches
                    updatedAt: new Date(),
                  },
                },
                { new: true }
              );

              if (updatedUserDoc) {
                console.log(
                  `Successfully updated user ${userId} with Stripe customer ID and subscription details`
                );
                console.log("Updated user document:", {
                  stripeCustomerId: updatedUserDoc.stripeCustomerId,
                  subscriptionStatus: updatedUserDoc.subscriptionStatus,
                  searchLimit: updatedUserDoc.searchLimit,
                });
              } else {
                console.error(
                  `Failed to update user ${userId} in MongoDB. User might not exist.`
                );
              }
            } catch (error) {
              console.error(
                "Error saving Stripe customer ID and subscription details:",
                error
              );
            }
          }

          const userUpdateData: Partial<User> = {
            subscriptionStatus: planId,
            subscriptionPeriod: billingPeriod,
          };

          if (stripeCustomerId) {
            userUpdateData.stripeCustomerId = stripeCustomerId;
          }

          const updatedUser = await UserModel.findOneAndUpdate(
            { clerkId: userId },
            { $set: userUpdateData },
            { new: true }
          );

          if (!updatedUser) {
            console.error(
              `Failed to update subscription for user ${userId}. User not found or database error.`
            );
          } else {
            console.log(
              `Successfully updated subscription for user ${userId} to ${planId} (${billingPeriod})`
            );
            console.log("Updated user data:", {
              subscriptionStatus: updatedUser.subscriptionStatus,
              subscriptionPeriod: updatedUser.subscriptionPeriod,
              searchLimit: updatedUser.searchLimit,
              stripeCustomerId: updatedUser.stripeCustomerId || "Not set",
            });
          }
        } else {
          console.error(
            "Missing metadata in checkout session:",
            session.metadata
          );
        }

        console.log("Payment successful:", session);
        break;
      }

      case "customer.subscription.updated": {
        console.log("Subscription updated:", event);
        const subscription = event.data.object as Stripe.Subscription;

        // Extract the customer ID
        const stripeCustomerId = subscription.customer as string;

        if (stripeCustomerId) {
          try {
            await dbConnect();

            // Find user by Stripe customer ID
            const user = await UserModel.findOne({ stripeCustomerId });

            if (user) {
              const userId = user.clerkId;
              console.log(
                `Found user ${userId} for Stripe customer ${stripeCustomerId}`
              );

              let planId: "free" | "pro" | "business" = "free";
              let billingPeriod: "monthly" | "yearly" = "monthly";

              if (
                subscription.status === "active" ||
                subscription.status === "trialing"
              ) {
                if (subscription.items.data.length > 0) {
                  const priceItem = subscription.items.data[0];
                  const priceId = priceItem.price.id;

                  console.log("Subscription price details:", {
                    priceId: priceId,
                    productId: priceItem.price.product,
                    interval: priceItem.price.recurring?.interval,
                    status: subscription.status,
                  });

                  try {
                    const productId =
                      typeof priceItem.price.product === "string"
                        ? priceItem.price.product
                        : priceItem.price.product.toString();

                    const product = await stripe.products.retrieve(productId);
                    console.log("Product details:", {
                      id: product.id,
                      name: product.name,
                      active: product.active,
                    });

                    if (product.name.toLowerCase().includes("business")) {
                      planId = "business";
                    } else if (product.name.toLowerCase().includes("pro")) {
                      planId = "pro";
                    } else if (product.metadata?.plan) {
                      // Fallback to metadata if available
                      const metadataPlan = product.metadata.plan.toLowerCase();
                      if (metadataPlan === "business") {
                        planId = "business";
                      } else if (metadataPlan === "pro") {
                        planId = "pro";
                      }
                    }
                  } catch (productError) {
                    console.error(
                      "Error retrieving product details:",
                      productError
                    );

                    if (priceId.toLowerCase().includes("business")) {
                      planId = "business";
                    } else if (priceId.toLowerCase().includes("pro")) {
                      planId = "pro";
                    }
                  }

                  const interval = priceItem.price.recurring?.interval;
                  if (interval === "year") {
                    billingPeriod = "yearly";
                  } else if (interval === "month") {
                    billingPeriod = "monthly";
                  }

                  console.log(
                    `Determined plan: ${planId}, billing period: ${billingPeriod} for subscription`
                  );
                }

                const billingPeriodChanged =
                  user.subscriptionPeriod !== billingPeriod;

                if (billingPeriodChanged) {
                  console.log(
                    `Billing period changed from ${
                      user.subscriptionPeriod || "unset"
                    } to ${billingPeriod}`
                  );
                }

                const updateData: Partial<User> = {
                  subscriptionStatus: planId,
                  subscriptionPeriod: billingPeriod,
                  updatedAt: new Date(),
                };

                const updatedUserDoc = await UserModel.findOneAndUpdate(
                  { clerkId: userId },
                  { $set: updateData },
                  { new: true }
                );

                if (updatedUserDoc) {
                  console.log(
                    `Successfully updated user ${userId} subscription details via webhook`
                  );
                  console.log("Updated user data:", {
                    subscriptionStatus: updatedUserDoc.subscriptionStatus,
                    subscriptionPeriod: updatedUserDoc.subscriptionPeriod,
                    stripeCustomerId: updatedUserDoc.stripeCustomerId,
                  });
                } else {
                  console.error(
                    `Failed to update user ${userId} in MongoDB. User might not exist.`
                  );
                }

                await updateUserSubscription(userId, planId, billingPeriod);
                console.log(
                  `Updated subscription for user ${userId} to ${planId} (${billingPeriod})`
                );
              } else if (
                subscription.status === "canceled" ||
                subscription.status === "unpaid"
              ) {
                // Revert to free plan
                await updateUserSubscription(userId, "free");
                console.log(
                  `Reverted user ${userId} to free plan due to ${subscription.status} subscription`
                );
              }
            } else {
              console.error(
                `No user found for Stripe customer ${stripeCustomerId}`
              );
            }
          } catch (error) {
            console.error("Error updating subscription:", error);
          }
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.error(
            "Missing userId in subscription metadata:",
            subscription.metadata
          );
          break;
        }

        console.log(
          `Reverting user ${userId} to free plan due to subscription cancellation`
        );

        try {
          const updatedUser = await updateUserSubscription(userId, "free");
          if (!updatedUser) {
            console.error(
              `User with clerkId ${userId} not found. Failed to revert to free plan.`
            );
          } else {
            console.log(`Successfully reverted user ${userId} to free plan`);
          }
        } catch (err) {
          console.error(
            `Error reverting subscription for user ${userId}:`,
            err
          );
        }

        break;
      }

      case "customer.created": {
        console.log("Customer created:", event);
        const customer = event.data.object as Stripe.Customer;

        if (customer.email) {
          try {
            await dbConnect();

            const user = await UserModel.findOne({ email: customer.email });

            if (user) {
              console.log(
                `Found user with clerkId ${user.clerkId} matching new Stripe customer ${customer.id}`
              );

              if (user.stripeCustomerId) {
                console.log(
                  `User already has Stripe customer ID ${user.stripeCustomerId}. Not overwriting.`
                );
              } else {
                const updatedUser = await UserModel.findOneAndUpdate(
                  { clerkId: user.clerkId },
                  {
                    $set: {
                      stripeCustomerId: customer.id,
                      updatedAt: new Date(),
                    },
                  },
                  { new: true }
                );

                if (updatedUser) {
                  console.log(
                    `Successfully added Stripe customer ID ${customer.id} to user ${user.clerkId}`
                  );
                } else {
                  console.error(
                    `Failed to update user ${user.clerkId} with Stripe customer ID ${customer.id}`
                  );
                }
              }
            } else {
              console.log(`No matching user found for email ${customer.email}`);
            }
          } catch (error) {
            console.error("Error processing customer.created event:", error);
          }
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error handling webhook event:", errorMessage);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
