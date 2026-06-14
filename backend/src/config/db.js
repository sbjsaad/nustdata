import mongoose from "mongoose";
import env from "./env.js";
import { logger } from "../utils/logger.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    return mongoose.connection.db?.databaseName || "unknown";
  } catch (error) {
    logger.error(`MongoDB failed — ${error.message}`);
    process.exit(1);
  }
}
