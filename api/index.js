const app = require("../app");
const connectDB = require("../config/db");

let isConnected = false;
let connectionPromise = null;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      if (!connectionPromise) {
        connectionPromise = connectDB();
      }

      await connectionPromise;
      isConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("Serverless invocation error:", error.message);
    connectionPromise = null;
    return res.status(500).json({
      status: "error",
      message: `Server initialization failed: ${error.message}`,
    });
  }
};
