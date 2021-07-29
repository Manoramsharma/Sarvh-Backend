const passport = require("passport");
const express = require("express");
const app = express();
var GoogleStrategy = require("passport-google-oauth20").Strategy;

// Implementing  google strategy for google authentication.
// We need to provide client id, client secret given by google in google developer console.
// Give a call back url so that it redirects to a page when user is logged in.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    // function to get profile details and a call back function
    function (accessToken, refreshToken, profile, cb) {
      console.log(accessToken);
      console.log(refreshToken);
      return cb(null, profile);
    }
  )
);

// Passport serializer
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// Passport deserializer
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});