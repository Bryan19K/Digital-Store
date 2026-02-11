import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// POST new order
router.post('/', async (req, res) => {
    try {
        const { items, total, customerName, user } = req.body;

        
        const orderData = {
            items,
            total,
            customerName,
            user: user ? user.id : null 
        };

        const order = await Order.create(orderData);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET all orders (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/my-orders', async (req, res) => {
    
    try {
        const orders = await Order.find({}).sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
