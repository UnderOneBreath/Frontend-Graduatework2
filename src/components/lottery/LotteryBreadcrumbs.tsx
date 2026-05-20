import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface LotteryBreadcrumbsProps {
	name: string;
}

export function LotteryBreadcrumbs({ name }: LotteryBreadcrumbsProps) {
	return (
		<nav className="flex items-center gap-1 text-sm text-muted-foreground" aria-label="breadcrumbs">
			<Link to="/" className="hover:text-foreground transition-colors">
				Главная
			</Link>
			<ChevronRight className="size-3.5" />
			<Link to="/lotteries" className="hover:text-foreground transition-colors">
				Розыгрыши
			</Link>
			<ChevronRight className="size-3.5" />
			<span className="text-foreground truncate max-w-[40ch]" title={name}>
				{name}
			</span>
		</nav>
	);
}
