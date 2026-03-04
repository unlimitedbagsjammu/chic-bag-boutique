const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const multer = require('multer');
const { sendOrderNotifications } = require('../utils/notifications.cjs');

// Configure Multer for In-Memory Storage (Required for Vercel Serverless)
// This will store the screenshots in MongoDB as a Base64 string.
// No separate storage (like Cloudinary or local disk) is required.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create new order
router.post('/', upload.single('screenshot'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Payment screenshot is required' });
        }

        // Convert to Base64 Data URI
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const screenshotUrl = dataURI; // No hardcoded localhost

        // Parse the order data which is sent as a stringified JSON field
        const orderData = JSON.parse(req.body.orderData);

        const order = new Order({
            ...orderData,
            paymentScreenshot: screenshotUrl
        });

        const newOrder = await order.save();

        // Trigger background notifications to admin and customer
        sendOrderNotifications(newOrder);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(400).json({ message: error.message });
    }
});

// Get all orders (Admin only)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
