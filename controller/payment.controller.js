// controllers/paymentController.js

const User = require("../model/user.model");
const Cart = require("../model/cart.model");
const Order = require("../model/order.model");
const Product = require("../model/product.model");
const { verifyPayment } = require("../service/payment.service");

const handlePaymentRedirect = async (req, res) => {
  try {
    const { transaction_id, status, userId } = req.query; // Get transaction_id and status from query parameters

    if (status !== "completed") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const response = await verifyPayment(transaction_id);
  console.log("The response is:", response)
  console.log("the trans id is:", transaction_id)
    if (response.data.status === "successful") {
      // Retrieve cart items for the user
      const cartItems = await Cart.find({ userId }).populate("productId");

      // Prepare order details
      const orderDetails = cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      }));
  console.log("The quantity is: ", cartItems.quantity)
      const totalAmount = orderDetails.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Save order details
      const order = new Order({
        userId,
        products: orderDetails,
        totalAmount,
        paymentRef: transaction_id,
        status: "completed",
      });

      await order.save();

      // update the inStock count of each product
      for (const item of orderDetails) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { inStock: -item.quantity } },
          { new: true }
        );
      }

      // Clear user's cart after saving the order
      await Cart.deleteMany({ userId });

      return res.status(200).json({
        message: "Payment verified and order saved",
        data: response.data,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Payment verification failed"});
    }
  } catch (error) {
    res.status(500).json({
      message: "Error handling payment redirect",
      error: error.message,
    });
  }
};

module.exports = { handlePaymentRedirect };
