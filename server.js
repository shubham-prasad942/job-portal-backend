require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/database/db");

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
connectDb();
