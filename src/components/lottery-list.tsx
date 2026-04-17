import { useEffect, useState } from "react";
import type { LotteryResponse } from "@/api/types/lottery.types";
import type { CompanyResponse } from "@/api/types/company.types";
import { getLotteries } from "@/api/services/lottery";
import { getCompanies } from "@/api/services/organizer";
import { LotteryCard } from "@/components/lottery-card";

interface LotteryListProps {
	onLotteryDetails?: (id: string) => void;
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

export function LotteryList({ onLotteryDetails }: LotteryListProps) {
	const [lotteries, setLotteries] = useState<LotteryResponse[]>([]);
	const [companies, setCompanies] = useState<Record<string, CompanyResponse>>({});
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
		])
			.then(([lotts, comps]) => {
				setLotteries(lotts);
				const byId = Object.fromEntries(comps.map((c) => [c.id, c]));
				setCompanies(byId);
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

	if (lotteries.length === 0) {
		return (
			<div className="flex justify-center items-center py-16">
				<p className="text-muted-foreground">Лотереи не найдены</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{lotteries.map((lottery) => (
				<LotteryCard
					key={lottery.id}
					lottery={lottery}
					companyName={companies[lottery.org_id]?.name}
					onDetails={onLotteryDetails}
				/>
			))}
		</div>
	);
}
