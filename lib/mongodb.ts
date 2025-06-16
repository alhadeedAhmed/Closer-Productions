import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_DB_URI environment variable");
}

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default dbConnect;
