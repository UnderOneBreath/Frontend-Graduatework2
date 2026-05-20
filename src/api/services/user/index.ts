import { apiClient } from "@/api/client";
import { API_ROUTES } from "@/../api.config";
import type { BackendResponse, UserResponse, UserUpdateRequest } from "@/api/types";

export async function updateUser(id: string, data: UserUpdateRequest): Promise<UserResponse> {
	const res = await apiClient.patch<BackendResponse<UserResponse>>(API_ROUTES.users.get(id), data);
	return res.data.data;
}

export async function genTelegramCode(id: string): Promise<{ telegram_code: string }> {
	const res = await apiClient.patch<BackendResponse<{ telegram_code: string }>>(
		API_ROUTES.users.genTelegramCode(id),
	);
	return res.data.data;
}

export async function getTelegramId(id: string): Promise<{ telegram_id: number | null }> {
	const res = await apiClient.get<BackendResponse<{ telegram_id: number | null }>>(
		API_ROUTES.users.telegramId(id),
	);
	return res.data.data;
}
