const { updateUser, deleteUserAccount, getUserProfile, getAllUsers} = require("../controller/user.controller");
const {auth , isAdmin} = require("../middleware/auth.middleware");
const router = require("express").Router();

//@route update user profile api/updateUser
// @desc  Access protected route
// @access  private

router.patch('/update-profile', auth(), updateUser)
router.delete("/delete-account", auth(), deleteUserAccount);
router.get('/get-profile', auth(), getUserProfile)

// @route get all users api/getAll-users
// @desc access protected route
// @access private - only admin can have access to this route
router.get('/getAll-users', auth(), isAdmin(), getAllUsers)
module.exports = router;
