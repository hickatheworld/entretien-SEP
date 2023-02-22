import dotenv from 'dotenv';
import express from 'express';
import { auth } from './middleware/auth';
import AuthRooter from './routes/auth';
import ReservationRouter from './routes/reservations';
import RoomsRooter from './routes/rooms';
dotenv.config();

const app = express();

app.use(express.json());
app.use('/auth', AuthRooter);
app.use(auth);
app.use('/rooms', RoomsRooter);
app.use('/reservations', ReservationRouter);

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (err.name === 'UnauthorizedError') {
		res.status(401).json({ error: err.message });
		return;
	}
	next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server listening on port :${port}`);
});
