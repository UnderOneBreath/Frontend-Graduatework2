import type { PrizeResponse } from "@/api/types/lottery.types";
import { LotteryPrizeCard } from "@/components/lottery/LotteryPrizeCard";

interface LotteryPrizeGridProps {
	prizes: PrizeResponse[];
}

export function LotteryPrizeGrid({ prizes }: LotteryPrizeGridProps) {
	if (prizes.length === 0) {
		return (
			<div className="flex justify-center rounded-xl border border-dashed border-border py-12 text-sm text-muted-foreground">
				Призы пока не добавлены
			</div>
		);
	}

	const sorted = [...prizes].sort((a, b) => b.price - a.price);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{sorted.map((prize, i) => (
				<LotteryPrizeCard key={prize.id} prize={prize} rank={i + 1} />
			))}
		</div>
	);
}
