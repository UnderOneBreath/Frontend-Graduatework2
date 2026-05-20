import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LotteryResponse, TicketResponse } from "@/api/types/lottery.types";
import { LotteryStatus } from "@/api/types/lottery.types";
import { buyTickets } from "@/api/services/lottery";

interface LotteryPrimaryCTAProps {
	lottery: LotteryResponse;
	tickets: TicketResponse[];
	paidCount: number;
	isAuthenticated: boolean;
	userId: string | null;
	isOwner: boolean;
	onParticipated: () => void;
}

function scrollToSection(id: string) {
	const el = document.getElementById(id);
	el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LotteryPrimaryCTA({
	lottery,
	tickets,
	paidCount,
	isAuthenticated,
	userId,
	isOwner,
	onParticipated,
}: LotteryPrimaryCTAProps) {
	const navigate = useNavigate();
	const [busy, setBusy] = useState(false);
	const [feedback, setFeedback] = useState<string | null>(null);

	const isActive = lottery.status === LotteryStatus.Active;
	const isFull = paidCount >= lottery.max_entries;

	if (!isActive) {
		const label = isOwner ? "Открыть отчёт" : "Смотреть победителей";
		return (
			<Button
				size="lg"
				onClick={() => {
					if (isOwner) navigate(`/organizer?company=${lottery.org_id}`);
					else scrollToSection("winners");
				}}
			>
				{label}
				<ArrowRight className="size-4" />
			</Button>
		);
	}

	if (!isAuthenticated) {
		return (
			<Button
				size="lg"
				onClick={() => navigate(`/login?redirect=/lotteries/${lottery.id}`)}
			>
				Войти, чтобы участвовать
				<ArrowRight className="size-4" />
			</Button>
		);
	}

	if (isOwner) {
		return (
			<Button size="lg" onClick={() => navigate(`/organizer?company=${lottery.org_id}`)}>
				Управлять розыгрышем
				<ArrowRight className="size-4" />
			</Button>
		);
	}

	const participate = async () => {
		if (!userId) return;
		const vacant = tickets.find((t) => !t.user_id);
		if (!vacant) {
			setFeedback("Свободных билетов нет");
			return;
		}
		setBusy(true);
		setFeedback(null);
		try {
			await buyTickets(lottery.id, { ticket_ids: [vacant.id], user_id: userId });
			setFeedback(`Вы участвуете, билет №${vacant.serial_number}`);
			onParticipated();
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : "Не удалось оформить участие";
			setFeedback(msg);
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<Button
				size="lg"
				disabled={busy || isFull}
				onClick={participate}
			>
				{busy ? (
					<Loader2 className="size-4 animate-spin" />
				) : (
					<Ticket className="size-4" />
				)}
				{isFull ? "Мест больше нет" : "Участвовать"}
			</Button>
			{feedback && (
				<p className="text-xs text-muted-foreground">{feedback}</p>
			)}
		</div>
	);
}
