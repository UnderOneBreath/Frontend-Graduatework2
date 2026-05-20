import { Trophy } from "lucide-react";
import type { PrizeResponse, TicketResponse } from "@/api/types/lottery.types";

interface LotteryWinnerRowProps {
	ticket: TicketResponse;
	prize?: PrizeResponse;
}

function maskUserId(userId: string | null | undefined): string {
	if (!userId) return "Анонимный участник";
	const tail = userId.slice(-4);
	return `Участник ****${tail}`;
}

export function LotteryWinnerRow({ ticket, prize }: LotteryWinnerRowProps) {
	return (
		<div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
				<Trophy className="size-5" />
			</div>
			<div className="flex flex-1 flex-col gap-0.5 min-w-0">
				<div className="flex items-baseline gap-2">
					<span className="font-mono text-sm font-semibold text-foreground">
						№{ticket.serial_number}
					</span>
					<span className="text-sm text-muted-foreground truncate">
						{maskUserId(ticket.user_id)}
					</span>
				</div>
				<div className="text-sm text-foreground truncate">
					{prize ? prize.name : "Приз будет объявлен"}
				</div>
			</div>
		</div>
	);
}
