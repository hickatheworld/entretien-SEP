import { Request, Response, Router } from 'express';
import { getAvailableRooms, getBookedRooms, getRoom, getRooms } from '../models/Room';
const router = Router();

router.get('/all', async (_req: Request, res: Response) => {
	const rooms = await getRooms();
	res.json({ result: rooms });
});

router.get('/booked', async (_req: Request, res: Response) => {
	const rooms = await getBookedRooms();
	res.json({ result: rooms });
});

router.get('/available', async (_req: Request, res: Response) => {
	const rooms = await getAvailableRooms();
	res.json({ result: rooms });
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const details = await getRoom(parseInt(req.params.id));
		res.json({ result: details });
	} catch (e: any) {
		res.status(404).json({ error: e.message });
	}
});

export default router;