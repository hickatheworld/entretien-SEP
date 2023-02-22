import * as bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { getUser } from '../models/Users';
const router = Router();

router.post('/login', async (req: Request, res: Response) => {
	const { username, password } = req.body;
	try {
		const user = await getUser(username);
		if (!user)
			return res.status(401).json({ error: 'Invalid username' });
		const valid = await bcrypt.compare(password, user.password);
		if (!valid)
			return res.status(401).json({ error: 'Invalid password' });

		const access_token = jwt.sign({ username, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h', algorithm: 'HS256' });
		const refresh_token = jwt.sign({ username, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d', algorithm: 'HS256' });
		res.json({ access_token, refresh_token });
	} catch (e: any) {
		res.status(500).json({ error: e.message });
	}
});

router.post('/refresh', async (req: Request, res: Response) => {
	const { refresh_token } = req.cookies;
	if (!refresh_token)
		return res.status(401).json({ error: 'No refresh token provided' });
	try {
		const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET!, { algorithms: ['HS256'] }) as { username: string, role: string };
		const access_token = jwt.sign({ username: decoded.username, role: decoded.role }, process.env.JWT_SECRET!, { expiresIn: '1h', algorithm: 'HS256' });
		res.json({ access_token });
	} catch (e: any) {
		res.status(401).json({ error: e.message });
	}
});

export default router;