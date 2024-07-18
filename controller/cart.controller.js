const Cart = require('../model/cart.model')
const Product = require('../model/product.model')
const User = require('../model/user.model')


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
module.exports = { addToCart, viewCart };