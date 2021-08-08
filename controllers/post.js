const express = require("express");
const app = express();
const { cloudinary } = require("../configs/cloudinary");
app.use(express.json());

exports.uploadFile = async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "ml_default",
    });
    console.log(uploadResponse);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
