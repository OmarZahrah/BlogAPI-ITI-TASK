const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception 🤷‍♂️ Shutting down...");
    console.log(err);
    server.close(() => {
      process.exit(1);
    });
  });
}

start();
