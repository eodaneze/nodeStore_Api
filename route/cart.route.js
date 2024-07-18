const router = require('express').Router();
const {auth} = require('../middleware/auth.middleware');
const { addToCart, viewCart} = require("../controller/cart.controller");


//@route /api/add-to-cart
//@desc route for authenticated user to add product to cart
// @access private
router.post('/add-to-cart', auth(), addToCart);
router.get('/view-cart', auth(), viewCart);

module.exports = router