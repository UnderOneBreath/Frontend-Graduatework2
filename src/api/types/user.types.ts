export interface UserResponse {
	id?: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	created_at?: string;
	updated_at?: string;
}

export interface UserCreateRequest {
	name: string;
	email: string;
	phone: string;
	password: string;
	role: string;
	created_at?: string;
}

export interface UserUpdateRequest {
	name?: string;
	email?: string;
	role?: string;
}
