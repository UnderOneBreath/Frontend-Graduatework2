import { useCallback, useEffect, useState } from "react";
import {
	getLotteryById,
	getPrizesByLottery,
	getTicketsByLottery,
	getWinnersByLottery,
} from "@/api/services/lottery";
import { getCompanyById } from "@/api/services/organizer";
import type {
	LotteryResponse,
	PrizeResponse,
	TicketResponse,
} from "@/api/types/lottery.types";
import { LotteryStatus, TicketStatus } from "@/api/types/lottery.types";
import type { CompanyResponse } from "@/api/types/company.types";

const USE_MOCK = false;

const MOCK_ORG_ID = "org-mock-0001";

const mockOrganizer: CompanyResponse = {
	id: MOCK_ORG_ID,
	name: "ООО «Праздничные технологии»",
	inn: 7701234567,
	ogrn: 1027700123456,
	phone: "+7 (495) 123-45-67",
	address: "Москва, ул. Тверская, д. 7, стр. 1",
	logo: null,
	email: "promo@holidaytech.ru",
	employees: [],
};

function buildMockState(id: string): {
	lottery: LotteryResponse;
	prizes: PrizeResponse[];
	tickets: TicketResponse[];
	winners: TicketResponse[];
	organizer: CompanyResponse;
} {
	const now = Date.now();
	const start = new Date(now - 4 * 24 * 3600 * 1000).toISOString();
	const end = new Date(now + 5 * 24 * 3600 * 1000 + 14 * 3600 * 1000).toISOString();

	const lottery: LotteryResponse = {
		id,
		name: "Большой розыгрыш к открытию весеннего сезона 2026",
		start_date: start,
		end_date: end,
		max_entries: 50,
		status: LotteryStatus.Active,
		org_id: MOCK_ORG_ID,
	};

	const prizes: PrizeResponse[] = [
		{
			id: "prize-1",
			name: "iPhone 15 Pro 256 GB",
			description: "Флагманский смартфон в титановом корпусе с камерой 48 Мп.",
			img_path: "https://images.unsplash.com/photo-1697284959512-9a8e9b6ad0e1?w=800",
			price: 120000,
			lottery_id: id,
		},
		{
			id: "prize-2",
			name: "AirPods Pro 2",
			description: "Беспроводные наушники с активным шумоподавлением.",
			img_path: "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800",
			price: 25000,
			lottery_id: id,
		},
		{
			id: "prize-3",
			name: "Сертификат Ozon на 10 000 ₽",
			description: "Подарочный сертификат можно потратить на любые товары маркетплейса.",
			img_path: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
			price: 10000,
			lottery_id: id,
		},
		{
			id: "prize-4",
			name: "Фирменный мерч",
			description: "Толстовка, термокружка и наклейки от организатора.",
			img_path: "",
			price: 3500,
			lottery_id: id,
		},
	];

	const tickets: TicketResponse[] = Array.from({ length: 50 }, (_, i) => {
		const claimed = i < 32;
		return {
			id: `ticket-${i + 1}`,
			status: claimed ? TicketStatus.Paid : TicketStatus.Vacant,
			purchase_date: claimed
				? new Date(now - (i + 1) * 60 * 60 * 1000).toISOString()
				: "",
			is_winner: false,
			price: 100,
			serial_number: `lottery_${id}_${i + 1}`,
			lottery_id: id,
			user_id: claimed ? `user-${(i + 17) * 31}` : "",
			prize_id: null,
		};
	});

	const winners: TicketResponse[] = [
		{
			...tickets[0],
			id: "ticket-winner-1",
			is_winner: true,
			prize_id: "prize-1",
		},
		{
			...tickets[3],
			id: "ticket-winner-2",
			is_winner: true,
			prize_id: "prize-2",
		},
	];

	return { lottery, prizes, tickets, winners, organizer: mockOrganizer };
}
// END TEMP_MOCK

export interface LotteryDetailState {
	lottery: LotteryResponse | null;
	prizes: PrizeResponse[];
	tickets: TicketResponse[];
	winners: TicketResponse[];
	organizer: CompanyResponse | null;
	paidCount: number;
	isLoading: boolean;
	error: string | null;
	notFound: boolean;
	refetch: () => void;
}

function normalizeError(err: unknown): string {
	if (err instanceof Error) return err.message;
	const apiErr = err as { response?: { data?: { message?: string }; status?: number } };
	return apiErr?.response?.data?.message ?? String(err);
}

export function useLotteryDetail(id: string | undefined): LotteryDetailState {
	const [lottery, setLottery] = useState<LotteryResponse | null>(null);
	const [prizes, setPrizes] = useState<PrizeResponse[]>([]);
	const [tickets, setTickets] = useState<TicketResponse[]>([]);
	const [winners, setWinners] = useState<TicketResponse[]>([]);
	const [organizer, setOrganizer] = useState<CompanyResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [notFound, setNotFound] = useState(false);
	const [tick, setTick] = useState(0);

	const refetch = useCallback(() => setTick((t) => t + 1), []);

	useEffect(() => {
		if (!id) {
			setIsLoading(false);
			setNotFound(true);
			return;
		}

		// TEMP_MOCK: возвращаем моковые данные, пока бэк лотерей лежит.
		if (USE_MOCK) {
			const mock = buildMockState(id);
			const timer = window.setTimeout(() => {
				setLottery(mock.lottery);
				setPrizes(mock.prizes);
				setTickets(mock.tickets);
				setWinners(mock.winners);
				setOrganizer(mock.organizer);
				setIsLoading(false);
			}, 300);
			return () => window.clearTimeout(timer);
		}
		// END TEMP_MOCK

		let cancelled = false;
		setIsLoading(true);
		setError(null);
		setNotFound(false);

		(async () => {
			try {
				const lot = await getLotteryById(id);
				if (cancelled) return;
				setLottery(lot);

				const [prizeList, ticketList, winnerList, org] = await Promise.all([
					getPrizesByLottery(id).catch((e) => {
						console.warn("[useLotteryDetail] prizes failed:", e);
						return [] as PrizeResponse[];
					}),
					getTicketsByLottery(id).catch((e) => {
						console.warn("[useLotteryDetail] tickets failed:", e);
						return [] as TicketResponse[];
					}),
					getWinnersByLottery(id).catch((e) => {
						console.warn("[useLotteryDetail] winners failed:", e);
						return [] as TicketResponse[];
					}),
					getCompanyById(lot.org_id).catch((e) => {
						console.warn("[useLotteryDetail] organizer failed:", e);
						return null;
					}),
				]);
				if (cancelled) return;
				setPrizes(prizeList);
				setTickets(ticketList);
				setWinners(winnerList);
				setOrganizer(org);
			} catch (err: unknown) {
				if (cancelled) return;
				const status = (err as { response?: { status?: number } })?.response?.status;
				if (status === 404) {
					setNotFound(true);
				} else {
					setError(`Ошибка: ${normalizeError(err)}`);
				}
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [id, tick]);

	const paidCount = tickets.filter((t) => !!t.user_id).length;

	return {
		lottery,
		prizes,
		tickets,
		winners,
		organizer,
		paidCount,
		isLoading,
		error,
		notFound,
		refetch,
	};
}
