import { UserRole } from "@/api/types/user.types";

export interface AccessTokenPayload {
	sub: string;
	role?: string;
	exp?: number;
}

export function decodeAccessToken(token: string): AccessTokenPayload {
	const [, payload] = token.split(".");
	const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
	return JSON.parse(json) as AccessTokenPayload;
}

const USER_ID_KEY = "userId";
const USER_ROLE_KEY = "userRole";
const TOKEN_EXP_KEY = "tokenExp";

export function persistTokenInfo(token: string): void {
	const { sub, role, exp } = decodeAccessToken(token);
	if (sub) localStorage.setItem(USER_ID_KEY, sub);
	if (role) localStorage.setItem(USER_ROLE_KEY, role);
	if (exp) localStorage.setItem(TOKEN_EXP_KEY, String(exp));
}

export function clearTokenInfo(): void {
	localStorage.removeItem(USER_ID_KEY);
	localStorage.removeItem(USER_ROLE_KEY);
	localStorage.removeItem(TOKEN_EXP_KEY);
}

export function getCurrentUserId(): string | null {
	return localStorage.getItem(USER_ID_KEY);
}

function isKnownRole(value: string): value is UserRole {
	return (Object.values(UserRole) as string[]).includes(value);
}

export function getCurrentRole(): UserRole | null {
	const raw = localStorage.getItem(USER_ROLE_KEY);
	return raw && isKnownRole(raw) ? raw : null;
}

export function getTokenExp(): number | null {
	const raw = localStorage.getItem(TOKEN_EXP_KEY);
	if (!raw) return null;
	const exp = Number(raw);
	return Number.isFinite(exp) ? exp : null;
}

export function isTokenExpired(): boolean {
	const raw = localStorage.getItem(TOKEN_EXP_KEY);
	if (!raw) return true;
	const exp = Number(raw);
	if (!Number.isFinite(exp)) return true;
	return Date.now() >= exp * 1000;
}

export function isAuthenticated(): boolean {
	return getCurrentUserId() !== null && !isTokenExpired();
}
