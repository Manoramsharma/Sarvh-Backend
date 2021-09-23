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
  pop_notifications,
} = require("../controllers/user");
const auth = require("../middlewares/auth");
router.get("/search", searchuser);
router.get("/user/:id", getuser);
router.patch("/user", auth, updateUser);
router.patch("/user/:id/follow", auth, follow);
router.patch("/user/:id/unfollow", auth, unfollow);
router.post("/user/rating/:id/:rate", auth, rating);
router.post("/user/notifications/:id", auth, pop_notifications);
module.exports = router;
