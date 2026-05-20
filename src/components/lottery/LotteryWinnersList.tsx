import type { PrizeResponse, TicketResponse } from "@/api/types/lottery.types";
import { LotteryStatus } from "@/api/types/lottery.types";
import { LotteryWinnerRow } from "@/components/lottery/LotteryWinnerRow";

interface LotteryWinnersListProps {
	winners: TicketResponse[];
	prizesById: Record<string, PrizeResponse>;
	status: LotteryStatus;
}

export function LotteryWinnersList({ winners, prizesById, status }: LotteryWinnersListProps) {
	if (winners.length === 0) {
		const text =
			status === LotteryStatus.Completed
				? "Розыгрыш завершён, но победители ещё не опубликованы"
				: "Победители появятся после розыгрыша";
		return (
			<div className="flex justify-center rounded-xl border border-dashed border-border py-10 text-sm text-muted-foreground">
				{text}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{winners.map((ticket) => (
				<LotteryWinnerRow
					key={ticket.id}
					ticket={ticket}
					prize={ticket.prize_id ? prizesById[ticket.prize_id] : undefined}
				/>
			))}
		</div>
	);
}
