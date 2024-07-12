const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Your firstName is required"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Your lastName is required"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Your email is required"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Your password is required"],
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('users', userSchema)