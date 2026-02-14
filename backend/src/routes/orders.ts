import express, { Request, Response } from 'express';
import Order from '../models/Order';

const router = express.Router();

// POST new order
router.post('/', async (req: Request, res: Response) => {
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
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// GET all orders (Admin)
router.get('/', async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({}).sort({ date: -1 });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/my-orders', async (req: Request, res: Response) => {

    try {
        const orders = await Order.find({}).sort({ date: -1 });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/:id/status', async (req: Request, res: Response) => {
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
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
