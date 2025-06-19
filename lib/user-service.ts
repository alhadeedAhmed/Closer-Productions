import dbConnect from "./mongodb";
import UserModel from "./models/User";
import { User } from "./types";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);

// Helper function to create a Stripe customer
async function createStripeCustomer(
  email: string,
  name?: string
): Promise<string | null> {
  try {
    const customer = await stripe.customers.create({
      email,
      name: name || email,
      metadata: {
        source: "ThingsDifferenceApp",
      },
    });

    console.log(`Created Stripe customer: ${customer.id} for email: ${email}`);
    return customer.id;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    return null;
  }
}

// export async function resetSearchCount(clerkId: string) {
//   console.log(`=== RESET SEARCH COUNT CALLED ===`);
//   console.log(`ClerkId: ${clerkId}`);
  
//   try {
//     await dbConnect();
//     console.log("Database connection established for reset");

//     // First, check if user exists and get current state
//     const existingUser = await UserModel.findOne({ clerkId });
//     console.log("Current user state:", existingUser ? {
//       clerkId: existingUser.clerkId,
//       searchCount: existingUser.searchCount,
//       searchLimit: existingUser.searchLimit,
//       subscriptionStatus: existingUser.subscriptionStatus
//     } : "User not found");

//     if (!existingUser) {
//       console.error(`[resetSearchCount] No user found with clerkId: ${clerkId}`);
//       return null;
//     }

//     // Perform the reset
//     const updatedUser = await UserModel.findOneAndUpdate(
//       { clerkId },
//       { 
//         $set: { 
//           searchCount: 0,
//           updatedAt: new Date()
//         } 
//       },
//       { new: true } // return updated user
//     );

//     if (!updatedUser) {
//       console.error(`[resetSearchCount] Failed to update user with clerkId: ${clerkId}`);
//       return null;
//     }

//     console.log(`[resetSearchCount] SUCCESS - Updated user:`, {
//       clerkId: updatedUser.clerkId,
//       searchCount: updatedUser.searchCount,
//       searchLimit: updatedUser.searchLimit,
//       subscriptionStatus: updatedUser.subscriptionStatus
//     });

//     return updatedUser;
    
//   } catch (error) {
//     console.error(`[resetSearchCount] Database error:`, error);
//     throw error;
//   }
// }

