const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
         type: String,
         require: [true, "Product name is required"],
    },
    price: {
         type: Number,
         require: [true, "Product Price is required"],
    },
    description: {
         type: String,
         require: [true, "Product description is required"],
    },
    category: {
         type: String,
         require: [true, "Product category is required"],
    },
    inStock: {
         type: Number,
         require: [true, "Product count in stock is required"],
    },
    image: {
         type: String,
         require: [true, "Product image is required"],
    },
})

module.exports = mongoose.model("Product", productSchema);