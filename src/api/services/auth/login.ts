import { apiClient } from "@/api/client";
import { API_ROUTES } from "@/../api.config";
import type { LoginRequest, TokenResponse } from "@/api/types";
import type { BackendResponse } from "@/api/types";
import { persistTokenInfo } from "@/api/utils/jwt";
import { scheduleRefreshFromToken } from "@/api/auth/tokenRefresher";

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
		persistTokenInfo(token);
		scheduleRefreshFromToken(token);
	}
};
