const express = require("express");
const {
  uploadFile,
  getProducts,
  getProfileProduct,
} = require("../controllers/product");
const auth = require("../middlewares/auth");

const router = express.Router();
router.post("/uploadfile", auth, uploadFile);
router.route("/product").get(auth, getProducts);
router.get("/product/:id", auth, getProfileProduct);

module.exports = router;
