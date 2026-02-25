class UserRole {
	organizer = "organizer"
	participant = "participant"
}

// // Login types
// export interface LoginCredentials {
//     email: string;
//     password: string;
// }

// export interface LoginResponse {
//     id: number;
//     username: string;
//     email: string;
//     firstName: string;
//     lastName: string;
//     gender: string;
//     image: string;
//     accessToken: string;
//     refreshToken: string;
// }

// // Register types
// export interface RegisterData {
//     email: string;
//     username: string;
//     password: string;
// }

// export interface RegisterResponse {
//     id: number;
//     email: string;
//     username: string;
// }

// // Refresh token types
// export interface RefreshTokenRequest {
//     refreshToken: string;
// }

// export interface RefreshTokenResponse {
//     accessToken: string;
//     refreshToken: string;
// }

// // Current user types
// export interface CurrentUserResponse {
//     id: number;
//     username: string;
//     email: string;
//     firstName: string;
//     lastName: string;
//     gender: string;
//     image: string;
// }

export interface TokenResponse {
	token: string;
	refresh_token: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface UserCreate {
	name: string;
	email: string;
	phone: string;
	password: string;
	role: UserRole;
}

export interface ServerRefreshTokenRequest {
	refresh_token: string;
}

export interface SetPasswordRequest {
	old_password: string;
	new_password: string;
}
