const { addProduct } = require("../controller/product.controller");
const {auth, isAdmin} = require("../middleware/auth.middleware");
const router = require("express").Router();
const upload = require('../middleware/multer.middleware')

// @route /api/add-product
// @desc this route adds new product to the product model
// @access private - only admin can add product to db


router.post('/add-product', auth(), isAdmin(), upload.array('image', 5),  addProduct)


module.exports = router;
