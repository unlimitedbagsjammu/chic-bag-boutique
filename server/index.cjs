require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/products.cjs');
const orderRoutes = require('./routes/orders.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
}));

// Add PNA support for local development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Private-Network', 'true');
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB once on startup or serverless container boot
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('❌ CRITICAL: MONGODB_URI is not defined in environment variables.');
            return;
        }

        if (mongoose.connection.readyState >= 1) {
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
    }
};

connectDB();

// Fast-fail middleware if db is totally absent
app.use((req, res, next) => {
    if (!process.env.MONGODB_URI) {
        return res.status(500).json({
            error: 'Database Configuration Missing',
            message: 'Your MONGODB_URI environment variable is not set.'
        });
    }
    next();
});


// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Chic Bag Boutique API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(err.statusCode || 500).json({
        error: err.name || 'Internal Server Error',
        message: err.message || 'Something went wrong!',
    });
});

// Conditionally listen for local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running locally on port ${PORT}`);
    });
}

// Export for Vercel Serverless
module.exports = app;
