const express = require("express");
const app = express();
const Product = require("../models/product");
const Users = require("../models/userModel");
const { cloudinary } = require("../configs/cloudinary");
app.use(express.json());

exports.uploadFile = async (req, res) => {
  console.log("in upload file");
  const {
    productName,
    price,
    mrp,
    productDescription,
    productFeatures,
    category,
    subCategory,
  } = req.body;
  console.log(req.body.file.length);
  console.log(req.user);
  const links = [];
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
  const newProduct = new Product({
    productName,
    price,
    mrp,
    productDescription,
    productFeatures,
    category,
    subCategory,
    images: links,
    owner: req.user._id,
  });
  newProduct.save();
  res.status(200).json({ msg: "Product Uploaded!" });
  // console.log(newProduct);
};
