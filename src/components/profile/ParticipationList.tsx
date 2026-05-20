import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LotteryResponse, TicketResponse } from "@/api/types/lottery.types";
import type { CompanyResponse } from "@/api/types/company.types";
import { getLotteryById, getTicketsByUser } from "@/api/services/lottery";
import { getCompanies } from "@/api/services/organizer";
import { LotteryCard } from "@/components/lottery-card";
import { Button } from "@/components/ui/button";

interface ParticipationListProps {
	userId: string;
}

interface Participation {
	lottery: LotteryResponse;
	tickets: TicketResponse[];
	hasWin: boolean;
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
				if (cancelled) return;
				const grouped: Participation[] = lotteries.map((lottery) => {
					const lotteryTickets = tickets.filter((t) => t.lottery_id === lottery.id);
					return {
						lottery,
						tickets: lotteryTickets,
						hasWin: lotteryTickets.some((t) => t.is_winner),
					};
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
			{items.map(({ lottery, tickets, hasWin }) => (
				<div key={lottery.id} className="flex flex-col gap-2">
					<LotteryCard
						lottery={lottery}
						companyName={companies[lottery.org_id]?.name}
						onDetails={(id) => navigate(`/lotteries/${id}`)}
					/>
					<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground px-1">
						<span>Билетов: {tickets.length}</span>
						{hasWin && <span className="text-foreground">Есть выигрышный билет</span>}
					</div>
				</div>
			))}
		</div>
	);
}
