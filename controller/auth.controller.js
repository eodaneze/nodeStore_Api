const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const Home = (req, res) => {
    console.log("HELLO FROM NODE JS")
     res.send("THIS IS THE HOME ROUTE")
}

const userRegister = async(req, res) => {
    try{
        const{firstName, lastName, email, password} = req.body

        const user = await User.findOne({email});
        if(user){
           return res.status(400).send("This email already exist, please login")
        }

        const hashedPassword = bcrypt.hashSync(password , 10)
     const newUser = new User({
         firstName,
         lastName,
         email,
         password: hashedPassword
     })
       await newUser.save();

       res.status(201).json({message: "Your registration was successful", newUser})
    }catch(err){
         res.status(500).send(err.message)
    }
}

const userLogin = async(req, res) => {
  const {email, password} = req.body;
  try{
      const user = await User.findOne({email});
      if(!user){
         return res.status(400).json({message: "User with this email dosnt exist"})
      }

    //   check password

    const isMatch = await bcrypt.compareSync(password, user.password);
    if(!isMatch){
         return res.status(400).json({message: "Incorrect password"})
    }

    // create jwt payload
    const payload = {
         user: {
             id: user._id
         }
    }

//   sign token
  jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
    if (err) throw err;
    res.status(200).json({ message: "Login successful", user, token });
  });
  }catch(error){
      res.status(500).send(error.message)
  }
}

const protected = async(req, res)=>{
     res.send("This is a protected route")
}
module.exports = { Home, userRegister, userLogin, protected};