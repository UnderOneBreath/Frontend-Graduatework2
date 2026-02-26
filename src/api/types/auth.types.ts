// Соответствует TokenResponse в schemas/auth.py
export interface TokenResponse {
	token: string;
	refresh_token: string;
}

// Соответствует LoginRequest в schemas/auth.py
export interface LoginRequest {
	email: string;
	password: string;
}

// Соответствует RefreshTokenRequest в schemas/auth.py
export interface ServerRefreshTokenRequest {
	refresh_token: string;
}

// Соответствует SetPasswordRequest в schemas/auth.py
export interface SetPasswordRequest {
	old_password: string;
	new_password: string;
}
