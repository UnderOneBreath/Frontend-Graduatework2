import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/../api.config";

export const apiClient = axios.create({
	baseURL: BASE_API_URL,
	timeout: 10000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use((config) => {
	const key = import.meta.env.VITE_API_KEY;
	if (key) config.headers.set("X-API-Key", key);
	return config;
});

function extractErrorMessage(error: AxiosError<any>): string {
	const data = error.response?.data;
	if (data?.detail) {
		if (Array.isArray(data.detail)) {
			return data.detail
				.map((e: any) => `${e.loc?.join(".") || "field"}: ${e.msg}`)
				.join(", ");
		}
		if (typeof data.detail === "string") return data.detail;
	}
	if (typeof data?.message === "string") return data.message;
	return error.message;
}

apiClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		const normalized = new Error(extractErrorMessage(error));
		(normalized as any).status = error.response?.status;
		(normalized as any).response = error.response;
		return Promise.reject(normalized);
	},
);
