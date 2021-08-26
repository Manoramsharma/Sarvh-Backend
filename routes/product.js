const express = require("express");
const {
  uploadFile,
  getProducts,
  getProfileProduct,
  getAllProducts,
} = require("../controllers/product");
const auth = require("../middlewares/auth");

const router = express.Router();
router.post("/uploadfile", auth, uploadFile);
router.get("/product", getProducts);
router.get("/product/:id", auth, getProfileProduct);
router.get("/allproducts", getAllProducts);
module.exports = router;
