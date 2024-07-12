const User = require('../model/user.model')

const updateUser = async(req, res) => {
    const userId = req.user._id;
    const updates = req.body;

    // remove the users password from the req.body

    delete updates.password;

    try{
        const user = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        }).select('-password');

        if(!user){
             return res.status(404).send("User not found");
        }
        res.status(200).json({message: "Profile have been updated successfully", user})
    }catch(error){
         console.log(error.message)
    }
}
module.exports = { updateUser };