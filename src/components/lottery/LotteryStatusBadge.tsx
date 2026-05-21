import { Badge } from "@/components/ui/badge";
import { LotteryStatus } from "@/api/types/lottery.types";

interface LotteryStatusBadgeProps {
	status: LotteryStatus | "inactive";
	className?: string;
}

export function LotteryStatusBadge({ status, className }: LotteryStatusBadgeProps) {
	if (status === LotteryStatus.Active) {
		return (
			<Badge variant="success" className={className}>
				Активен
			</Badge>
		);
	}
	if (status === LotteryStatus.Completed) {
		return (
			<Badge variant="secondary" className={className}>
				Завершён
			</Badge>
		);
	}
	return (
		<Badge variant="warning" className={className}>
			Черновик
		</Badge>
	);
}
