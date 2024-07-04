const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

const jwtSecret = process.env.JWT_SECRET;


function auth(){
     return async(req, res, next) => {
          try{
            //  log the authorization header

            console.log("Authorization header is: ", req.headers.authorization)

          //   check if authorization header is present and starts with "Bearer"

          if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
                return res.status(401).send("Unauthorized Access: Token not found")
          }

          //  extract token from the header

          const token = req.headers.authorization.split(" ")[1]

          console.log("The extracted token is:", token);

          if(!token) {
                return res.status(401).send("Invalid token format")
          }
          let decoded;
          // verify token

          try{
              decoded = jwt.verify(token, jwtSecret);
              console.log("Decoded token: ", decoded)
          }catch(error){
                return res.status(401).send("Your session has expired, kindly login again")
          }
           

          // find the user by id
          const user = await User.findById(decoded.user.id)
          if(!user){
                res.status(401).send("Unauthorized access: User does not exist")
          }

          // attach user to the request object
          req.user = user;
          next()
          }catch(err){
              console.log(err.message)
          }
     }
}

module.exports = auth