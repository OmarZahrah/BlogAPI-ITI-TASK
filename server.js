const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception 🤷‍♂️ Shutting down...");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
