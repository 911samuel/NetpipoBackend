import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users'; 

require('dotenv').config();

interface AuthenticatedRequest extends Request {
    user?: any; 
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Missing Authorization Header' });
        }
        const secret = process.env.LOGIN_SECRET || 'I0H1A9G2sam';
        
        if (!secret) {
            return res.status(500).json({ error: 'Server misconfiguration: Missing login token secret' });
        }
        const decodedToken = jwt.verify(token, secret);

        if (typeof decodedToken === 'string') {
            return res.status(401).json({ error: 'Invalid token format' });
        }
        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        (req as AuthenticatedRequest).user = user; 
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
};

export default authenticate;
