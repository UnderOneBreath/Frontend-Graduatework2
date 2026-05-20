import axios, { AxiosError } from "axios";
import { BASE_API_URL } from "@/../api.config";

const apiKeys: Record<string, string | undefined> = {
	'/users/': import.meta.env.VITE_API_KEY_USERS,
	'/notifications/': import.meta.env.VITE_API_KEY_NOTIFICATIONS,
	'/lotteries/': import.meta.env.VITE_API_KEY_LOTTERY,
	'/tickets/': import.meta.env.VITE_API_KEY_LOTTERY,
	'/prizes/': import.meta.env.VITE_API_KEY_LOTTERY,
	'/organizers/': import.meta.env.VITE_API_KEY_ORGANIZERS,
	'/requests/': import.meta.env.VITE_API_KEY_ORGANIZERS,
}

export const apiClient = axios.create({
	baseURL: BASE_API_URL,
	timeout: 10000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

const getApiKeyForURL = (url?: string): string | undefined => {
	if (!url) return undefined;
	const lowerURL = url.toLowerCase();

	for (const [key, apiKey] of Object.entries(apiKeys)) {
		if (lowerURL.includes(key)) return apiKey;
	}
	return undefined;

	// const key = Object.keys(apiKeys).find(key => lowerURL.includes(key));
	// if (key) return apiKeys[key];
}

// text  text dad  dwd   dwdpl d
// Временное решения для разработки: getApiKeyForURL, const apiKeys, interceptor/

apiClient.interceptors.request.use((config) => {
	const key = getApiKeyForURL(config.url);
	// const key = import.meta.env.VITE_API_KEY;
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
