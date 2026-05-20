import { useState } from "react";
import { Gift } from "lucide-react";
import type { PrizeResponse } from "@/api/types/lottery.types";
import { cn } from "@/lib/utils";

interface LotteryPrizeCardProps {
	prize: PrizeResponse;
	rank?: number;
}

function formatPrice(value: number): string {
	return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

export function LotteryPrizeCard({ prize, rank }: LotteryPrizeCardProps) {
	const [loaded, setLoaded] = useState(false);
	const hasImage = !!prize.img_path;

	return (
		<article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
			<div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
				{hasImage ? (
					<>
						{!loaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
						<img
							src={prize.img_path}
							alt={prize.name}
							onLoad={() => setLoaded(true)}
							className={cn(
								"size-full object-cover transition-opacity duration-300",
								loaded ? "opacity-100" : "opacity-0",
							)}
						/>
					</>
				) : (
					<div className="flex size-full items-center justify-center text-muted-foreground">
						<Gift className="size-10" />
					</div>
				)}
				{rank != null && (
					<div className="absolute left-3 top-3 rounded-full bg-background/95 px-2 py-0.5 text-xs font-semibold text-foreground shadow-sm">
						#{rank}
					</div>
				)}
			</div>
			<div className="flex flex-1 flex-col gap-2 p-4">
				<h3 className="text-base font-semibold leading-snug text-foreground line-clamp-2">
					{prize.name}
				</h3>
				{prize.description && (
					<p className="text-sm text-muted-foreground line-clamp-3">
						{prize.description}
					</p>
				)}
				<div className="mt-auto pt-2 text-sm font-medium text-foreground">
					{formatPrice(prize.price)}
				</div>
			</div>
		</article>
	);
}
