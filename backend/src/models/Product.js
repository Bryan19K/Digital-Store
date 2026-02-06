const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Cambiamos String por un objeto con idiomas
    name: {
        en: { type: String, required: true },
        es: { type: String, required: true }
    },
    description: {
        en: { type: String, required: true },
        es: { type: String, required: true }
    },
    price: { type: Number, required: true },
    // Mantengo tu lógica de categorías por ObjectId
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);