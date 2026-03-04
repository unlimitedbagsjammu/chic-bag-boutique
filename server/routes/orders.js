const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendOrderNotifications } = require('../utils/notifications');

// Configure Multer for order screenshots
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/orders';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'order-screenshot-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create new order
router.post('/', upload.single('screenshot'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Payment screenshot is required' });
        }

        const screenshotUrl = `${req.protocol}://${req.get('host')}/uploads/orders/${req.file.filename}`;

        // Parse the order data which is sent as a stringified JSON field
        const orderData = JSON.parse(req.body.orderData);

        const order = new Order({
            ...orderData,
            paymentScreenshot: screenshotUrl
        });

        const newOrder = await order.save();

        // Trigger background notifications to admin and customer
        // We don't await this to avoid delaying the response to the customer
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
