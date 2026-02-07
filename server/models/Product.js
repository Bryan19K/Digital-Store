import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true },
        es: { type: String, required: true }
    },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number }, // Optional
    description: {
        en: { type: String, required: true },
        es: { type: String, required: true }
    },
    images: [{ type: String, required: true }],
    inStock: { type: Boolean, default: true },
    isNew: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
