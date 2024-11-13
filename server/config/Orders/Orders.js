const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Order = require('./OrderModel');

const { UserSchema } = require('../../Users/usersModel');


dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_API_SECRET);



const PaymentController = async (req, res) => {
   const { cart, user,totalrevenue } = req.body;

    // Validate user data
    if (!user.name || !user.email || !user.phone || !user.address) {
        return res.status(400).json({
            success: false,
            message: "User information incomplete"
        });
    }
    let existingUser = await UserSchema.findOne({ email: user.email });

   
    

    const lineItems = cart.map((product) => {
        const unitAmount = Math.round((product.Discountedprice || 0) * 100); // Default to 0 if Discountedprice is not valid
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                    // Ensure product name is correctly assigned
                },
                unit_amount: unitAmount,
            },
            quantity: product.quantity || 1, // Default quantity to 1 if not provided
        };
    });

    try {
        // Calculate total amount based on cart
        let amount = lineItems.reduce((total, item) => {
            return total + (item.price_data.unit_amount * item.quantity);
        }, 0);

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        // Save order to MongoDB
        const order = new Order({
            products: cart,
            payment: paymentIntent.status === 'succeeded' ? 'success' : 'false',
            buyer: existingUser._id,
            total:totalrevenue,
        });
        await order.save();

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret,
            session_id: session.id,
            order_id: order._id, // Include order ID in the response
        });
    } catch (error) {
        console.error("Payment error:", error);
        res.status(500).json({ error: "Payment failed" }); // Send an error response
    }
};
const saveOrderController = async (req, res) => {
    const { orderId, paymentId } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            orderId,
            { payment: paymentId, status: 'paid' }, 
            { new: true }
        );

        res.status(200).json({
            success: true,
            order: order,
            message: "Order payment information saved successfully",
        });
    } catch (error) {
        console.error("Error saving order payment information:", error);
        res.status(500).json({ error: "Failed to save order payment information" });
    }
};
const getTotalRevenue=async(req,res)=>{
  try{
    const orders = await Order.find()
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  res.status(200).send({
    success: true,
    totalRevenue,
  });
} catch (error) {
  console.log(error);
  res.status(400).send({
    message: "Error in Total Revenue",
    error,
    success: false,
  });
}

}
const getOrderController = async (req, res) => {
    try {
        const { Id } = req.body;
        console.log(Id)
        const orders = await Order.find({ "buyer": Id }).populate("products");
      console.log(orders)
     
      res.json(orders);
    } catch (error) {
      console.error("Error in getOrderController:", error);
      res.status(500).send({
        success: false,
        message: "Error while Getting Orders"
      });
    }
  };
  const OrderCountController = async (req, res) => {
    try {
      const totalOrder = await Order.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        totalOrder,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error in Order count",
        error,
        success: false,
      });
    }
  }; 
 const getAllOrderController = async (req, res) => {
    try {
      const orders = await Order.find({})
      .populate('products')
      .populate('buyer')
      .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.log(error); // Log the error for debugging
      res.status(500).send({
        success: false,
        Message: "Error while Getting Orders",
      });
    }
  };
  

     const orderStatusController = async (req, res) => {
        try {
          const { orderId } = req.params;
          const { status } = req.body;
          const orders = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
          );
          res.json(orders);
        } catch (error) {
          console.log(error);
          res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
          });
        }
      };
      const getMonthlySalesData = async (req, res) => {
        try {
          const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          const salesData = await Order.aggregate([
            {
              $match: {
                createdAt: { $gte: startOfMonth }
              }
            },
            {
              $group: {
                _id: { $dayOfMonth: "$createdAt" },
                total: { $sum: "$total" },   
                orderCount: { $sum: 1 }
              }
            },
            {
              $sort: { _id: 1 }
            }
          ]);
      
          res.status(200).json({
            success: true,
            salesData
          });
        } catch (error) {
          console.error("Error fetching sales data:", error);
          res.status(500).json({
            success: false,
            message: "Error fetching sales data"
          });
        }
      };
      
module.exports = { PaymentController,getMonthlySalesData,getOrderController,getAllOrderController,orderStatusController,saveOrderController,OrderCountController,getTotalRevenue};
