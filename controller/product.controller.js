const Product = require('../model/product.model')

const addProduct = async(req, res) => {
    try{
        const {name, price, category, inStock, description} = req.body;
       const image = req.file.path // the image path is going to be provided by cloudinary


        const newProduct = new Product({
              name,
              price,
              category,
              inStock,
              description,
              image
        })

        await newProduct.save();

        res.status(200).json({message: "New product have been added successfully", product: newProduct})
    
    }catch(error){
        console.log(error)
       res.status(500).send("internal server error")
    }

}

const editProduct = async(req, res) => {
    try{
        const {id} = req.params;
        const { name, price, category, inStock, description } = req.body;

        let updatedFields = {};

        if(name) updatedFields.name = name;
        if(price) updatedFields.price = price;
        if(description) updatedFields.description = description;
        if(category) updatedFields.category = category;
        if(inStock) updatedFields.inStock = inStock;

        if(req.file){
              const image = req.file.path // path is coming from cloudinary
              updatedFields.image = image
        }

        const updateProduct = await Product.findByIdAndUpdate(id, updatedFields, {new: true});

        if (!updateProduct){
          return res.status(404).send("error updating product");
        }
        res.status(200).json({message: "Product have been updated succesfully", product: updateProduct})
    }catch(error){
        console.log(error);
        res.status(500).send("internal server error")
    }
}
module.exports = { addProduct, editProduct };