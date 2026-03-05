// Enums
export enum LotteryStatus {
	Active = "active",
	Completed = "completed",
}

//Lottery

export interface LotteryResponse {
	id: string;
	name: string;
	start_date: string; // ISO datetime string
	end_date: string; // ISO datetime string
	max_entries: number;
	status: LotteryStatus;
	company_id: string;
	prizes?: PrizeResponse[];
}

export interface LotteryCreateRequest {
	name: string;
	start_date: string;
	end_date: string;
	max_entries: number;
	status: LotteryStatus;
	company_id: string;
}

export interface LotteryUpdateRequest {
	name?: string;
	start_date?: string;
	end_date?: string;
	max_entries?: number;
	status?: LotteryStatus;
}

//Prize

export interface PrizeResponse {
	id: string;
	name: string;
	description: string;
	img_path: string;
	price: number;
	lottery_id: string;
}

export interface PrizeCreateRequest {
	name: string;
	description: string;
	img_path: string;
	price: number;
	lottery_id: string;
}

export interface PrizeUpdateRequest {
	name?: string;
	description?: string;
	img_path?: string;
	price?: number;
}

//Ticket

export interface TicketResponse {
	id: string;
	purchase_date: string; // ISO datetime
	is_winner: boolean;
	price: number;
	serial_number: number;
	lottery_id: string;
	user_id: string;
	prize_id?: string | null; // set when ticket wins a prize
}

export interface TicketCreateRequest {
	lottery_id: string;
	user_id: string;
}

//Notification

export interface NotificationResponse {
	id: string;
	description: string;
	status: boolean;
	views: number;
	lottery_id: string;
}

export interface NotificationCreateRequest {
	description: string;
	lottery_id: string;
}
