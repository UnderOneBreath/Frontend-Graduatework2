import type {
	LotteryResponse,
	LotteryCreateRequest,
	LotteryUpdateRequest,
	PrizeResponse,
	TicketResponse,
	NotificationResponse,
} from "@/api/types/lottery.types";

import type { BackendResponse } from "@/api/types/common.types";
import { apiClient } from "@/api/client";
import { API_ROUTES } from "@/../api.config";

export async function getLotteries(): Promise<LotteryResponse[]> {
	const res = await apiClient.get<BackendResponse<LotteryResponse[]>>(API_ROUTES.lotteries.list);
	return res.data.data;
}

export async function getLotteryById(id: string): Promise<LotteryResponse> {
	const res = await apiClient.get<BackendResponse<LotteryResponse>>(API_ROUTES.lotteries.get(id));
	return res.data.data;
}

export async function createLottery(data: LotteryCreateRequest): Promise<LotteryResponse> {
	const res = await apiClient.post<BackendResponse<LotteryResponse>>(API_ROUTES.lotteries.list, data);
	return res.data.data;
}

export async function updateLottery(
	id: string,
	data: LotteryUpdateRequest,
): Promise<LotteryResponse> {
	const res = await apiClient.patch<BackendResponse<LotteryResponse>>(API_ROUTES.lotteries.get(id), data);
	return res.data.data;
}

export async function deleteLottery(id: string): Promise<void> {
	await apiClient.delete(API_ROUTES.lotteries.get(id));
}

export async function getPrizesByLottery(
	lotteryId: string,
): Promise<PrizeResponse[]> {
	const res = await apiClient.get<BackendResponse<PrizeResponse[]>>(API_ROUTES.prizes.byLottery(lotteryId));
	return res.data.data;
}

export async function getTicketsByLottery(
	lotteryId: string,
): Promise<TicketResponse[]> {
	const res = await apiClient.get<BackendResponse<TicketResponse[]>>(API_ROUTES.tickets.byLottery(lotteryId));
	return res.data.data;
}

export async function getNotificationsByLottery(
	lotteryId: string,
): Promise<NotificationResponse[]> {
	const res = await apiClient.get<BackendResponse<NotificationResponse[]>>(API_ROUTES.notifications.byLottery(lotteryId));
	return res.data.data;
}
