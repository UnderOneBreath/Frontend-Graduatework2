import { Badge } from "@/components/ui/badge";
import { LotteryStatus } from "@/api/types/lottery.types";

interface LotteryStatusBadgeProps {
	status: LotteryStatus;
	className?: string;
}

export function LotteryStatusBadge({ status, className }: LotteryStatusBadgeProps) {
	const isActive = status === LotteryStatus.Active;
	return (
		<Badge
			variant={isActive ? "success" : "secondary"}
			className={className}
		>
			{isActive ? "Активен" : "Завершён"}
		</Badge>
	);
}
