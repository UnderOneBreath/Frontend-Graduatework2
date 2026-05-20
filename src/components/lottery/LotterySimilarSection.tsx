import { useNavigate } from "react-router-dom";
import { LotteryList } from "@/components/lottery-list";

interface LotterySimilarSectionProps {
	orgId: string;
	currentId: string;
}

export function LotterySimilarSection({ orgId, currentId }: LotterySimilarSectionProps) {
	const navigate = useNavigate();
	return (
		<LotteryList
			orgId={orgId}
			excludeId={currentId}
			limit={4}
			emptyText="У организатора пока нет других розыгрышей"
			onLotteryDetails={(id) => navigate(`/lotteries/${id}`)}
		/>
	);
}
