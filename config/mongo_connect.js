const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
require('colors')

const url = process.env.MONGO_LOCAL_URL;
mongoose
  .connect(url)
  .then(() => console.log("Database have been connected successfully".green))
  .catch((error) => console.log("Failed to connect to db", error));
