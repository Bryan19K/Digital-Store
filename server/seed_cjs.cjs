const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const categories = [
    { name_es: 'Ropa', name_en: 'Clothing', slug: 'clothing', color: '#3b82f6' },
    { name_es: 'Accesorios', name_en: 'Accessories', slug: 'accessories', color: '#6b7280' },
    { name_es: 'Relojes', name_en: 'Watches', slug: 'watches', color: '#eab308' },
    { name_es: 'Shorts', name_en: 'Shorts', slug: 'shorts', color: '#22c55e' },
    { name_es: 'Suéteres', name_en: 'Sweaters', slug: 'sweaters', color: '#f97316' },
    { name_es: 'Gorras', name_en: 'Caps', slug: 'caps', color: '#ef4444' },
];

async function run() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MONGO_URI not found in .env');
        process.exit(1);
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db();
        const catCol = db.collection('categories');
        const prodCol = db.collection('products');

        const createdCats = [];
        for (const cat of categories) {
            const res = await catCol.findOneAndUpdate(
                { slug: cat.slug },
                { $set: { ...cat, updatedAt: new Date() } },
                { upsert: true, returnDocument: 'after' }
            );
            createdCats.push(res);
            console.log(`Seeded category: ${cat.name_en}`);
        }

        const products = await prodCol.find({}).toArray();
        for (const p of products) {
            let assigned = null;
            const text = (p.name.es + ' ' + p.name.en).toLowerCase();

            if (text.includes('jersey') || text.includes('chaqueta')) {
                assigned = createdCats.find(c => c.slug === 'clothing');
            } else if (text.includes('gorra') || text.includes('cap')) {
                assigned = createdCats.find(c => c.slug === 'caps');
            } else if (text.includes('short')) {
                assigned = createdCats.find(c => c.slug === 'shorts');
            } else if (text.includes('reloj') || text.includes('watch')) {
                assigned = createdCats.find(c => c.slug === 'watches');
            } else if (text.includes('sueter') || text.includes('sweater') || text.includes('hoodie')) {
                assigned = createdCats.find(c => c.slug === 'sweaters');
            }

            if (assigned) {
                await prodCol.updateOne(
                    { _id: p._id },
                    { $set: { category: assigned._id } }
                );
                console.log(`Reassigned: ${p.name.en} -> ${assigned.name_en}`);
            }
        }
        console.log('Done!');
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        process.exit(0);
    }
}

run();
