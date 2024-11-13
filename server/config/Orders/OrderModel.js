const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    products: [{
        name: { type: String },
        photos: [{ type: String }],
        Discountedprice: { type: String },
      
        selectedSize: { type: String },
        selectedColor: { type: String },
        quantity: { type: Number }
    }], // Assuming Product is another schema
    payment: { type: String },
    total: { type: Number }, // Store payment ID as a string
    buyer: { type: Schema.Types.ObjectId, ref: 'users' },
    status: {
        type: String,
        default: "NonStarted",
        enum: ["NonStarted", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order; 
