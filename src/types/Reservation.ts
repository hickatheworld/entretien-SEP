export interface ReservationDetails {
	room: number;
	name: string;
	email: string;
	phone: string;
	start: Date;
	end: Date;
}

export interface Reservation extends ReservationDetails {
	id: string;
}