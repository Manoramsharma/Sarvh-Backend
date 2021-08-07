const express = require("express");
const router = express.Router();
const app = express();
const { searchuser, getuser } = require('../controllers/user')
const auth = require("../middlewares/auth")
router.get('/search', searchuser);
router.get('/user/:id', auth, getuser);
module.exports=router;