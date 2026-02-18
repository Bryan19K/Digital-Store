import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import Product from '../models/Product';
import { protect, isAdmin } from '../middleware/auth';

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${timestamp}-${name}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed') as any, false);
        }
    }
});

// GET all products
router.get('/', async (req: Request, res: Response) => {
    try {
        const products = await Product.find({}).populate('category');
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET single product
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// POST create product (Admin only)
router.post('/', protect, isAdmin, upload.single('image'), async (req: Request, res: Response) => {
    try {
        const { nameEn, nameEs, price, category, descriptionEn, descriptionEs, imageUrl } = req.body;

        let imagePath = imageUrl;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const product = await Product.create({
            name: { en: nameEn, es: nameEs },
            price: Number(price),
            category,
            description: { en: descriptionEn, es: descriptionEs },
            images: imagePath ? [imagePath] : []
        });

        res.status(201).json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update product (Admin only)
router.put('/:id', protect, isAdmin, upload.single('image'), async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            const { nameEn, nameEs, price, category, descriptionEn, descriptionEs, imageUrl } = req.body;

            // Update fields if provided
            if (nameEn && nameEs) product.name = { en: nameEn, es: nameEs };
            if (price) product.price = Number(price);
            if (category) product.category = category;
            if (descriptionEn && descriptionEs) product.description = { en: descriptionEn, es: descriptionEs };

            // Start with existing logic for image
            let imagePath = imageUrl;

            // If new file uploaded, use it
            if (req.file) {
                imagePath = `/uploads/${req.file.filename}`;
            }

            // Only update images if we have a new path or explicit url
            if (imagePath) {
                product.images = [imagePath];
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE product (Admin only)
router.delete('/:id', protect, isAdmin, async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
