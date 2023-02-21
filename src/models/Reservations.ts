import { RowDataPacket } from 'mysql2';
import { db } from '../db';
import { randomBytes } from 'crypto';
import { Reservation, ReservationDetails } from '../types/Reservation';

export const getReservation = async (id: string): Promise<Reservation> => {
	const [rows] = await db.query('SELECT * FROM Reservations WHERE id = ?', [id]) as any[];
	if (rows.length === 0)
		throw new Error('Reservation not found');
	return rows[0] as Reservation;
}

export const getReservationsOfRoom = async (room: number, includePast = false): Promise<Reservation[]> => {
	const [check] = await db.query('SELECT 1 FROM Rooms WHERE id = ?', [room]) as any[];
	if (check.length === 0)
		throw new Error('Room not found');

	let query = 'SELECT * FROM Reservations WHERE room = ?';
	if (!includePast)
		query += ' AND end > NOW()';
	const [rows] = await db.query(query, [room]) as any[];
	return rows as Reservation[];
}

export const createReservation = async (reservation: ReservationDetails): Promise<string> => {
	const id = randomBytes(4).toString('hex');
	await db.query('INSERT INTO reservations (id, room, name, phone, email, start, end) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[id, reservation.room, reservation.name, reservation.phone, reservation.email, reservation.start, reservation.end]) as RowDataPacket[];
	return id;
}

export const editReservation = async (id: string, details: Partial<ReservationDetails>): Promise<void> => {
	const [rows] = await db.query('UPDATE reservations SET ? WHERE id = ?', [details, id]) as RowDataPacket[];
	if (rows.affectedRows === 0)
		throw new Error('Reservation not found');
}

export const deleteReservation = async (id: string): Promise<void> => {
	const [rows] = await db.query('DELETE FROM reservations WHERE id = ?', [id]) as RowDataPacket[];
	if (rows.affectedRows === 0)
		throw new Error('Reservation not found');
}
