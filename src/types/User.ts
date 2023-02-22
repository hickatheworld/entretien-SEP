export interface User { 
	username: string;
	/* Encrypted password from the database */
	password: string;
	role: 'admin' | 'user';
}