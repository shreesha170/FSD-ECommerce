const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
    const { name, description, price, stock } = req.body;

    try {
        const product = new Product({
            name,
            description,
            price,
            stock
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/products - Retrieve all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/products/:id - Update a product by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    try {
        // Find and update the product by ID
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, stock },
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE /api/products/:id - Delete a product by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the product by ID
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
