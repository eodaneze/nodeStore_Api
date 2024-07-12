const { updateUser, deleteUserAccount, getUserProfile} = require("../controller/user.controller");
const auth = require("../middleware/auth.middleware");
const router = require("express").Router();

//@route update user profile api/updateUser
// @desc  Access protected route
// @access  private

router.patch('/update-profile', auth(), updateUser)
router.delete("/delete-account", auth(), deleteUserAccount);
router.get('/get-profile', auth(), getUserProfile)
module.exports = router;
