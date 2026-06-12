import { Clock, ShieldCheck, Ticket } from "lucide-react";
import type { LotteryResponse } from "@/api/types/lottery.types";
import { LotteryStatus } from "@/api/types/lottery.types";
import { RANDOMIZER_REGISTRY } from "@/api/types/randomizer.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LotteryProgress } from "@/components/lottery/LotteryProgress";
import { useCountdown, type Countdown } from "@/hooks/useCountdown";

interface LotteryCardProps {
	lottery: LotteryResponse;
	companyName?: string;
	soldCount?: number;
	ticketPrice?: number;
	onDetails?: (id: string) => void;
	hideStatus?: boolean;
}

const rub = new Intl.NumberFormat("ru-RU", {
	style: "currency",
	currency: "RUB",
	maximumFractionDigits: 0,
});

function timeLeftLabel(c: Countdown): string {
	if (c.isFinished) return "Завершается";
	if (c.days >= 1) return `${c.days} дн ${c.hours} ч`;
	if (c.hours >= 1) return `${c.hours} ч ${c.minutes} мин`;
	return `${c.minutes} мин`;
}

export function LotteryCard({
	lottery,
	companyName,
	soldCount,
	ticketPrice,
	onDetails,
	hideStatus,
}: LotteryCardProps) {
	const isActive = lottery.status === LotteryStatus.Active;
	const isInactive = lottery.status === LotteryStatus.Inactive;
	const prizes = lottery.prizes ?? [];
	const coverImage = prizes.find((p) => p.img_path)?.img_path ?? null;
	const prizeFund = prizes.reduce((sum, p) => sum + (p.price ?? 0), 0);
	const randomizer = lottery.randomizer_type
		? RANDOMIZER_REGISTRY[lottery.randomizer_type]
		: null;
	const countdown = useCountdown(isActive ? lottery.end_date : null);

	return (
		<div
			className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card cursor-pointer transition-shadow hover:shadow-md"
			onClick={() => onDetails?.(lottery.id)}
		>
			<div className="relative h-44 bg-muted">
				{coverImage ? (
					<img
						src={coverImage}
						alt={lottery.name}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
						<Ticket className="size-7" />
						<span className="text-xs">Розыгрыш</span>
					</div>
				)}

				{!hideStatus && (
					<div className="absolute top-3 left-3">
						<Badge
							variant={isActive ? "success" : "secondary"}
							className="shadow-sm"
						>
							{isActive ? "Активна" : isInactive ? "Черновик" : "Завершена"}
						</Badge>
					</div>
				)}

				{isActive && !countdown.isFinished && (
					<div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
						<Clock className="size-3" />
						{timeLeftLabel(countdown)}
					</div>
				)}

				{randomizer && (
					<div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
						<ShieldCheck className="size-3 text-primary" />
						{randomizer.name}
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-3 p-4">
				<div>
					<p className="font-semibold leading-snug line-clamp-1">
						{lottery.name}
					</p>
					{companyName && (
						<p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
							{companyName}
						</p>
					)}
				</div>

				{prizeFund > 0 && (
					<div className="flex items-baseline justify-between gap-2">
						<span className="text-xs uppercase tracking-wide text-muted-foreground">
							Призовой фонд
						</span>
						<span className="text-base font-semibold tabular-nums text-foreground">
							{rub.format(prizeFund)}
						</span>
					</div>
				)}

				{prizes.length > 0 && (
					<div className="flex flex-wrap items-center gap-1">
						{prizes.slice(0, 3).map((prize) => (
							<Badge key={prize.id} variant="outline" className="font-normal">
								{prize.name}
							</Badge>
						))}
						{prizes.length > 3 && (
							<span className="text-xs text-muted-foreground">
								+{prizes.length - 3}
							</span>
						)}
					</div>
				)}

				{typeof soldCount === "number" && (
					<LotteryProgress paid={soldCount} max={lottery.max_entries} />
				)}

				<div className="mt-auto flex items-end justify-between gap-3 pt-1">
					<div>
						{typeof ticketPrice === "number" && (
							<>
								<p className="text-[11px] uppercase tracking-wide text-muted-foreground">
									Билет
								</p>
								<p className="font-semibold tabular-nums">
									{rub.format(ticketPrice)}
								</p>
							</>
						)}
					</div>
					<Button
						onClick={(e) => {
							e.stopPropagation();
							onDetails?.(lottery.id);
						}}
					>
						{isActive ? "Купить билет" : isInactive ? "Открыть черновик" : "Подробнее"}
					</Button>
				</div>
			</div>
		</div>
	);
}
