import { CalendarDays, Gift, Users } from "lucide-react";
import type { LotteryResponse } from "@/api/types/lottery.types";
import { LotteryProgress } from "@/components/lottery/LotteryProgress";

interface LotteryMetaStatsProps {
	lottery: LotteryResponse;
	prizeCount: number;
	paidCount: number;
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("ru-RU", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export function LotteryMetaStats({ lottery, prizeCount, paidCount }: LotteryMetaStatsProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-border bg-card p-5">
			<Tile
				icon={<CalendarDays className="size-4" />}
				label="Даты проведения"
				value={
					<span className="text-sm text-foreground">
						{formatDate(lottery.start_date)} — {formatDate(lottery.end_date)}
					</span>
				}
			/>
			<Tile
				icon={<Users className="size-4" />}
				label="Заполненность"
				value={<LotteryProgress paid={paidCount} max={lottery.max_entries} />}
			/>
			<Tile
				icon={<Gift className="size-4" />}
				label="Призов разыгрывается"
				value={<span className="text-2xl font-semibold text-foreground">{prizeCount}</span>}
			/>
		</div>
	);
}

function Tile({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
				{icon}
				{label}
			</div>
			<div>{value}</div>
		</div>
	);
}
