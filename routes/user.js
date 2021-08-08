const express = require("express");
const router = express.Router();
const app = express();
const {
  searchuser,
  getuser,
  follow,
  unfollow,
} = require("../controllers/user");
const auth = require("../middlewares/auth");
router.get("/search", searchuser);
router.get("/user/:id", auth, getuser);
router.patch("/user/:id/follow", auth, follow);
router.patch("/user/:id/unfollow", auth, unfollow);
module.exports = router;
