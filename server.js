require("dotenv").config();
const app = require("./app");

if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
