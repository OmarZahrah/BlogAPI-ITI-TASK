const mongoose = require("mongoose");

let isConnected = false;
let connectionPromise = null;

async function connectDB() {
  if (isConnected) return;
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  try {
    connectionPromise = mongoose.connect(mongoUri);
    await connectionPromise;
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    connectionPromise = null;
    console.error("Database connection failed:", error.message);
    throw error;
  }
}

module.exports = connectDB;
