export const RequestStatus = {
	pending: "pending",
	accepted: "accepted",
	rejected: "rejected",
} as const;
export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

export interface OrganizerApplicationCompany {
	name: string;
	inn: number;
	ogrn: number;
	phone: string;
	address: string;
	email: string;
	logo?: any;
}

export interface ApplicationCreateRequest {
	name: string;
	inn: number;
	ogrn: number;
	phone: string;
	address: string;
	email: string;
	logo?: string | null;
}

export interface OrganizerApplication {
	id: string;
	user_id: string;
	company_data: OrganizerApplicationCompany;
	status: RequestStatus;
	rejection_reason: string | null;
	created_at: string;
}

export interface ApplicationUpdateRequest {
	status: "accepted" | "rejected";
	rejection_reason?: string;
}
