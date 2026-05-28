import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import type {
	LotteryResponse,
	PrizeResponse,
	TicketResponse,
} from "@/api/types/lottery.types";
import { LotteryStatus, TicketStatus } from "@/api/types/lottery.types";
import type { CompanyResponse } from "@/api/types/company.types";
import {
	getLotteryById,
	getPrizesByLottery,
	getTicketsByUser,
} from "@/api/services/lottery";
import { getCompanies } from "@/api/services/organizer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ParticipationListProps {
	userId: string;
}

interface Participation {
	lottery: LotteryResponse;
	tickets: TicketResponse[];
	prizesByTicketId: Record<string, PrizeResponse>;
}

function statusBadge(ticket: TicketResponse) {
	if (ticket.is_winner) {
		return (
			<Badge className="bg-yellow-500/15 text-yellow-700 border-yellow-500/30">
				Выигрыш
			</Badge>
		);
	}
	if (ticket.status === TicketStatus.Paid) {
		return <Badge variant="default">Оплачен</Badge>;
	}
	if (ticket.status === TicketStatus.Booked) {
		return <Badge variant="outline">Забронирован</Badge>;
	}
	return <Badge variant="secondary">{ticket.status}</Badge>;
}

export default function ParticipationList({ userId }: ParticipationListProps) {
	const navigate = useNavigate();
	const [items, setItems] = useState<Participation[]>([]);
	const [companies, setCompanies] = useState<Record<string, CompanyResponse>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		(async () => {
			try {
				const tickets = await getTicketsByUser(userId);
				const uniqueLotteryIds = Array.from(new Set(tickets.map((t) => t.lottery_id)));
				const [lotteries, comps] = await Promise.all([
					Promise.all(uniqueLotteryIds.map((id) => getLotteryById(id))),
					getCompanies().catch(() => [] as CompanyResponse[]),
				]);

				const prizeLookups = await Promise.all(
					lotteries.map(async (lottery) => {
						const hasWinHere = tickets.some(
							(t) => t.lottery_id === lottery.id && t.is_winner,
						);
						if (!hasWinHere) return [] as PrizeResponse[];
						try {
							return await getPrizesByLottery(lottery.id);
						} catch {
							return [] as PrizeResponse[];
						}
					}),
				);

				if (cancelled) return;

				const grouped: Participation[] = lotteries.map((lottery, idx) => {
					const lotteryTickets = tickets.filter((t) => t.lottery_id === lottery.id);
					const prizesByTicketId: Record<string, PrizeResponse> = {};
					for (const ticket of lotteryTickets) {
						if (!ticket.is_winner) continue;
						const prize = ticket.prize_id
							? prizeLookups[idx].find((p) => p.id === ticket.prize_id)
							: undefined;
						if (prize) prizesByTicketId[ticket.id] = prize;
					}
					return { lottery, tickets: lotteryTickets, prizesByTicketId };
				});

				setItems(grouped);
				setCompanies(Object.fromEntries(comps.map((c) => [c.id, c])));
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : "Не удалось загрузить участия");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [userId]);

	if (loading) {
		return <p className="text-sm text-muted-foreground">Загрузка...</p>;
	}

	if (error) {
		return <p className="text-sm text-destructive">{error}</p>;
	}

	if (items.length === 0) {
		return (
			<div className="border border-dashed border-border rounded-md p-10 text-center flex flex-col items-center gap-4">
				<div>
					<p className="text-sm text-foreground">Вы пока ни в чём не участвуете</p>
					<p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">
						Найдите интересный розыгрыш и купите билет.
					</p>
				</div>
				<Button variant="outline" onClick={() => navigate("/lotteries")}>
					К розыгрышам
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{items.map(({ lottery, tickets, prizesByTicketId }) => {
				const companyName = companies[lottery.org_id]?.name;
				const isCompleted = lottery.status === LotteryStatus.Completed;
				return (
					<Card key={lottery.id}>
						<CardContent className="flex flex-col gap-3">
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<button
										type="button"
										onClick={() => navigate(`/lotteries/${lottery.id}`)}
										className="text-left text-base font-medium hover:underline"
									>
										{lottery.name}
									</button>
									{companyName && (
										<p className="text-xs text-muted-foreground">{companyName}</p>
									)}
								</div>
								<Badge variant={isCompleted ? "secondary" : "default"}>
									{isCompleted ? "Завершён" : "Активен"}
								</Badge>
							</div>

							<ul className="flex flex-col divide-y border rounded-md">
								{tickets.map((ticket) => {
									const prize = prizesByTicketId[ticket.id];
									return (
										<li key={ticket.id} className="flex flex-col gap-1.5 px-3 py-2">
											<div className="flex flex-wrap items-center justify-between gap-2">
												<span className="font-mono text-sm">#{ticket.serial_number}</span>
												<div className="flex items-center gap-2">
													{statusBadge(ticket)}
													<span className="text-sm text-muted-foreground">
														{ticket.price} ₽
													</span>
												</div>
											</div>
											{ticket.is_winner && (
												<div className="flex items-center gap-2 rounded-md bg-yellow-500/10 text-yellow-800 px-2 py-1 text-xs">
													<Trophy className="size-3.5 shrink-0" />
													<span>
														Выигрыш: {prize?.name ?? "приз будет назначен организатором"}
													</span>
												</div>
											)}
										</li>
									);
								})}
							</ul>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
