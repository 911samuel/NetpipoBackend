import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users';

require('dotenv').config();

interface RequestWithUser extends Request {
    user?: any; 
}

const isUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.LOGIN_SECRET || 'I0H1A9G2sam');
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (user.role !== 'user') {
            return res.status(403).json({ message: 'Unauthorized: User is not a regular user' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in isUser middleware:", error);
        return res.status(401).json({ message: 'Invalid token', error: error });
    }
};

export default isUser;
