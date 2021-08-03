const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')

const express = require("express");
const app = express();


router.post('/register', authCtrl.register)

router.post('/login',  authCtrl.login)

router.post('/logout', authCtrl.logout)

router.post('/refresh_token', authCtrl.generateAccessToken)

router.post('/forgotpassword', authCtrl.forgotPassword)


router.put('/resetpass/:resetToken', authCtrl.resetPassword)



module.exports = router