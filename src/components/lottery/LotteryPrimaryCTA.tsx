import { useNavigate } from "react-router-dom";
import { ArrowRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LotteryResponse, TicketResponse } from "@/api/types/lottery.types";
import { LotteryStatus, TicketStatus } from "@/api/types/lottery.types";
import type { CompanyResponse } from "@/api/types/company.types";
import { LotteryBookingForm } from "@/components/lottery/LotteryBookingForm";

interface LotteryPrimaryCTAProps {
	lottery: LotteryResponse;
	tickets: TicketResponse[];
	isAuthenticated: boolean;
	userId: string | null;
	isOwner: boolean;
	organizer: CompanyResponse | null;
	onParticipated: () => void;
}

function scrollToSection(id: string) {
	const el = document.getElementById(id);
	el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LotteryPrimaryCTA({
	lottery,
	tickets,
	isAuthenticated,
	userId,
	isOwner,
	organizer,
	onParticipated,
}: LotteryPrimaryCTAProps) {
	const navigate = useNavigate();

	const isActive = lottery.status === LotteryStatus.Active;
	const isFull = !tickets.some((t) => t.status === TicketStatus.Vacant);

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

	if (!userId) return null;

	const trigger = (
		<Button size="lg" disabled={isFull}>
			<Ticket className="size-4" />
			{isFull ? "Мест больше нет" : "Купить билеты"}
		</Button>
	);

	return (
		<LotteryBookingForm
			lottery={lottery}
			tickets={tickets}
			organizer={organizer}
			userId={userId}
			onBooked={onParticipated}
			trigger={trigger}
		/>
	);
}
