import dotenv from "dotenv";

dotenv.config();

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/system-auto",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 10,
  jwtSecret: process.env.JWT_SECRET || "change-this-jwt-secret-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  signupSecret: process.env.SIGNUP_SECRET || "",
};

export default env;
