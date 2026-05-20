import { Clock } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

interface LotteryCountdownProps {
	endDate: string;
	className?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function pad(n: number): string {
	return n.toString().padStart(2, "0");
}

export function LotteryCountdown({ endDate, className }: LotteryCountdownProps) {
	const { days, hours, minutes, seconds, totalMs, isFinished } = useCountdown(endDate);

	if (isFinished) {
		return (
			<div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
				<Clock className="size-4" />
				Розыгрыш завершён
			</div>
		);
	}

	const urgent = totalMs <= DAY_MS;

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<Clock className={cn("size-4", urgent ? "text-destructive animate-pulse" : "text-muted-foreground")} />
			<div className="flex items-baseline gap-1.5">
				<span className="text-xs text-muted-foreground">Осталось:</span>
				<div
					className={cn(
						"flex items-baseline gap-1 font-mono tabular-nums",
						urgent ? "text-destructive" : "text-foreground",
					)}
				>
					{days > 0 && <Unit value={days} label="д" />}
					<Unit value={pad(hours)} label="ч" />
					<Unit value={pad(minutes)} label="м" />
					<Unit value={pad(seconds)} label="с" />
				</div>
			</div>
		</div>
	);
}

function Unit({ value, label }: { value: string | number; label: string }) {
	return (
		<span className="inline-flex items-baseline">
			<span className="text-lg font-semibold leading-none">{value}</span>
			<span className="ml-0.5 text-xs text-muted-foreground">{label}</span>
		</span>
	);
}
