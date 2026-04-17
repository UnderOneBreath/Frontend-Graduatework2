import { apiClient } from "@/api/client";
import { API_ROUTES } from "@/../api.config";
import type { UserCreateRequest, UserResponse } from "../../types";

export const register = async (data: UserCreateRequest): Promise<UserResponse> => {
	const response = await apiClient.post<UserResponse>(API_ROUTES.auth.register, data);
	return response.data;
};
