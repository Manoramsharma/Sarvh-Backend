const express = require("express");
const router = express.Router();
const app = express();
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { isUserAuthenticated } = require("../middlewares/isAuthenticated");
app.use(express.json());
app.use(cookieParser());

const successLoginUrl = "http://localhost:3000/login/success";
const errorLoginUrl = "http://localhost:3000/login/error";
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);
function setCookie(req, res, next) {
  res.cookie("token", "req.user.auth.token", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    secure: process.env.NODE_ENV !== "development",
  });
  next();
}
// router.get(
//   "/google/redirect",
//   passport.authenticate("google", {
//     failureMessage: "Cannot login to Google, please try again later!",
//     failureRedirect: errorLoginUrl,
//     successRedirect: successLoginUrl,
//   }),
//   (req, res) => {
//     const lastname = req.user.name.familyName;
//     const firstname = req.user.name.givenName;
//     const profilepic = req.user.photos[0].value;
//     const email = req.user.emails[0].value;
//     res
//       .status(200)
//       .cookie("access_token", " req.user.auth.token.kuchbhi", {
//         sameSite: "strict",
//         path: "/",
//         expires: new Date(new Date().getTime() +30 * 24 * 60 * 60 * 1000),
//         // expiresIn: "1d",
//         // maxAge: 30 * 24 * 60 * 60 * 1000,
//         httpOnly: false,
//       })
//       .send("cookie being initialized");
//     console.log(lastname, firstname, profilepic, email);
//   }
// );
router.get("/google/redirect", (req, res) => {
  passport.authenticate(
    "google",
    { session: false, failureRedirect: "/auth/google/failure" },
    async (err, user) => {
      res
        .status(200)
        .cookie("refreshtoken", "refresh_token", {
          path: "/api/refresh_token",
          sameSite: "None",
          expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
          secure: false,
          httpOnly: process.env.NODE_ENV !== 'development',
        })
        .redirect("http://localhost:3000/login");
      // You can send cookies and data in response here.
    }
  )(req, res);
});
router.get("/user", isUserAuthenticated, (req, res) => {
  console.log("asdkjf;askfdj");
  res.json(req.user);
});
module.exports = router;
