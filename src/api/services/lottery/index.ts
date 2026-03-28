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

// import { MOCK_LOTTERIES, MOCK_PRIZES, MOCK_TICKETS, MOCK_NOTIFICATIONS } from "./lottery.mock";

export async function getLotteries(): Promise<LotteryResponse[]> {
	const res = await apiClient.get<BackendResponse<LotteryResponse[]>>(API_ROUTES.lotteries.list);
	return res.data.data;

	// return Promise.resolve([...MOCK_LOTTERIES]);
}

export async function getLotteryById(id: string): Promise<LotteryResponse> {
	const res = await apiClient.get<BackendResponse<LotteryResponse>>(API_ROUTES.lotteries.get(id));
	return res.data.data;

	// const lottery = MOCK_LOTTERIES.find((l) => l.id === id);
	// if (!lottery) return Promise.reject(new Error(`Lottery ${id} not found`));
	// return Promise.resolve({ ...lottery });
}

export async function createLottery(data: LotteryCreateRequest): Promise<LotteryResponse> {
	const res = await apiClient.post<BackendResponse<LotteryResponse>>(API_ROUTES.lotteries.list, data);
	return res.data.data;

	// const newLottery: LotteryResponse = {
	// 	id: String(Date.now()),
	// 	...data,
	// };
	// MOCK_LOTTERIES.push(newLottery);
	// return Promise.resolve({ ...newLottery });
}

export async function updateLottery(
	id: string,
	data: LotteryUpdateRequest,
): Promise<LotteryResponse> {
	const res = await apiClient.patch<BackendResponse<LotteryResponse>>(API_ROUTES.lotteries.get(id), data);
	return res.data.data;

	// const idx = MOCK_LOTTERIES.findIndex((l) => l.id === id);
	// if (idx === -1) return Promise.reject(new Error(`Lottery ${id} not found`));
	// MOCK_LOTTERIES[idx] = { ...MOCK_LOTTERIES[idx], ...data };
	// return Promise.resolve({ ...MOCK_LOTTERIES[idx] });
}

export async function deleteLottery(id: string): Promise<void> {
	await apiClient.delete(API_ROUTES.lotteries.get(id));

	// const idx = MOCK_LOTTERIES.findIndex((l) => l.id === id);
	// if (idx !== -1) MOCK_LOTTERIES.splice(idx, 1);
}

export async function getPrizesByLottery(
	lotteryId: string,
): Promise<PrizeResponse[]> {
	const res = await apiClient.get<BackendResponse<PrizeResponse[]>>(API_ROUTES.prizes.byLottery(lotteryId));
	return res.data.data;

	// return Promise.resolve(MOCK_PRIZES.filter((p) => p.lottery_id === lotteryId));
}

export async function getTicketsByLottery(
	lotteryId: string,
): Promise<TicketResponse[]> {
	const res = await apiClient.get<BackendResponse<TicketResponse[]>>(API_ROUTES.tickets.byLottery(lotteryId));
	return res.data.data;

	// return Promise.resolve(MOCK_TICKETS.filter((t) => t.lottery_id === lotteryId));
}

export async function getNotificationsByLottery(
	lotteryId: string,
): Promise<NotificationResponse[]> {
	const res = await apiClient.get<BackendResponse<NotificationResponse[]>>(API_ROUTES.notifications.byLottery(lotteryId));
	return res.data.data;

	// return Promise.resolve(MOCK_NOTIFICATIONS.filter((n) => n.lottery_id === lotteryId));
}
