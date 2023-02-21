import { Request, Response, Router } from 'express';
import Joi from 'joi';
import { createReservation, deleteReservation, editReservation, getReservation, getReservationsOfRoom } from '../models/Reservations';
import { ReservationDetails } from '../types/Reservation';

const router = Router();

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const details = await getReservation(req.params.id);
		res.json({ result: details });
	} catch (e: any) {
		res.status(404).json({ error: e.message });
	}
});

router.get('/of/:room', async (req: Request, res: Response) => {
	try {
		const details = await getReservationsOfRoom(parseInt(req.params.room), req.query.includePast === 'true');
		res.json({ result: details });
	} catch (e: any) {
		res.status(404).json({ error: e.message });
	}
});

async function handlerCU(req: Request, res: Response) {
	const { method } = req;
	let schema = Joi.object<ReservationDetails>({
		room: Joi.number(),
		name: Joi.string(),
		phone: Joi.string(),
		email: Joi.string(),
		start: Joi.date(),
		end: Joi.date()
	});
	try {
		// this handler is only used for POST /create or PATCH /edit/:id
		if (method === 'POST') {
			const details = await schema.required().validateAsync(req.body.data);
			const id = await createReservation(details);
			res.json({ result: id });
		} else {
			schema = schema.or('room', 'name', 'phone', 'email', 'start', 'end');
			const details = await schema.validateAsync(req.body.data);
			await editReservation(req.params.id, details);
			res.json({ message: 'Resource updated successfully' });
		}
	} catch (e: any) {
		res.status(400);
		if (e.message.includes('Check constraint'))
			e.message = 'The start date must be before the end date';
		else if (e.message.includes('foreign key constraint'))
			e.message = 'The room does not exist';
		else if (e.message === 'Reservation not found')
			res.status(404);
		res.json({ error: e.message });
		return;
	}
}

router.post('/create', handlerCU);
router.patch('/edit/:id', handlerCU);

router.delete('/delete/:id', async (req: Request, res: Response) => {
	try {
		await deleteReservation(req.params.id);
		res.json({ message: 'Reservation deleted' });
	} catch (e: any) {
		if (e.message === 'Reservation not found')
			res.status(404).json({ error: e.message });
		else
			res.status(400).json({ error: e.message });
		return;
	}
});



export default router;