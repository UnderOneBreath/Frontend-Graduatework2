// --- Organizer (Company) ---

export interface OrgUserLink {
	org_id: string;
	user_id: string;
}

export interface CompanyResponse {
	id: string;
	name: string;
	inn: number;
	ogrn: number;
	phone: string;
	address: string;
	logo: string | null;
	email: string;
	payment_card?: string | null;
	payment_account?: string | null;
	bank_name?: string | null;
	bik?: string | null;
	payment_note?: string | null;
	employees: OrgUserLink[];
}

export interface CompanyCreateRequest {
	name: string;
	inn: number;
	ogrn: number;
	phone: string;
	address: string;
	logo?: string;
	email: string;
	password: string;
}

export interface CompanyUpdateRequest {
	name?: string;
	inn?: number;
	ogrn?: number;
	phone?: string;
	address?: string;
	logo?: string;
	email?: string;
	payment_card?: string | null;
	payment_account?: string | null;
	bank_name?: string | null;
	bik?: string | null;
	payment_note?: string | null;
}
