const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');

// Configure Multer for In-Memory storage (Required for Vercel Serverless)
// This will store the image in MongoDB as a Base64 string.
// No separate storage (like Cloudinary or local disk) is required.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload image route (converts to Base64)
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert to Base64 Data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    res.json({ secure_url: dataURI });
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products.map(p => ({
            id: p._id,
            ...p._doc
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ id: product._id, ...product._doc });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json(products.map(p => ({
            id: p._id,
            ...p._doc
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add product
router.post('/', async (req, res) => {
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json({ id: newProduct._id, ...newProduct._doc });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update product
router.patch('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete all products
router.delete('/', async (req, res) => {
    try {
        await Product.deleteMany({});
        res.json({ message: 'All products deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
