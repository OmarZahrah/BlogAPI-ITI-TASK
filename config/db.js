const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Reuses one Mongoose connection across serverless invocations (e.g. Vercel).
 * Await before any DB work, or from server startup.
 */
async function connectDB() {
  if (!MONGO_URI) {
    throw new Error(
      "MONGO_URI is not set. Add it in your environment (e.g. Vercel → Environment Variables)."
    );
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts).then((m) => {
      console.log("Connected to MongoDB");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }

  return cached.conn;
}

module.exports = connectDB;
