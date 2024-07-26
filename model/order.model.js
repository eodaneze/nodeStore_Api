const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    // required: true,
  },
  paymentRef: {
    type: String,
    required: true,
  },
  status: {
     type: String,
     enum: ['pending', 'completed', 'failed'],
     default: 'pending'
  }
}, {timestamps: true});

module.exports = mongoose.model("Order", orderSchema);