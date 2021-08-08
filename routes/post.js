const express = require("express");
const { uploadFile } = require("../controllers/post");
const router = express.Router();
router.post('/uploadfile', uploadFile);


module.exports=router;