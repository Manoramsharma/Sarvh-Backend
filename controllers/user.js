const express = require("express");
const app = express();
app.use(express.json());
const Users = require("../models/userModel");
const { cloudinary } = require("../configs/cloudinary");

exports.searchuser = async (req, res) => {
  try {
    const users = await Users.find({ username: { $regex: req.query.username } })
      .limit(10)
      .select("fullname username avatar");

    res.json({ users });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
exports.getuser = async (req, res) => {
  try {
    const user = await Users.find({ username: req.params.id })
      .select("-password -resetPasswordExpire -resetPasswordToken")
      .populate("cart.product");
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    res.json({ user: user[0] });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

exports.updateUser = async (req, res) => {
  try {
    var { fullname, username, mobile, address, gender, bio, pincode, file } =
      req.body;
    if (file) {
      const fileStr = req.body.file;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "ml_default",
      });
      file = uploadResponse.secure_url;
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            fullname: fullname,
            username: username,
            mobile: mobile,
            address: address,
            gender: gender,
            bio: bio,
            pincode: pincode,
            avatar: file,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
      res.json({ msg: "Update Success!" });
    } else {
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            fullname: fullname,
            username: username,
            mobile: mobile,
            address: address,
            gender: gender,
            bio: bio,
            pincode: pincode,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
      res.json({ msg: "Update Success!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err });
  }
};
exports.follow = async (req, res) => {
  try {
    const user = await Users.find({
      _id: req.params.id,
      followers: req.user._id,
    });
    if (user.length > 0)
      return res.status(500).json({ msg: "You followed this user." });

    const newUser = await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    ).populate("followers following", "-password");

    await Users.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { following: req.params.id },
      },
      { new: true }
    );

    res.json({ newUser });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const newUser = await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    ).populate("followers following", "-password");

    await Users.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { following: req.params.id },
      },
      { new: true }
    );

    res.json({ newUser });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.rating = async (req, res) => {
  try {
    const user = await Users.find({
      _id: req.params.id,
      ratings: req.user.ratings,
    });
    if (user.length > 0)
      return res.status(500).json({ msg: "You rated this user." });

    const newUser = await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { ratings: req.user.ratings },
      },
      { new: true }
    ).populate("followers following", "-password");

    await Users.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { ratings: req.params.id },
      },
      { new: true }
    );

    res.json({ newUser });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
