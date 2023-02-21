import { RowDataPacket } from 'mysql2';
import { db } from '../db';
import { Room } from '../types/Room';

export const getRooms = async (): Promise<Room[]> => {
	const [rows] = await db.query('SELECT * FROM rooms') as any[];
	return rows as Room[];
}

export const getRoom = async (id: number): Promise<Room> => {
	const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [id]) as RowDataPacket[];
	if (rows.length === 0)
		throw new Error('Room not found');
	return rows[0] as Room;
}

export const getBookedRooms = async (): Promise<Room[]> => {
	const [rows] = await db.query('SELECT DISTINCT r.* FROM Rooms r LEFT JOIN Reservations rs ON r.id = rs.room WHERE rs.start <= NOW() AND rs.end >= NOW()');
	return rows as Room[];
}

export const getAvailableRooms = async (): Promise<Room[]> => {
	const [rows] = await db.query('SELECT DISTINCT r.* FROM Rooms r LEFT JOIN Reservations rs ON r.id = rs.room WHERE rs.room is NULL OR rs.end < NOW() OR rs.start > NOW()');
	return rows as Room[];
}