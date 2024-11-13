const express = require('express')
const { requireSignin, isAdmin } = require('../../Users/Middlewares/authmiddleware')
const {CreateCategoryController,UpdateCategoryController, CategoryController, SingleCategoryController, DeleteCategoryController} = require('../Category/CategoryController')
const categoryrouter = express.Router();

categoryrouter.post('/create-category',requireSignin,isAdmin,CreateCategoryController)
categoryrouter.put('/update-category/:id',requireSignin,isAdmin,UpdateCategoryController)
categoryrouter.delete('/delete-category/:id',requireSignin,isAdmin,DeleteCategoryController)
categoryrouter.get('/all-category',CategoryController)
categoryrouter.get('/single-category/:slug',SingleCategoryController)



module.exports = {categoryrouter}
