import { useEffect, useMemo, useState } from "react";
import type {
	LotteryResponse,
	LotteryStatus,
	TicketResponse,
} from "@/api/types/lottery.types";
import { TicketStatus } from "@/api/types/lottery.types";
import type { CompanyResponse } from "@/api/types/company.types";
import { getLotteries, getAllTickets } from "@/api/services/lottery";
import { getCompanies } from "@/api/services/organizer";
import { LotteryCard } from "@/components/lottery-card";

interface LotteryListProps {
	onLotteryDetails?: (id: string) => void;
	orgId?: string;
	excludeId?: string;
	limit?: number;
	emptyText?: string;
	status?: LotteryStatus;
	hideStatus?: boolean;
}

function LotteryCardSkeleton() {
	return (
		<div className="rounded-xl border border-border overflow-hidden animate-pulse">
			<div className="h-48 bg-muted" />
			<div className="p-4 flex flex-col gap-3">
				<div className="h-4 bg-muted rounded w-3/4" />
				<div className="h-3 bg-muted rounded w-1/2" />
				<div className="flex flex-col gap-2">
					<div className="h-3 bg-muted rounded w-full" />
				</div>
				<div className="flex gap-1">
					<div className="h-5 bg-muted rounded-full w-16" />
					<div className="h-5 bg-muted rounded-full w-20" />
				</div>
				<div className="h-8 bg-muted rounded-md w-full mt-1" />
			</div>
		</div>
	);
}

export function LotteryList({
	onLotteryDetails,
	orgId,
	excludeId,
	limit,
	emptyText,
	status,
	hideStatus,
}: LotteryListProps) {
	const [lotteries, setLotteries] = useState<LotteryResponse[]>([]);
	const [companies, setCompanies] = useState<Record<string, CompanyResponse>>({});
	const [tickets, setTickets] = useState<TicketResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		Promise.all([
			getLotteries(),
			getCompanies().catch((err: unknown) => {
				console.warn("[LotteryList] companies fetch failed:", err);
				return [] as CompanyResponse[];
			}),
			getAllTickets().catch((err: unknown) => {
				console.warn("[LotteryList] tickets fetch failed:", err);
				return [] as TicketResponse[];
			}),
		])
			.then(([lotts, comps, tix]) => {
				setLotteries(lotts);
				const byId = Object.fromEntries(comps.map((c) => [c.id, c]));
				setCompanies(byId);
				setTickets(tix);
			})
			.catch((err: unknown) => {
				console.error("[LotteryList] fetch failed:", err);
				const msg =
					err instanceof Error ? err.message :
					(err as { response?: { data?: { message?: string }; status?: number } })?.response?.data?.message ??
					String(err);
				setError(`Ошибка: ${msg}`);
			})
			.finally(() => setLoading(false));
	}, []);

	// Реальные данные по билетам: занято мест и цена билета на каждый розыгрыш.
	const ticketStats = useMemo(() => {
		const map: Record<string, { sold: number; price?: number }> = {};
		for (const t of tickets) {
			const entry = (map[t.lottery_id] ??= { sold: 0 });
			if (t.status !== TicketStatus.Vacant) entry.sold += 1;
			if (entry.price === undefined) entry.price = t.price;
		}
		return map;
	}, [tickets]);

	if (loading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<LotteryCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center py-24">
				<p className="text-destructive">{error}</p>
			</div>
		);
	}

	let visible = orgId
		? lotteries.filter((l) => l.org_id === orgId)
		: lotteries;
	if (status) {
		visible = visible.filter((l) => l.status === status);
	}
	if (excludeId) {
		visible = visible.filter((l) => l.id !== excludeId);
	}
	if (typeof limit === "number") {
		visible = visible.slice(0, limit);
	}

	if (visible.length === 0) {
		return (
			<div className="flex justify-center items-center py-16">
				<p className="text-muted-foreground">
					{emptyText ?? "Лотереи не найдены"}
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{visible.map((lottery) => (
				<LotteryCard
					key={lottery.id}
					lottery={lottery}
					companyName={companies[lottery.org_id]?.name}
					soldCount={ticketStats[lottery.id]?.sold ?? 0}
					ticketPrice={ticketStats[lottery.id]?.price}
					onDetails={onLotteryDetails}
					hideStatus={hideStatus}
				/>
			))}
		</div>
	);
}
