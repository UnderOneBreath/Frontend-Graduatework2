import type {
	LotteryResponse,
	LotteryCreateRequest,
	LotteryUpdateRequest,
	PrizeResponse,
	TicketResponse,
	TicketStatus,
	BulkCreateTicketsBody,
	BuyTicketsBody,
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

export async function updateLottery(id: string, data: LotteryUpdateRequest): Promise<LotteryResponse> {
	const res = await apiClient.patch<BackendResponse<LotteryResponse>>(API_ROUTES.lotteries.get(id), data);
	return res.data.data;
}

export async function deleteLottery(id: string): Promise<void> {
	await apiClient.delete(API_ROUTES.lotteries.get(id));
}

export async function getPrizesByLottery(lotteryId: string): Promise<PrizeResponse[]> {
	const res = await apiClient.get<BackendResponse<PrizeResponse[]>>(API_ROUTES.prizes.byLottery(lotteryId));
	return res.data.data;
}

export async function getTicketsByLottery(lotteryId: string): Promise<TicketResponse[]> {
	const res = await apiClient.get<BackendResponse<TicketResponse[]>>(API_ROUTES.tickets.byLottery(lotteryId));
	return res.data.data;
}

export async function getAllTickets(): Promise<TicketResponse[]> {
	const res = await apiClient.get<BackendResponse<TicketResponse[]>>(API_ROUTES.tickets.list);
	return res.data.data;
}

export async function getTicketsByUser(userId: string): Promise<TicketResponse[]> {
	const all = await getAllTickets();
	return all.filter((t) => t.user_id === userId);
}

export async function getWinnersByLottery(lotteryId: string): Promise<TicketResponse[]> {
	const res = await apiClient.get<BackendResponse<TicketResponse[]>>(API_ROUTES.tickets.winners(lotteryId));
	return res.data.data;
}

export async function buyTickets(lotteryId: string, body: BuyTicketsBody): Promise<TicketResponse[]> {
	const res = await apiClient.patch<BackendResponse<TicketResponse[]>>(
		API_ROUTES.tickets.buy(lotteryId),
		body,
	);
	return res.data.data;
}

export async function setTicketWinner(ticketId: string, prizeId: string): Promise<TicketResponse> {
	const res = await apiClient.patch<BackendResponse<TicketResponse>>(
		API_ROUTES.tickets.setWinner(ticketId),
		{ prize_id: prizeId },
	);
	return res.data.data;
}

export async function changeTicketStatus(ticketId: string, status: TicketStatus): Promise<TicketResponse> {
	const res = await apiClient.patch<BackendResponse<TicketResponse>>(
		API_ROUTES.tickets.changeStatus(ticketId),
		{ status },
	);
	return res.data.data;
}

export async function bulkCreateTickets(body: BulkCreateTicketsBody): Promise<TicketResponse[]> {
	const res = await apiClient.post<BackendResponse<TicketResponse[]>>(
		API_ROUTES.tickets.bulkCreate,
		body,
	);
	return res.data.data;
}
