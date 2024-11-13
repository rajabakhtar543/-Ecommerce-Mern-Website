const { default: slugify } = require("slugify");
const { CategorySchema } = require("./CategoryModel");

const CreateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(404).send({
                message: 'Name Is Required'
            });
        }
      
        const existingCategory = await CategorySchema.findOne({ name });
    
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category Already Exist'
            });
        }
       
        const category = await new CategorySchema({ name, slug: slugify(name) }).save();
       
        res.status(200).send({
            success: true,
            message: 'Category Created',
            category
        });
    } catch (error) {
        return res.status(404).send({
            success: false,
            message: 'Category Not Created',
            error
        });
    }
};




const UpdateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
      
        const category = await CategorySchema.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Category Updated',
            category
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: 'Category Not Updated',
            error
        });
    }
};

const CategoryController = async (req,res) =>{
    try {
        const category = await CategorySchema.find({});
        res.status(200).send({
            success: true,
            message:'All category list',
            category
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            message:'Failed To Get Category',
            error
        })
        
    }

}

const SingleCategoryController=async(req,res)=>{
    try {
        const category = await CategorySchema.findOne({slug:req.params.slug})
        res.status(200).send({
            success: true,
            message:'Catagory list',
            category
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            message:'Failed To Get Category',
            error
        })
    }

}
const DeleteCategoryController = async (req,res)=>{
try {
    const{id} = req.params;
    const category =await CategorySchema.findByIdAndDelete(id)
    res.status(200).send({
        success: true,
        message:'Catagory Deleted',
        category
    })
} catch (error) {
    res.status(404).send({
        success: false,
        message:'Failed To Delete Category',
        error
    })
}
}
module.exports = {CreateCategoryController,UpdateCategoryController,CategoryController,SingleCategoryController,DeleteCategoryController};