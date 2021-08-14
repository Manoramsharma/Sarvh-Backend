const express = require("express");
const { uploadFile } = require("../controllers/product");
const auth = require("../middlewares/auth");

const router = express.Router();
router.post('/uploadfile', auth, uploadFile);


module.exports=router;