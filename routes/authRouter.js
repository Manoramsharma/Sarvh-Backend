const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");

const express = require("express");
const app = express();

router.post("/register", authCtrl.register);

router.post("/login", authCtrl.login);

router.post("/googlelogin", authCtrl.googlelogin);

router.post("/facebooklogin", authCtrl.facebooklogin);

router.post("/logout", authCtrl.logout);

router.post("/refresh_token", authCtrl.generateAccessToken);

module.exports = router;
