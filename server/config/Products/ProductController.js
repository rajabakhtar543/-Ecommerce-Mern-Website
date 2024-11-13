const fs = require('fs');
const { ProductSchema } = require('./ProductModel');
const { default: slugify } = require('slugify');
const { CategorySchema } = require('../Category/CategoryModel');



const CreateProductController = async (req,res) => {
    try {
        const { name, description, Orignalprice,Discountedprice, category,sizes,colors, stock, photos } = req.body;
    
        if (!name || !description || !Orignalprice ||!Discountedprice|| !category ||!sizes||!colors|| !stock || !photos) {
          return res.status(400).json({ error: 'All fields are required' });
        }
      
    
        const newProduct = new ProductSchema({
          name,
          description,
          Orignalprice,
          Discountedprice,
          sizes,
          colors,
          slug:slugify(name, {lower:true}),
          category,
          stock,
          photos
        });
    
        await newProduct.save();
    
        res.status(201).json({ success: true, newProduct });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }

}
const GetProductsController  = async (req,res)=>{
    try {
        const product = await ProductSchema.find({})
            .populate('category')
             // Exclude the 'photos' field from the default selection
            .limit(12)
            .sort({ createdAt: -1 });
    
        return res.status(200).send({
            success: true,
            message: 'All product list',
            TotalProducts: product.length,
            product // Changed 'product' to 'products' for consistency
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(404).send({
            success: false,
            message: 'Failed to get products',
            error: error.message // Send error message in the response
        });
    }
    
}
const SingleProductsController  = async (req,res)=>{
try {
    const product = await ProductSchema.findOne({slug:req.params.slug}).populate('category')
    return res.status(200).send({
        success:true,
        message: 'get product list',

        product
       
    })
    
} catch (error) {
    return res.status(404).send({
        success: false,
        message: 'Failed TO Get Single Product',
        error
    });
}
}

 const deleteProductController = async (req, res) => {
    try {
    const product =  await ProductSchema.findByIdAndDelete(req.params.pid);
      res.status(200).send({
        success: true,
        message: "Product Deleted successfully",
        product 

      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
  };
  
  //upate producta
  const updateProductController = async (req, res) => {
    try {
      const { name, description, Orignalprice,Discountedprice, category,sizes,colors, stock, photos } = req.body;
  
      // Check if all required fields are provided
      if (!name || !description || !Orignalprice ||!Discountedprice|| !category||!sizes ||!colors|| !stock || !photos) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Find the product by ID and update all fields
      const product = await ProductSchema.findByIdAndUpdate(
        req.params.pid,
        {
          name,
          description,
          Orignalprice,
          Discountedprice,
          sizes,
          colors,
          category,
          stock,
          photos,
          slug: slugify(name,{lower:true})
        },
        { new: true } // Return the updated document
      );
  
      // If the product is not found
      if (!product) {
        return res.status(404).send({
          success: false,
          message: 'Product not found'
        });
      }
  
      res.status(200).send({
        success: true,
        message: 'Product is updated',
        product
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'Product not updated',
        error
      });
    }
  };
  const productFiltersController = async (req, res) => {
    try {
      const { checked } = req.body;
      let args = {};
      if (checked.length > 0) args.category = { $in: checked };
  
      const products = await ProductSchema.find(args);
     
  
      res.status(200).send({
        success: true,
        products,
        
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error while filtering products",
        error,
      });
    }
  };
  const categorycounts = async (req, res) => {
    try {
    
      const categories = await CategorySchema.find({}); // Assuming you have a CategorySchema
  
      // Get the count of products for each category
      const categoryCounts = await Promise.all(
        categories.map(async (category) => {
          const count = await ProductSchema.countDocuments({ category: category._id });
          return { ...category._doc, count };
        })
      );
  
      res.status(200).send({
        success: true,
     
        categoryCounts,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error while filtering products",
        error,
      });
    }
  };
  
  // product count
 const productCountController = async (req, res) => {
    try {
      const total = await ProductSchema.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error in product count",
        error,
        success: false,
      });
    }
  };
  
  // product list base on page
   const productListController = async (req, res) => {
    try {
      const perPage = 6;
      const page = req.params.page ? req.params.page : 1;
      const products = await ProductSchema
        .find({})
     
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
    }
  };
  const searchProductController = async (req,res)=>{
   try {
    const { keyword } = req.params;
    const result = await ProductSchema.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    }).select("-photo");
  
    res.json(result);
    
   } catch (error) {
    console.log(error)
    res.status(404).send({
        success:false,
        message:"error in search products api",
        error
    })
   }

  }
  
      
  
module.exports ={CreateProductController,GetProductsController,SingleProductsController,updateProductController,deleteProductController,productListController,productCountController,productFiltersController,searchProductController,categorycounts}