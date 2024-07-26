const router = require('express').Router();
const {auth} = require('../middleware/auth.middleware');
const { addToCart, viewCart, deleteCartItem, clearCart, checkout} = require("../controller/cart.controller");


//@route /api/add-to-cart
//@desc route for authenticated user to add product to cart
// @access private
router.post('/add-to-cart', auth(), addToCart);
router.get('/view-cart', auth(), viewCart);
router.delete("/delete-cart/:productId", auth(), deleteCartItem);
router.delete('/clear-cart', auth(), clearCart);
router.post('/checkout', auth(), checkout);
module.exports = router