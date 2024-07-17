const Product = require('../model/product.model')

const addProduct = async(req, res) => {
    try{
        const {name, price, category, inStock, description} = req.body;
        const image = req.files.map((file) => file.path);


        const newProduct = new Product({
              name,
              price,
              category,
              inStock,
              description,
              image
        })

        await newProduct.save();

        res.status(200).json({message: "New product have been added successfully", newProduct})
    
    }catch(error){

    }

}
module.exports = { addProduct };