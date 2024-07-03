const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

const jwtSecret = process.env.JWT_SECRET;


function auth(){
     return async(req, res, next) => {
          try{
            //  log the authorization header

            console.log("Authorization header is: ", req.headers.authorization)
          }catch(err){
              console.log(err.message)
          }
     }
}

module.exports = auth