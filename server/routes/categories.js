import express from 'express';
import Category from '../models/Category.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// CREATE category (Admin only)
router.post('/', protect, isAdmin, async (req, res) => {
    try {
        const { name_es, name_en, slug } = req.body;
        const categoryExists = await Category.findOne({ slug });

        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name_es, name_en, slug });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE category (Admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const { name_es, name_en, slug } = req.body;
        const category = await Category.findById(req.params.id);

        if (category) {
            category.name_es = name_es || category.name_es;
            category.name_en = name_en || category.name_en;
            category.slug = slug || category.slug;

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE category (Admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            await Category.deleteOne({ _id: req.params.id });
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
