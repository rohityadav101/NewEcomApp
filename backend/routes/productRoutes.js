const express=require("express");
const { getAllProduct,createProduct,getAllProducts, updateProduct ,deleteProduct, getSingleProduct, createProductReview } = require("../controllers/ProdutController");
const { isAuthenticatedUser, authRole } = require("../middleware/auth");

const router=express.Router();

// router.route("/product").get(getAllProduct)

//create product route
router.route("/createproduct").post(isAuthenticatedUser,createProduct)
//get all product route
router.route("/Products").get( getAllProducts)
//update 
router.route("/product/:id").put(isAuthenticatedUser, updateProduct ).delete(isAuthenticatedUser, deleteProduct).get(getSingleProduct)

router.route("/review").put(isAuthenticatedUser,createProductReview)

module.exports=router