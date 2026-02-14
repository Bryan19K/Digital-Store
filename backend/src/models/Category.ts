import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name_es: { type: String, required: true },
    name_en: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    color: { type: String, default: '#808080' }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
