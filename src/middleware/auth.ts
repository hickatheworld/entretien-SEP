import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split('Bearer ')[1];
	if (!token)
		return res.status(401).json({ error: 'No token provided' });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'] }) as { username: string, role: string };
		req.body.username = decoded.username;
		req.body.role = decoded.role;
		next();
	} catch (e: any) {
		res.status(401).json({ error: e.message });
	}
};