require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// connectDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Database connection failed:", error.message);
//     process.exit(1);
//   });
