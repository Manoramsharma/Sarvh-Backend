const express = require("express");
const router = express.Router();
const app = express();
const {
  searchuser,
  getuser,
  follow,
  unfollow,
  userproduct,
  updateUser,
  rating,
} = require("../controllers/user");
const auth = require("../middlewares/auth");
router.get("/search", searchuser);
router.get("/user/:id", getuser);
router.patch("/user", auth, updateUser);
router.patch("/user/:id/follow", auth, follow);
router.patch("/user/:id/unfollow", auth, unfollow);
router.patch("/user/:id/rate", auth, rating);
module.exports = router;
