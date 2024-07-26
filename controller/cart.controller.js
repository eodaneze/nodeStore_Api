// controllers/cartController.js
const Cart = require("../model/cart.model");
const Product = require("../model/product.model");
const User = require("../model/user.model");
const {
  initializePayment,
  verifyPayment,
} = require("../service/payment.service");
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, quantity } = req.body;

    // validate if a user is logged in
    const user = User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Please login to add product to cart" });
    }
    // Validate the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Check if the quantity requested is available in stock
    if (quantity > product.inStock) {
      return res
        .status(400)
        .json({ message: `Only ${product.inStock} units available in stock` });
    }
    // Check if the product is already in the cart for the user
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      // If the product is already in the cart, update the quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // If the product is not in the cart, create a new cart item
      cartItem = new Cart({
        userId,
        productId,
        quantity,
      });
      await cartItem.save();
    }

    res.status(200).json({ message: "Product added to cart", cartItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product to cart", error: error.message });
  }
};
const viewCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItems = await Cart.find({ userId }).populate("productId");
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }
    let totalAmount = 0;

    cartItems.forEach((item) => {
      totalAmount += item.productId.price * item.quantity;
    });

    res.status(200).json({ cartItems, totalAmount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

const editCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.inStock) {
      return res.status(400).json({
        message: `Only ${product.inStock} units available in stock`,
      });
    }

    let cartItem = await Cart.findOne({ userId, productId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cart item", error: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cartItem = await Cart.findOneAndDelete({ userId, productId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    if (cartItem) {
      return res.status();
    }
    res.status(200).json({ message: "Cart item deleted", cartItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting cart item", error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await Cart.deleteMany({ userId });

    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

const checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { redirectUrl} = req.body;
    const cartItems = await Cart.find({ userId }).populate("productId");

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if user details (phone number and address) are updated
    if (!user.phone || !user.address) {
      return res.status(400).json({
        message:
          "Please update your phone number and address before checking out",
      });
    }
    let totalAmount = 0;

    cartItems.forEach((item) => {
      totalAmount += item.productId.price * item.quantity;
    });
    const paymentData = {
      tx_ref: `tx-${Date.now()}`,
      amount: totalAmount,
      currency: "NGN",
      redirect_url: `${redirectUrl}?userId=${userId}`,
      payment_type: "card",
      customer: {
        email: user.email,
        phonenumber: user.phoneNumber,
        name: `${user.firstName} ${user.lastName}`,
      },
      customizations: {
        title: "Payment for Products in Cart",
        description: "Payment for products in cart",
        logo: "https://example.com/logo.png",
      },
    };
    // Proceed with payment initialization
    const response = await initializePayment(paymentData);
    if (response.status !== "success") {
      return res
        .status(400)
        .json({ message: "Payment initialization failed", data: response });
    }
    const paymentUrl = response.data.link;
    // Redirect the user to the payment URL
    res.status(200).json({ message: "Payment initialized", paymentUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error initializing payment", error: error.message });
  }
};
module.exports = {
  addToCart,
  viewCart,
  editCart,
  deleteCartItem,
  clearCart,
  checkout,
};
