const express = require("express");
const app = express();
app.use(express.json());
const Users = require("../models/userModel");

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
  console.log(req.params.id);
  try {
    const user = await Users.find({ username: req.params.id })
      .select("-password -resetPasswordExpire -resetPasswordToken")
      .populate("followers following", "-password");
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    res.json({ user: user[0] });
  } catch (err) {
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