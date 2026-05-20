import { apiClient } from "@/api/client";
import { API_ROUTES } from "@/../api.config";
import type { BackendResponse, TokenResponse } from "@/api/types";

export const refreshToken = async (): Promise<TokenResponse> => {
	const response = await apiClient.post<BackendResponse<TokenResponse>>(
		API_ROUTES.auth.refresh,
		{},
	);

	if (!response.data.success || !response.data.data) {
		throw new Error(response.data.message || "Ошибка обновления токена");
	}

	return response.data.data;
};
