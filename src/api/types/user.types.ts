export const UserRole = {
	organizer: "organizer",
	participant: "participant",
	admin: "admin",
	moderator: "moderator",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface UserResponse {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: UserRole;
	created_at?: string;
	updated_at?: string;
}

export interface UserCreateRequest {
	name: string;
	email: string;
	phone: string;
	password: string;
	// role: UserRole;
}

export interface UserUpdateRequest {
	name?: string;
	phone?: string;
	role?: UserRole;
}
