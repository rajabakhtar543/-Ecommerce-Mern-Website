const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/Db.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Import routers
const { router } = require('./config/Routes/authRouter.js');
const { categoryrouter } = require('./config/Routes/CategoryRoutes.js');
const { productrouter } = require('./config/Routes/ProductRoute.js');
const { ordersrouter } = require('./config/Routes/orderRoute.js');

// Initialize dotenv
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname,'../frontend/build')));

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 1000000, limit: '50mb' }));

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Routes
app.use('/api/v1/auth', router);
app.use('/api/v1/category', categoryrouter);
app.use('/api/v1/product', productrouter);
app.use('/api/v1/order', ordersrouter);
app.use('/api/webhook', express.raw({type: 'application/json'}));

// Product route to handle image upload
app.post('/api/v1/product/upload', upload.array('photos', 5), (req, res) => {
    const files = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ files });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        res.status(413).json({ error: 'Payload too large' });
    } else {
        next(err);
    }
});

// First API endpoint
app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'))
})

// Server setup
const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not specified in .env

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
