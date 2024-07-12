const {} = require("../controller/product.controller");
const {auth, isAdmin} = require("../middleware/auth.middleware");
const router = require("express").Router();


// @route /api/register
// @desc this route registers a new user
// @access public

module.exports = router;
