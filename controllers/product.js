const express = require("express");
const app = express();
const { cloudinary } = require("../configs/cloudinary");
app.use(express.json());

exports.uploadFile = async (req, res) => {
  console.log("in upload file");
  console.log(req.body.file.length);
  // console.log(req.user);
  const links = [];
  res.status(200).json({ msg: "file uploaded successful" });
  for (var i = 0; i < req.body.file.length; i++) {
    try {
      const fileStr = req.body.file[i];
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "ml_default",
      });
      links.push(uploadResponse.secure_url);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
  console.log(links);
  // try {
  //   const fileStr = req.body.data;
  //   const uploadResponse = await cloudinary.uploader.upload(fileStr, {
  //     upload_preset: "ml_default",
  //   });
  //   console.log(uploadResponse);
  // } catch (err) {
  //   return res.status(500).json({ msg: err.message });
  // }
};
