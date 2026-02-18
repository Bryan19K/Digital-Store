import express, { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import Settings from '../models/Settings';

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {

        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${timestamp}-${name}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)') as any, false);
        }
    }
});


router.get('/', async (req, res) => {
    try {

        let settings = await Settings.findOne();


        if (!settings) {
            settings = new Settings({
                storeName: 'Digital Store',
                heroImage: '/uploads/default-hero.jpg'
            });
            await settings.save();
        }

        res.json(settings);
    } catch (error: any) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }
});


router.put('/', upload.single('heroImage'), async (req, res) => {
    try {
        const { storeName } = req.body;


        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings();
        }

        if (storeName) {
            settings.storeName = storeName;
        }


        if (req.file) {
            settings.heroImage = `/uploads/${req.file.filename}`;
        }

        await settings.save();

        res.json({
            message: 'Settings updated successfully',
            settings
        });
    } catch (error: any) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
});

export default router;
