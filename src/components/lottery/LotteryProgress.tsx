import { cn } from "@/lib/utils";

interface LotteryProgressProps {
	paid: number;
	max: number;
	className?: string;
}

function colorFor(pct: number): string {
	if (pct >= 85) return "bg-destructive";
	if (pct >= 60) return "bg-yellow-500";
	return "bg-green-500";
}

export function LotteryProgress({ paid, max, className }: LotteryProgressProps) {
	const safeMax = Math.max(max, 1);
	const clamped = Math.min(paid, safeMax);
	const pct = Math.round((clamped / safeMax) * 100);

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<div className="flex items-baseline justify-between text-xs">
				<span className="text-muted-foreground">Участников</span>
				<span className="font-medium text-foreground">
					{paid}/{max} <span className="text-muted-foreground">({pct}%)</span>
				</span>
			</div>
			<div
				className="h-2 w-full overflow-hidden rounded-full bg-muted"
				title={`${paid} из ${max} мест занято`}
			>
				<div
					className={cn("h-full transition-all", colorFor(pct))}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}
