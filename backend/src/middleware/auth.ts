import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
    id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // console.log('Token received:', token.substring(0, 10) + '...'); 
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            req.user = await User.findById(decoded.id).select('-password');
            return next();
        } catch (error) {
            console.error('Auth Error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log('No Authorization header found or invalid format:', req.headers.authorization);
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
