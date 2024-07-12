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


const deleteUserAccount = async(req, res) => {
      const userId = req.user._id;

      try{
             const user = await User.findByIdAndDelete(userId);

             if(!user){
                  return res.status(400).send("User not found")
             }
             res.status(200).json({message: "Account have been deleted successfully"})
      }catch(error){
          console.log("Error deleting account: ", error.message);
          res.status(500).send("Error occured")
      }
}

const getUserProfile = async(req, res) => {
  const userId = req.user._id;

  try{
      const user = await User.findById(userId).select("-password") // exclude the password from the response

      if(!user){
          return res.status(404).send("User not found");
      }
      res.status(200).json(user)
  }catch(error){
      console.log("Error getting user profile:", error.message);
      res.status(500).send("An error occured")
  }
}

const getAllUsers = async(req, res) => {
     try{
            const users = await User.find({});

            if(!users){
                  res.status(400).json({message: "No user have registered into this system"})
            }

            res.status(200).json({message: "Users have been fetched successfully", users})
     }catch(error){
         console.log("Error getting users:", error);
         res.status(500).send("Error occured:", error)
     }
}
module.exports = { updateUser, deleteUserAccount, getUserProfile, getAllUsers };