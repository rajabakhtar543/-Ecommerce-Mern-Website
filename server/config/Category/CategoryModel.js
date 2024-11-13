const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const CategorySchema = mongoose.model('categories', new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        lowercase:true,
    },

}))
module.exports = {CategorySchema}