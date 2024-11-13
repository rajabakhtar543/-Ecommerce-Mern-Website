const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const ProductSchema = mongoose.model('Products', new Schema({

    name : { type: String, required: true },
    slug : { type: String, required: true },
    description : { type: String, required: true },
    Orignalprice : { type: Number, required: true },
    Discountedprice : { type: Number, required: true },
    sizes: [{ type: String }], // Array of sizes
    colors: [{ type: String }],
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    }],
    quantity: {
        type: Number,
        // Set the default value to 1
      },

      photos: [
        {
          type: String,
          required: true,
        },
      ],
    stock : { type: Boolean },
},{timestamps : true}));

module.exports = {ProductSchema}