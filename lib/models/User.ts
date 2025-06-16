import mongoose, { Schema, model, Model } from "mongoose";
import { User } from "../types";

const UserSchema = new Schema<User>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    provider: { type: String },
    imageUrl: { type: String },
    stripeCustomerId: { type: String },
    searchCount: { type: Number, default: 0 },
    searchLimit: { type: Number, default: 3 },
    subscriptionStatus: { 
      type: String, 
      enum: ['free', 'pro', 'business'], 
      default: 'free' 
    },
    subscriptionPeriod: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: undefined
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Check if the model exists before creating it to prevent overwriting
const UserModel = mongoose.models.User || model<User>('User', UserSchema);

export default UserModel as Model<User>; 