export async function createOrUpdateUser(
  userData: Partial<User>
): Promise<User> {
  console.log("createOrUpdateUser called with data:", {
    clerkId: userData.clerkId,
    email: userData.email,
    provider: userData.provider,
    stripeCustomerId: userData.stripeCustomerId || "Not provided",
  });

  try {
    await dbConnect();
    console.log("MongoDB connection established");

    const { clerkId } = userData;

    if (!clerkId) {
      console.error("createOrUpdateUser - No clerkId provided");
      throw new Error("Clerk ID is required");
    }

    const now = new Date();

    const existingUser = await UserModel.findOne({ clerkId });

    if (
      userData.provider &&
      existingUser &&
      existingUser.provider !== userData.provider
    ) {
      console.log(
        `User auth provider changed: ${existingUser.provider} -> ${userData.provider}`
      );
    }

    console.log(`Attempting to update/insert user with clerkId: ${clerkId}`);

    if (existingUser) {
      console.log("Existing user found, updating fields");
      console.log("Current user data:", {
        clerkId: existingUser.clerkId,
        searchCount: existingUser.searchCount,
        searchLimit: existingUser.searchLimit,
        subscriptionStatus: existingUser.subscriptionStatus,
        subscriptionPeriod: existingUser.subscriptionPeriod || "N/A",
        stripeCustomerId: existingUser.stripeCustomerId || "None",
      });

      // Create update data while preserving important existing fields
      const updateData = { ...userData };

      // STRIPE CUSTOMER ID HANDLING:
      // 1. If user doesn't have a Stripe ID but one is provided in update, use it
      // 2. If user doesn't have a Stripe ID and none is provided, try to create one
      // 3. If user already has a Stripe ID, never overwrite it

      if (!existingUser.stripeCustomerId) {
        // Case 1: User has no Stripe ID but update includes one
        if (updateData.stripeCustomerId) {
          console.log(
            `Using provided Stripe customer ID: ${updateData.stripeCustomerId}`
          );
          // Keep the provided Stripe ID in updateData
        }
        // Case 2: User has no Stripe ID and none is provided, but we have an email
        else if (updateData.email && !updateData.stripeCustomerId) {
          try {
            const customerName =
              updateData.firstName && updateData.lastName
                ? `${updateData.firstName} ${updateData.lastName}`
                : undefined;

            console.log(
              `Creating Stripe customer for existing user ${existingUser.clerkId} with email ${updateData.email}`
            );
            const stripeCustomerId = await createStripeCustomer(
              updateData.email,
              customerName
            );

            if (stripeCustomerId) {
              updateData.stripeCustomerId = stripeCustomerId;
              console.log(
                `Added Stripe customer ID ${stripeCustomerId} to existing user ${existingUser.clerkId}`
              );
            }
          } catch (error) {
            console.error(
              "Error creating Stripe customer for existing user:",
              error
            );
            // Continue with update even if Stripe customer creation fails
          }
        }
      } else {
        // Case 3: User already has a Stripe ID - NEVER overwrite it
        console.log(
          `Protecting existing Stripe customer ID: ${existingUser.stripeCustomerId}`
        );
        // Remove any Stripe customer ID from updateData to keep the existing one
        delete updateData.stripeCustomerId;
      }

      // Never overwrite these fields with empty values
      delete updateData.searchCount;

      // SUBSCRIPTION PROTECTION: Never downgrade a subscription
      // Check if there's an attempt to downgrade subscription status
      if (
        existingUser.subscriptionStatus === "pro" ||
        existingUser.subscriptionStatus === "business"
      ) {
        if (updateData.subscriptionStatus === "free") {
          console.log(
            `Prevented subscription downgrade from ${existingUser.subscriptionStatus} to free`
          );
          delete updateData.subscriptionStatus;
        }
      }

      // SEARCH LIMIT PROTECTION: Don't reduce search limit unless it's a deliberate downgrade
      if (existingUser.searchLimit > 3 && updateData.searchLimit === 3) {
        console.log(
          `Prevented search limit reduction from ${existingUser.searchLimit} to 3`
        );
        delete updateData.searchLimit;
      }

      // Preserve subscription period if it exists and not explicitly changing
      if (existingUser.subscriptionPeriod && !updateData.subscriptionPeriod) {
        delete updateData.subscriptionPeriod;
      }

      console.log("Update data being sent to MongoDB:", {
        ...updateData,
        stripeCustomerId: updateData.stripeCustomerId || "No change",
      });

      const updatedUser = await UserModel.findOneAndUpdate(
        { clerkId },
        {
          $set: {
            ...updateData,
            updatedAt: now,
          },
        },
        { new: true }
      );

      if (updatedUser) {
        // Double-check that Stripe customer ID wasn't lost during update
        if (existingUser.stripeCustomerId && !updatedUser.stripeCustomerId) {
          console.error(
            `Stripe customer ID was lost during update! Restoring ${existingUser.stripeCustomerId}`
          );
          // Restore the Stripe customer ID
          const restoredUser = await UserModel.findOneAndUpdate(
            { clerkId },
            { $set: { stripeCustomerId: existingUser.stripeCustomerId } },
            { new: true }
          );

          if (restoredUser) {
            console.log(
              `Successfully restored Stripe customer ID ${existingUser.stripeCustomerId}`
            );
            return restoredUser.toObject();
          }
        }

        console.log("User updated successfully:", {
          clerkId: updatedUser.clerkId,
          searchCount: updatedUser.searchCount,
          searchLimit: updatedUser.searchLimit,
          subscriptionStatus: updatedUser.subscriptionStatus,
          subscriptionPeriod: updatedUser.subscriptionPeriod || "N/A",
          provider: updatedUser.provider,
          stripeCustomerId: updatedUser.stripeCustomerId || "None",
        });

        return updatedUser.toObject();
      } else {
        throw new Error("Failed to update existing user");
      }
    } else {
      // User doesn't exist, create new one
      console.log("No existing user found, creating new user");

      try {
        // Set default values for new users
        const newUserData: Partial<User> = {
          ...userData,
          searchCount: 0,
          searchLimit: userData.searchLimit || 3,
          subscriptionStatus: userData.subscriptionStatus || "free",
          subscriptionPeriod: userData.subscriptionPeriod || undefined,
          createdAt: now,
          updatedAt: now,
        };

        // STRIPE CUSTOMER ID HANDLING FOR NEW USERS:
        // If Stripe ID is provided in userData, use that
        // Otherwise try to create one if we have an email

        if (newUserData.stripeCustomerId) {
          console.log(
            `Using provided Stripe customer ID for new user: ${newUserData.stripeCustomerId}`
          );
          // Keep the provided Stripe ID
        }
        // Create a Stripe customer for the new user if email is provided and no Stripe ID exists
        else if (newUserData.email && !newUserData.stripeCustomerId) {
          try {
            const customerName =
              newUserData.firstName && newUserData.lastName
                ? `${newUserData.firstName} ${newUserData.lastName}`
                : undefined;

            console.log(
              `Creating Stripe customer for new user with email ${newUserData.email}`
            );
            const stripeCustomerId = await createStripeCustomer(
              newUserData.email,
              customerName
            );

            if (stripeCustomerId) {
              newUserData.stripeCustomerId = stripeCustomerId;
              console.log(
                `Added Stripe customer ID ${stripeCustomerId} to new user data`
              );
            }
          } catch (error) {
            console.error(
              "Error creating Stripe customer for new user:",
              error
            );
            // Continue with user creation even if Stripe customer creation fails
          }
        }

        console.log("Creating new user with data:", {
          clerkId: newUserData.clerkId,
          email: newUserData.email,
          searchLimit: newUserData.searchLimit,
          subscriptionStatus: newUserData.subscriptionStatus,
          subscriptionPeriod: newUserData.subscriptionPeriod || "N/A",
          stripeCustomerId: newUserData.stripeCustomerId || "None",
        });

        const newUser = new UserModel(newUserData);
        await newUser.save();

        console.log("New user created successfully:", {
          clerkId: newUser.clerkId,
          searchCount: newUser.searchCount,
          searchLimit: newUser.searchLimit,
          subscriptionStatus: newUser.subscriptionStatus,
          subscriptionPeriod: newUser.subscriptionPeriod || "N/A",
          provider: newUser.provider,
          stripeCustomerId: newUser.stripeCustomerId || "None",
        });

        return newUser.toObject();
      } catch (createError) {
        console.error("Error creating new user:", createError);
        throw createError;
      }
    }
  } catch (error) {
    console.error("Error in createOrUpdateUser:", error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  console.log(`getUserByClerkId called with clerkId: ${clerkId}`);

  try {
    await dbConnect();
    console.log("MongoDB connection established");

    const user = await UserModel.findOne({ clerkId });
    console.log(
      "User lookup result:",
      user
        ? {
            found: true,
            clerkId: user.clerkId,
            searchCount: user.searchCount,
            searchLimit: user.searchLimit,
            provider: user.provider,
            subscriptionStatus: user.subscriptionStatus,
            stripeCustomerId: user.stripeCustomerId || "None",
          }
        : { found: false }
    );

    return user ? user.toObject() : null;
  } catch (error) {
    console.error("Error in getUserByClerkId:", error);
    throw error;
  }
}

export async function incrementSearchCount(
  clerkId: string
): Promise<{
  success: boolean;
  count: number;
  limit: number;
  canSearch: boolean;
}> {
  console.log(`incrementSearchCount called with clerkId: ${clerkId}`);

  try {
    await dbConnect();
    console.log("MongoDB connection established");

    const user = await UserModel.findOne({ clerkId });

    if (!user) {
      console.error(`No user found with clerkId: ${clerkId}`);
      throw new Error("User not found");
    }

    console.log("Found user with search data:", {
      searchCount: user.searchCount,
      searchLimit: user.searchLimit,
      provider: user.provider,
    });

    const canSearch = user.searchCount < user.searchLimit;
    console.log(`User can search: ${canSearch}`);

    if (canSearch) {
      const result = await UserModel.findOneAndUpdate(
        { clerkId },
        {
          $inc: { searchCount: 1 },
          $set: { updatedAt: new Date() },
        },
        { new: true }
      );

      console.log("Search count incremented:", {
        searchCount: result?.searchCount || 0,
        searchLimit: result?.searchLimit || 3,
        provider: result?.provider,
      });

      return {
        success: true,
        count: result?.searchCount || 0,
        limit: result?.searchLimit || 3,
        canSearch: true,
      };
    }

    console.log("User has reached search limit, not incrementing");
    return {
      success: false,
      count: user.searchCount,
      limit: user.searchLimit,
      canSearch: false,
    };
  } catch (error) {
    console.error("Error in incrementSearchCount:", error);
    throw error;
  }
}

export async function updateUserSubscription(
  clerkId: string,
  plan: "free" | "pro" | "business",
  billingPeriod?: "monthly" | "yearly"
): Promise<User | null> {
  console.log(
    `updateUserSubscription called with clerkId: ${clerkId}, plan: ${plan}, billingPeriod: ${
      billingPeriod || "N/A"
    }`
  );

  try {
    await dbConnect();
    console.log("MongoDB connection established");

    // First check if user exists
    const existingUser = await UserModel.findOne({ clerkId });
    if (!existingUser) {
      console.error(
        `Cannot update subscription: No user found with clerkId: ${clerkId}`
      );
      return null;
    }

    console.log("Current user data:", {
      clerkId: existingUser.clerkId,
      subscriptionStatus: existingUser.subscriptionStatus,
      subscriptionPeriod: existingUser.subscriptionPeriod || "N/A",
      searchLimit: existingUser.searchLimit,
    });

    console.log("Updating subscription with plan:", plan);
    console.log("Updating subscription with billingPeriod:", billingPeriod);

    const searchLimit = plan === "free" ? 3 : 1000;

    const updateData: Partial<User> = {
      subscriptionStatus: plan,
      searchLimit: searchLimit,
      updatedAt: new Date(),
    };

    if (plan !== "free" && billingPeriod) {
      updateData.subscriptionPeriod = billingPeriod;
    } else if (plan === "free") {
      updateData.subscriptionPeriod = null;
    }

    console.log("Update data being sent to MongoDB:", updateData);

    const result = await UserModel.findOneAndUpdate(
      { clerkId },
      { $set: updateData },
      { new: true }
    );

    if (result) {
      console.log("Subscription updated successfully:", {
        subscriptionStatus: result.subscriptionStatus,
        subscriptionPeriod: result.subscriptionPeriod || "N/A",
        searchLimit: result.searchLimit,
        provider: result.provider,
      });
      return result.toObject();
    } else {
      console.error(
        `Failed to update subscription. Database operation returned null for clerkId: ${clerkId}`
      );
      return null;
    }
  } catch (error) {
    console.error("Error in updateUserSubscription:", error);
    throw error;
  }
}
