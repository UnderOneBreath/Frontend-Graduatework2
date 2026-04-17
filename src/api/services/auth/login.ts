import { apiClient } from "@/api/client";
import { API_ROUTES } from "@/../api.config";
import type { LoginRequest, TokenResponse } from "@/api/types";
import type { BackendResponse } from "@/api/types";
import { decodeAccessToken } from "@/api/utils/jwt";

export const login = async (credentials: LoginRequest): Promise<void> => {
	const response = await apiClient.post<BackendResponse<TokenResponse>>(
		API_ROUTES.auth.login,
		credentials,
	);

	if (!response.data.success) {
		throw new Error(response.data.message || "Ошибка авторизации");
	}

	localStorage.setItem("userEmail", credentials.email);

	const token = response.data.data?.token;
	if (token) {
		const { sub } = decodeAccessToken(token);
		if (sub) localStorage.setItem("userId", sub);
	}
};
