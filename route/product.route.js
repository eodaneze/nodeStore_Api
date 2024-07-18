const { addProduct, editProduct, getproducts } = require("../controller/product.controller");
const {auth, isAdmin} = require("../middleware/auth.middleware");
const router = require("express").Router();
const upload = require('../middleware/multer.middleware')

// @route /api/add-product
// @desc this route adds new product to the product model
// @access private - only admin can add product to db


router.post('/add-product', auth(), isAdmin(), upload.single('image'),  addProduct)
router.patch('/edit-product/:id', auth(), isAdmin(), upload.single('image'),  editProduct)
router.get('/get-products', getproducts);



module.exports = router;
