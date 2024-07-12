const { updateUser } = require("../controller/user.controller");
const auth = require("../middleware/auth.middleware");
const router = require("express").Router();

//@route update user profile api/updateUser
// @desc  Access protected route
// @access  private

router.patch('/update-profile', auth(), updateUser)

module.exports = router;
