import type { ReactNode } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { LotteryResponse, PrizeResponse } from "@/api/types/lottery.types";
import type { CompanyResponse } from "@/api/types/company.types";
import { LotteryStatus } from "@/api/types/lottery.types";
import { LotteryStatusBadge } from "@/components/lottery/LotteryStatusBadge";
import { LotteryCountdown } from "@/components/lottery/LotteryCountdown";

interface LotteryHeroProps {
	lottery: LotteryResponse;
	prizes: PrizeResponse[];
	organizer: CompanyResponse | null;
	children?: ReactNode;
}

export function LotteryHero({ lottery, prizes, organizer, children }: LotteryHeroProps) {
	const cover = prizes.find((p) => p.img_path)?.img_path ?? null;
	const isActive = lottery.status === LotteryStatus.Active;

	return (
		<section className="overflow-hidden rounded-2xl border border-border bg-card animate-in fade-in duration-500">
			<div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-0">
				<div className="relative aspect-[16/10] md:aspect-auto bg-muted">
					{cover ? (
						<img src={cover} alt={lottery.name} className="size-full object-cover" />
					) : (
						<div className="flex size-full items-center justify-center text-muted-foreground">
							<ImageIcon className="size-12" />
						</div>
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/15" />
					<div className="absolute left-4 top-4">
						<LotteryStatusBadge status={lottery.status} className="shadow-sm" />
					</div>
				</div>

				<div className="flex flex-col gap-5 p-6 md:p-8">
					<div className="flex flex-col gap-2">
						<h1 className="text-2xl md:text-3xl font-semibold leading-tight text-foreground">
							{lottery.name}
						</h1>
						{organizer && (
							<p className="text-sm text-muted-foreground">
								Организатор: <span className="text-foreground">{organizer.name}</span>
							</p>
						)}
					</div>

					{isActive && <LotteryCountdown endDate={lottery.end_date} />}

					{children && <div className="mt-auto">{children}</div>}
				</div>
			</div>
		</section>
	);
}
