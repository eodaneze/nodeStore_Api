const { Home, userRegister, userLogin } = require("../controller/auth.controller");

const router = require('express').Router();


router.get("/", Home)

// @route /api/register 
// @desc this route registers a new user
// @access public

router.post("/register", userRegister)

// @route /api/login 
// @desc this route will login a user
// @access public

router.post('/login', userLogin)
module.exports = router