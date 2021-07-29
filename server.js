require("dotenv").config({ path: "./.env" });
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { request } = require("express");
const express = require("express");
const connectDB = require("./configs/db");

//connect db

connectDB();

//Routers

const app = express();

//passport
const passport = require("passport");
const passportSetup = require("./configs/passport-setup");

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api", require("./routes/authRouter"));
app.use("/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.json({ msg: "sarvh server up" });
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});
