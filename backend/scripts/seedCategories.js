import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const categorySchema = new mongoose.Schema({
    name_es: { type: String, required: true },
    name_en: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    color: { type: String, default: '#808080' }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true },
        es: { type: String, required: true }
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true, strict: false });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const categories = [
    { name_es: 'Ropa', name_en: 'Clothing', slug: 'clothing', color: '#3b82f6' },
    { name_es: 'Accesorios', name_en: 'Accessories', slug: 'accessories', color: '#6b7280' },
    { name_es: 'Relojes', name_en: 'Watches', slug: 'watches', color: '#eab308' },
    { name_es: 'Shorts', name_en: 'Shorts', slug: 'shorts', color: '#22c55e' },
    { name_es: 'Suéteres', name_en: 'Sweaters', slug: 'sweaters', color: '#f97316' },
    { name_es: 'Gorras', name_en: 'Caps', slug: 'caps', color: '#ef4444' },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        
        const createdCategories = [];
        for (const cat of categories) {
            const existing = await Category.findOne({ slug: cat.slug });
            if (existing) {
                existing.color = cat.color;
                existing.name_es = cat.name_es;
                existing.name_en = cat.name_en;
                await existing.save();
                createdCategories.push(existing);
                console.log(`Updated category: ${cat.name_en}`);
            } else {
                const newCat = await Category.create(cat);
                createdCategories.push(newCat);
                console.log(`Created category: ${cat.name_en}`);
            }
        }

   
        const products = await Product.find({});
        console.log(`Found ${products.length} products to check`);

        for (const product of products) {
            let assignedCat = null;
            const nameLower = (product.name.es + ' ' + product.name.en).toLowerCase();

            if (nameLower.includes('jersey') || nameLower.includes('chaqueta')) {
                assignedCat = createdCategories.find(c => c.slug === 'clothing');
            } else if (nameLower.includes('gorra') || nameLower.includes('cap')) {
                assignedCat = createdCategories.find(c => c.slug === 'caps');
            } else if (nameLower.includes('short')) {
                assignedCat = createdCategories.find(c => c.slug === 'shorts');
            } else if (nameLower.includes('reloj') || nameLower.includes('watch')) {
                assignedCat = createdCategories.find(c => c.slug === 'watches');
            } else if (nameLower.includes('sueter') || nameLower.includes('sweater') || nameLower.includes('hoodie')) {
                assignedCat = createdCategories.find(c => c.slug === 'sweaters');
            }

            if (assignedCat) {
                product.category = assignedCat._id;
                await product.save();
                console.log(`Reassigned "${product.name.en}" to "${assignedCat.name_en}"`);
            }
        }

        console.log('Seeding and reassigning completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}

seed();
