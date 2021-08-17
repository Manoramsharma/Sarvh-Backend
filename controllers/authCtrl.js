const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.GOOGLE_CLIENT_ID);
app.use(cookieParser());

const authCtrl = {
  register: async (req, res) => {
    try {
      const { fullname, username, email, password, gender } = req.body;
      let newUserName = "";
      if (username) {
        newUserName = username.toLowerCase().replace(/ /g, "");
      } else {
        newUserName = username;
      }
      console.log(newUserName);

      const user_name = await Users.findOne({ username: newUserName });
      if (user_name)
        return res.status(404).json({ msg: "this user name already exists" });

      const user_email = await Users.findOne({ email });

      if (user_email)
        return res.status(404).json({ msg: "this email already exists" });

      if (password.lenght < 6)
        return res.status(400).json({ msg: "password must be at least 6" });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        fullname,
        username: newUserName,
        email,
        password: passwordHash,
        gender,
      });

      const access_token = createAccessToken({ id: newUser._id });
      const refresh_token = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      await newUser.save();
      res.json({
        msg: "register success!",
        access_token,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ err: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email }).populate(
        "followers following",
        "-password"
      );

      if (!user)
        return res.status(400).json({ msg: "This email does not exist" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect" });

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });
      res
        .status(200)
        .cookie("refreshtoken", refresh_token, {
          path: "/api/refresh_token",
          sameSite: "strict",
          expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
          httpOnly: false,
        })
        .json({
          msg: "Login Sucess!",
          access_token,
          user: {
            ...user._doc,
            password: "",
          },
        });

      // res.cookie("refreshtoken", refresh_token, {
      //   httpOnly: true,
      //   path: "/api/refresh_token",
      //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      // });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  googlelogin: async (req, res) => {
    try {
      const { tokenId } = req.body;
      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email, name, picture } = verify.payload;
      const checkEmail = await Users.findOne({ email: email });
      if (checkEmail) {
        const refresh_token = createRefreshToken({ id: checkEmail._id });
        const access_token = createAccessToken({ id: checkEmail._id });

        res
          .status(200)
          .cookie("refreshtoken", refresh_token, {
            path: "/api/refresh_token",
            // sameSite: "strict",
            expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: false,
          })
          .json({
            msg: "Login Sucess!",
            access_token,
            user: {
              ...checkEmail._doc,
              password: "",
            },
          });
      } else {
        const newUser = new Users({
          email: email,
          fullname: name,
          avatar: picture,
        });
        newUser.save();
        const refresh_token = createRefreshToken({ id: newUser._id });
        const access_token = createAccessToken({ id: newUser._id });
        res
          .status(200)
          .cookie("refreshtoken", refresh_token, {
            path: "/api/refresh_token",
            sameSite: "strict",
            expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: false,
          })
          .json({
            msg: "Login Sucess!",
            access_token,
            user: {
              ...newUser._doc,
              password: "",
            },
          });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },
  facebooklogin: async (req, res) => {
    const { name, email, picture } = req.body;
    const url  = picture.data.url;
    const checkEmail = await Users.findOne({ email: email });
      if (checkEmail) {
        const refresh_token = createRefreshToken({ id: checkEmail._id });
        const access_token = createAccessToken({ id: checkEmail._id });

        res
          .status(200)
          .cookie("refreshtoken", refresh_token, {
            path: "/api/refresh_token",
            // sameSite: "strict",
            expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: false,
          })
          .json({
            msg: "Login Sucess!",
            access_token,
            user: {
              ...checkEmail._doc,
              password: "",
            },
          });
      } else {
        const newUser = new Users({
          email: email,
          fullname: name,
          avatar: url,
        });
        newUser.save();
        const refresh_token = createRefreshToken({ id: newUser._id });
        const access_token = createAccessToken({ id: newUser._id });
        res
          .status(200)
          .cookie("refreshtoken", refresh_token, {
            path: "/api/refresh_token",
            sameSite: "strict",
            expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: false,
          })
          .json({
            msg: "Login Sucess!",
            access_token,
            user: {
              ...newUser._doc,
              password: "",
            },
          });
      }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Logged out!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now" });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: "Please login now" });

          const user = await Users.findById(result.id)
            .select("-password")
            .populate("followers following", "-password");

          if (!user)
            return res.status(400).json({ msg: "This does not exists." });

          const access_token = createAccessToken({ id: result.id });

          res.json({
            access_token,
            user,
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    // Send Email to email provided but first check if user exists
    const { email } = req.body;

    try {
      const user = await Users.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "No emial could not send" });
      }

      // Reset Token Gen and add to database hashed (private) version of token
      const resetToken = user.getResetPasswordToken();

      await user.save();

      // Create reset url to email to provided email
      const resetUrl = `http://localhost:3000/resetpass/${resetToken}`;

      // HTML Message
      const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

      try {
        await sendEmail({
          to: user.email,
          subject: "Password Reset Request",
          text: message,
        });

        res.status(200).json({ success: true, msg: "Email Sent" });
      } catch (err) {
        console.log(err);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(400).json({ msg: "Email could not send" });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  // @desc    Reset User Password
  resetPassword: async (req, res, next) => {
    console.log(req.body);
    // Compare token in URL params to hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    try {
      const user = await Users.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ msg: "invalid token" });
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(201).json({
        success: true,
        data: "Password Updated Success",
        token: user.getSignedJwtToken(),
      });
    } catch (err) {
      next(err);
    }
  },
};

const createAccessToken = payload => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = payload => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ sucess: true, token });
};

module.exports = authCtrl;
