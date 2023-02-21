import dotenv from 'dotenv';
import express from 'express';
import ReservationRouter from './routes/reservations';
import RoomsRooter from './routes/rooms';
dotenv.config();

const app = express();


app.use(express.json());
app.use('/rooms', RoomsRooter);
app.use('/reservations', ReservationRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server listening on port :${port}`);
});
