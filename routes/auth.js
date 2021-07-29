const express = require("express");
const router = express.Router();
const app = express();
const passport = require("passport");
app.use(express.json());

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // Getting the information given by google when user authenticated with google like first name, last name, profile pic, email.
  const lastname = req.user.name.familyName;
  const firstname = req.user.name.givenName;
  const profilepic = req.user.photos[0].value;
  const email = req.user.emails[0].value;

  console.log(lastname, firstname, profilepic, email);
});
module.exports = router;
