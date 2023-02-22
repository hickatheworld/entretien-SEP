import * as bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';
import { db } from '../db';
import { User } from '../types/User';

export const getUser = async (username: string): Promise<User | null> => {
	const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]) as RowDataPacket[];
	if (rows.length === 0)
		return null;
	return rows[0] as User;
}

export const createUser = async (username: string, password: string, role: 'user' | 'admin' = 'user'): Promise<void> => {
	const encrypted = await bcrypt.hash(password, 10);
	await db.query('INSERT INTO Users VALUES (?, ?, ?)', [username, encrypted, role]);
}

export const deleteUser = async (username: string): Promise<void> => {
	const [rows] = await db.query('DELETE FROM Users WHERE username = ?', [username]) as RowDataPacket[];
	if (rows.affectedRows === 0)
		throw new Error('User not found');
}

export const changePassword = async (username: string, password: string): Promise<void> => {
	const encrypted = await bcrypt.hash(password, 10);
	const [rows] = await db.query('UPDATE Users SET password = ? WHERE username = ?', [encrypted, username]) as RowDataPacket[];
	if (rows.affectedRows === 0)
		throw new Error('User not found');
}

export const changeRole = async (username: string, role: 'user' | 'admin'): Promise<void> => {
	const [rows] = await db.query('UPDATE Users SET role = ? WHERE username = ?', [role, username]) as RowDataPacket[];
	if (rows.affectedRows === 0)
		throw new Error('User not found');
}
