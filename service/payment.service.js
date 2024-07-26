const axios = require('axios');
require("dotenv").config();

const{FLUTTERWAVE_API_KEY, FLUTTERWAVE_BASE_URL} = process.env


const initializePayment = async(paymentData) => {
      try{
         const response = await axios.post(
           `${FLUTTERWAVE_BASE_URL}/payments`,
           paymentData,
           {
             headers: {
               Authorization: `Bearer ${FLUTTERWAVE_API_KEY}`,
               "Content-Type": "application/json"
             },
           }
         );
           console.log("the data response is:", response.data);
         return response.data;
      }catch(error){
           console.log(error)
      }
}

module.exports = { initializePayment };