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

// MongoDB Connection status middleware
app.use(async (req, res, next) => {
    // If we're already connected, move on
    if (mongoose.connection.readyState === 1) {
        return next();
    }

    // Check if URI is present
    if (!process.env.MONGODB_URI) {
        console.error('❌ CRITICAL: MONGODB_URI is not defined');
        return res.status(500).json({
            error: 'Database Configuration Missing',
            message: 'Your MONGODB_URI environment variable is not set on Vercel. Please add it in project settings.'
        });
    }

    try {
        // Connect if not connected
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB (via Middleware)');
        next();
    } catch (err) {
        console.error('❌ MongoDB lazy connection error:', err.message);
        res.status(500).json({
            error: 'Database Connection Failed',
            details: err.message,
            suggestion: 'Double-check your MongoDB Atlas connection string and IP whitelist.'
        });
    }
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
