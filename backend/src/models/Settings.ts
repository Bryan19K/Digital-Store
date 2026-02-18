import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    storeName: {
        type: String,
        default: 'Digital Store',
        required: true
    },
    heroImage: {
        type: String,
        default: '/uploads/default-hero.jpg'
    }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
