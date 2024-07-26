const Cart = require('../model/cart.model')
const Product = require('../model/product.model')
const User = require('../model/user.model');
const { initializePayment } = require("../service/payment.service");


const addToCart = async(req, res) => {
     try{
          const userId = req.user._id;

          const {productId, quantity} = req.body;

        //   check if the product exists
        const product = await Product.findById(productId);
        if(!product){
             return res.status(404).json({message: "product not found"})
        }
        // check if the quantity requested is available inStock

        if(quantity > product.inStock){
             return res.status(400).json({message: `Only ${product.inStock} units available in stock`})
        }

        // check if the product is already in the cart for the user
        
        let cartItem = await Cart.findOne({userId, productId});
        if(cartItem){
            //  if the product is already in the cart, update the quantity
            cartItem.quantity += quantity
            await cartItem.save();
        }else{
            //  if the product is not in cart, then add it to the cart
            cartItem = new Cart({
                 userId,
                 productId,
                 quantity
            })
            await cartItem.save();
        }
        res.status(200).json({message: "product have been added to cart successfully", cartItem})
     }catch(error){
        res.status(500).send(error)
     }
}

const viewCart = async(req, res) => {
     try{
         const userId = req.user._id;
         const cartItems = await Cart.find({userId}).populate("productId");
         
         if(!cartItems){
             res.status(404).json({message: "Your cart is empty"});
         }
         let totalAmount = 0;

         cartItems.forEach((item) => {
           totalAmount += item.productId.price * item.quantity;
         });
         res.status(200).json({cartItems, totalAmount})
     }catch(error){
         res.status(500).send(error)
     }
}

const deleteCart = async(req, res) => {
      try{
          const userId = req.user._id;
          const {productId} = req.params;

          const cartItem = await Cart.findOneAndDelete({userId, productId});
          if(cartItem.length === 0){
                return res.status(400).send("Your cart is empty")
          }
          res.status(200).json({message: "cart item have been deleted successfully", cartItem})
      }catch(error){
           res.status(500).send(error)
      }
}

const clearCart = async(req, res) => {
       try{
           const userId = req.user._id;

           await Cart.deleteMany({userId});

           res.status(200).json({message: "Cart have been cleared successfully"})
       }catch(error){
           res.status(500).json({message: "Error clearing cart", error})
       }
}


const checkout = async (req, res) => {
  try {
     const userId  = req.user._id
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
      redirect_url: redirectUrl,
      payment_type: "card",
      customer: {
        email: user.email,
        phonenumber: user.phone,
        name: user.firstName,
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



module.exports = { addToCart, viewCart, deleteCart, clearCart, checkout };