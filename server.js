require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
connectDB();

if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
