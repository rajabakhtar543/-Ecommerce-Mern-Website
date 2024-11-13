const express = require('express');
const { requireSignin, isAdmin } = require('../../Users/Middlewares/authmiddleware');
const { CreateProductController, GetProductsController, SingleProductsController, productPhotoController, deleteProductController, updateProductController, productFiltersController, productCountController, productListController, searchProductController, CreateOfferProduct, GetOfferController, OfferPhotoController, deleteOfferController, updateOfferController, SingleofferController, categorycounts } = require('../Products/ProductController');
const ExpressFormidable = require('express-formidable');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const productrouter = express.Router();

productrouter.post('/create-product',requireSignin,isAdmin,CreateProductController)
productrouter.post('/get-product',GetProductsController)
productrouter.get('/get-product/:slug',SingleProductsController)

productrouter.delete('/delete-product/:pid',deleteProductController)
productrouter.put('/update-product/:pid',requireSignin,isAdmin,updateProductController)
productrouter.post("/product-filters", productFiltersController);
productrouter.post("/category-count", categorycounts);

//product count
productrouter.get("/product-count", productCountController);


productrouter.get("/product-list/:page", productListController);
productrouter.get("/search/:keyword", searchProductController);



module.exports = {productrouter}
