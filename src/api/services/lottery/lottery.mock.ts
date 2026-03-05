import type {
	LotteryResponse,
	PrizeResponse,
	TicketResponse,
	NotificationResponse,
} from "@/api/types/lottery.types";
import { LotteryStatus } from "@/api/types/lottery.types";

export const MOCK_PRIZES: PrizeResponse[] = [
	{
		id: "p1",
		name: "iPhone 16 Pro",
		description: "Новейший смартфон Apple",
		img_path: "",
		price: 120000,
		lottery_id: "1",
	},
	{
		id: "p2",
		name: "MacBook Air M3",
		description: "Мощный ноутбук Apple",
		img_path: "",
		price: 100000,
		lottery_id: "1",
	},
	{
		id: "p3",
		name: "Tesla Model 3",
		description: "Электромобиль Tesla",
		img_path: "",
		price: 3000000,
		lottery_id: "2",
	},
	{
		id: "p4",
		name: "Абонемент в фитнес-клуб",
		description: "Годовой абонемент Premium",
		img_path: "",
		price: 50000,
		lottery_id: "3",
	},
	{
		id: "p5",
		name: "Велосипед Trek",
		description: "Горный велосипед Trek Marlin 7",
		img_path: "",
		price: 80000,
		lottery_id: "3",
	},
	{
		id: "p6",
		name: "Кроссовки Nike Air Max",
		description: "Лимитированная коллекция",
		img_path: "",
		price: 15000,
		lottery_id: "3",
	},
];

export const MOCK_LOTTERIES: LotteryResponse[] = [
	{
		id: "1",
		name: "Летняя мегалотерея 2026",
		start_date: "2026-06-01T00:00:00",
		end_date: "2026-08-31T23:59:59",
		max_entries: 1000,
		status: LotteryStatus.Active,
		company_id: "c1",
		prizes: MOCK_PRIZES.filter((p) => p.lottery_id === "1"),
	},
	{
		id: "2",
		name: "Новогодняя лотерея 2026",
		start_date: "2025-12-01T00:00:00",
		end_date: "2026-01-10T23:59:59",
		max_entries: 500,
		status: LotteryStatus.Completed,
		company_id: "c2",
		prizes: MOCK_PRIZES.filter((p) => p.lottery_id === "2"),
	},
	{
		id: "3",
		name: "Спортивная лотерея весна",
		start_date: "2026-03-10T00:00:00",
		end_date: "2026-05-30T23:59:59",
		max_entries: 2000,
		status: LotteryStatus.Active,
		company_id: "c1",
		prizes: MOCK_PRIZES.filter((p) => p.lottery_id === "3"),
	},
];

export const MOCK_TICKETS: TicketResponse[] = [
	{
		id: "t1",
		purchase_date: "2026-03-01T10:00:00",
		is_winner: false,
		price: 500,
		serial_number: 1001,
		lottery_id: "1",
		user_id: "u1",
		prize_id: null,
	},
	{
		id: "t2",
		purchase_date: "2026-03-02T12:30:00",
		is_winner: true,
		price: 500,
		serial_number: 1042,
		lottery_id: "3",
		user_id: "u1",
		prize_id: "p4",
	},
];

export const MOCK_NOTIFICATIONS: NotificationResponse[] = [
	{
		id: "n1",
		description:
			"Лотерея 'Летняя мегалотерея 2026' стартовала! Успейте купить билет.",
		status: true,
		views: 234,
		lottery_id: "1",
	},
	{
		id: "n2",
		description:
			"Итоги 'Новогодней лотереи 2026' подведены. Победитель определён.",
		status: false,
		views: 1890,
		lottery_id: "2",
	},
];
