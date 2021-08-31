require("dotenv").config({ path: "./.env" });
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { request } = require("express");
const express = require("express");
const connectDB = require("./configs/db");
const cookieSession = require("cookie-session");
var bodyParser = require("body-parser");

//connect db

connectDB();

//Routers

const app = express();
const categoryRoutes = require("./routes/category");
const cartRoutes = require("./routes/cart");
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: process.env.COOKIE_KEY,
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH"],
    credentials: true,
  })
);
//passport
const passport = require("passport");
const passportSetup = require("./configs/passport-setup");

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.header("origin"));
  next();
});
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/product"));
app.use("/auth", require("./routes/auth"));
app.use("/api", categoryRoutes);
app.use("/api", cartRoutes);
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
