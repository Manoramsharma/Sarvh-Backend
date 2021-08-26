const express = require("express");
const app = express();
const Product = require("../models/product");
const Comments = require("../models/comment");
const Users = require("../models/userModel");
const { cloudinary } = require("../configs/cloudinary");
app.use(express.json());

exports.uploadFile = async (req, res) => {
  const {
    productName,
    price,
    mrp,
    productDescription,
    productFeatures,
    category,
    subCategory,
  } = req.body;
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
    user: req.user._id,
  });
  newProduct.save();
  res.status(200).json({
    msg: "Product Uploaded!",
    newProduct: { ...newProduct._doc, user: req.user },
  });
};

exports.getProducts = async (req, res) => {
  try {
    const product = await Product.find()
      .sort("-createdAt")
      .populate("user likes", "avatar username fullname followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      })
      .limit(5);
    res.status(200).json({ msg: "product fetched", product: product });
  } catch (err) {
    console.log(err);
    res.json({ msg: err });
  }
};
exports.getProfileProduct = async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.params.id });
    const product = await Product.find({ user: user._id })
      .sort("-createdAt")
      .populate("user", "username");
    res.status(200).json({ msg: "product fetched", product: product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const result = await Product.find({})
      .populate("user", "username")
      .sort("-createdAt");

    res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
