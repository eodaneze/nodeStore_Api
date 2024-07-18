const router = require('express').Router();
const {auth} = require('../middleware/auth.middleware');
const {addToCart} = require('../controller/cart.controller')


//@route /api/add-to-cart
//@desc route for authenticated user to add product to cart
// @access private
router.post('/add-to-cart', auth(), addToCart);

module.exports = router