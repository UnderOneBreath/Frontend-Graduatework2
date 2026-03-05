// --- Company ---
// Связь: owner (user_id) → User 1..*, Company 0..*

export interface CompanyResponse {
	id: string;
	name: string;
	inn: number;
	ogrn: number;
	phone: string;
	address: string;
	logo: number; // UInt64 — идентификатор/ссылка на изображение
	email: string;
	owner: string; // UUID пользователя-владельца
	brief_name: string;
}

export interface CompanyCreateRequest {
	name: string;
	inn: number;
	ogrn: number;
	phone: string;
	address: string;
	logo?: number;
	email: string;
	owner: string; // user_id
	brief_name: string;
}

export interface CompanyUpdateRequest {
	name?: string;
	inn?: number;
	ogrn?: number;
	phone?: string;
	address?: string;
	logo?: number;
	email?: string;
	brief_name?: string;
}
