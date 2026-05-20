import type {
	NotificationResponse,
	NotificationCreateRequest,
	NotificationUpdateRequest,
} from "@/api/types/notification.types";

import type { BackendResponse } from "@/api/types/common.types";
import { apiClient } from "@/api/client";
import { API_ROUTES } from "@/../api.config";

export async function getNotifications(): Promise<NotificationResponse[]> {
	const res = await apiClient.get<BackendResponse<NotificationResponse[]>>(API_ROUTES.notifications.list);
	return res.data.data;
}

export async function getNotificationById(id: string): Promise<NotificationResponse> {
	const res = await apiClient.get<BackendResponse<NotificationResponse>>(API_ROUTES.notifications.get(id));
	return res.data.data;
}

export async function getNotificationsByLottery(lotteryId: string): Promise<NotificationResponse[]> {
	const all = await getNotifications();
	return all.filter((n) => n.lottery_id === lotteryId);
}

export async function createNotification(data: NotificationCreateRequest): Promise<NotificationResponse> {
	const res = await apiClient.post<BackendResponse<NotificationResponse>>(API_ROUTES.notifications.list, data);
	return res.data.data;
}

export async function updateNotification(id: string, data: NotificationUpdateRequest): Promise<NotificationResponse> {
	const res = await apiClient.patch<BackendResponse<NotificationResponse>>(API_ROUTES.notifications.get(id), data);
	return res.data.data;
}

export async function deleteNotification(id: string): Promise<void> {
	await apiClient.delete(API_ROUTES.notifications.get(id));
}
