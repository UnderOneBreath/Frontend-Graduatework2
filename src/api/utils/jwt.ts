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
