require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/db");

const PORT = process.env.PORT;

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error in connection to DB", err);
  });
