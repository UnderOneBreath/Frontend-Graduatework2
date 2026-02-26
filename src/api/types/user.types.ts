export enum UserRole {
	organizer = "organizer",
	participant = "participant",
}

export interface UserResponse {
	id?: string;
	name: string;
	email: string;
	phone: string;
	role: UserRole;
	created_at?: string;
	updated_at?: string;
}

// Соответствует UserCreate в schemas/user.py
export interface UserCreateRequest {
	name: string;
	email: string;
	phone: string;
	password: string;
	role: UserRole;
}

// Соответствует UserUpdate в schemas/user.py (email не обновляется)
export interface UserUpdateRequest {
	name?: string;
	phone?: string;
	role?: UserRole;
}
