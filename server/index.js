require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

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

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Chic Bag Boutique API is running...');
});

// MongoDB Connection status middleware
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        if (!process.env.MONGODB_URI) {
            return res.status(500).json({
                error: 'Configuration Error',
                message: 'MONGODB_URI is missing in environment variables. Please add it to Vercel.'
            });
        }
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('✅ Connected to MongoDB (Lazy Load)');
            next();
        } catch (err) {
            console.error('❌ MongoDB lazy connection error:', err);
            res.status(500).json({ error: 'Database Connection Error', details: err.message });
        }
    } else {
        next();
    }
});

// Initial lazy connection attempt
mongoose.connect(process.env.MONGODB_URI).catch(() => { });

// Conditionally listen for local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running locally on port ${PORT}`);
    });
}

// Export for Vercel Serverless
module.exports = app;
