const express = require("express");
const globalError = require("./middleware/globalError");
const userRouter = require("./routes/userRoutes");
const jobRouter = require("./routes/jobRoutes");
const applicationRouter = require("./routes/applicationRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(
  cors({
    origin: true, 
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);
app.use(globalError);
module.exports = app;
