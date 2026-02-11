import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for guests? For now let's say optional or store name
    customerName: { type: String, required: true }, // For Guests or verified users
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: {
            en: { type: String, required: true },
            es: { type: String, required: true }
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        images: [{ type: String }]
    }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
