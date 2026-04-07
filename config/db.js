const mongoose = require("mongoose");

let isConnected = false;
let connectionPromise = null;

function classifyMongoError(error) {
  const message = String(error?.message || "");
  if (!message) return "unknown";

  if (message.includes("ECONNREFUSED") || message.includes("ETIMEDOUT")) {
    return "network";
  }
  if (message.includes("ENOTFOUND") || message.includes("querySrv")) {
    return "dns";
  }
  if (
    message.includes("bad auth") ||
    message.includes("Authentication failed")
  ) {
    return "auth";
  }
  if (message.includes("IP") && message.includes("whitelist")) {
    return "ip-access-list";
  }
  if (message.includes("MongoServerSelectionError")) {
    return "server-selection";
  }
  return "unknown";
}

function getMongoHostLabel(uri) {
  try {
    const withoutProtocol = uri.replace(/^mongodb(\+srv)?:\/\//, "");
    const hostPart = withoutProtocol.split("/")[0];
    return hostPart.split("@").pop();
  } catch (error) {
    return "unparsed-host";
  }
}

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
    connectionPromise = mongoose.connect(mongoUri, {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 20000,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    });
    await connectionPromise;
    isConnected = true;
    const host = getMongoHostLabel(mongoUri);
    console.log(`Connected to MongoDB (${host})`);
  } catch (error) {
    connectionPromise = null;
    const host = getMongoHostLabel(mongoUri);
    const category = classifyMongoError(error);
    console.error(
      `Database connection failed [${category}] (host: ${host}):`,
      error.message,
    );
    throw error;
  }
}

module.exports = connectDB;
