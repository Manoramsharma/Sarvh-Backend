const express = require("express");
const {
  uploadFile,
  getProducts,
  getProfileProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} = require("../controllers/product");
const auth = require("../middlewares/auth");

const router = express.Router();
router.post("/uploadfile", auth, uploadFile);
router.get("/product", getProducts);
router.get("/product/:id", getProfileProduct);
router.get("/allproducts", getAllProducts);
router.get("/byproductid/:id", getProductById);
router.delete("/deleteproduct/:id", auth, deleteProduct);
module.exports = router;
