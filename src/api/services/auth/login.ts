import { apiClient } from "../../client";
import { API_ROUTES } from "../../../../api.config";
import type { LoginRequest } from "../../types";
import type { BackendResponse } from "../../types";

/**
 * Логин через cookie-based auth.
 * Бэкенд выставляет httpOnly cookies (access_token, refresh_token) через Set-Cookie.
 * В теле ответа токенов нет — только { success: true, data: null }.
 * Email сохраняем в localStorage чтобы найти текущего пользователя в GET /users/.
 */
export const login = async (credentials: LoginRequest): Promise<void> => {
	const response = await apiClient.post<BackendResponse>(
		API_ROUTES.auth.login,
		credentials,
	);

	if (!response.data.success) {
		throw new Error(response.data.message || "Ошибка авторизации");
	}

	// Сохраняем email — единственный способ идентифицировать пользователя
	// без /auth/me (которого нет) и без доступа к httpOnly cookie из JS
	localStorage.setItem("userEmail", credentials.email);
	// console.log('[login] userEmail stored:', credentials.email);
};
