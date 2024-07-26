// services/flutterwaveService.js
const axios = require("axios");
require("dotenv").config();

const { FLUTTERWAVE_BASE_URL, FLUTTERWAVE_API_KEY } = process.env;
const initializePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${FLUTTERWAVE_BASE_URL}/payments`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

const verifyPayment = async (transactionId) => {
  try {
    const response = await axios.get(
      `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_API_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
};
