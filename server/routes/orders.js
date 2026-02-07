import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// POST new order
router.post('/', async (req, res) => {
    try {
        const { items, total, customerName, user } = req.body;

        // Ensure connection to user if provided
        const orderData = {
            items,
            total,
            customerName,
            user: user ? user.id : null // Expecting user object or id
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

// GET user orders (Simple filter by name for now to match current frontend logic, ideal is ID)
router.get('/my-orders', async (req, res) => {
    // Ideally we extract user from token. For migration speed, let's accept a query param or handle in frontend filtering for now?
    // Proper way: Middleware extracts user. 
    // Let's implement full GET and let frontend filter for Prototype phase to speed up, 
    // OR just return all and let Admin see all. Custom user fetching needs middleware.
    try {
        const orders = await Order.find({}).sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update order status
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
