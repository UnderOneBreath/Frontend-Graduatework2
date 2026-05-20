import { NavLink } from "react-router-dom";
import {
	BarChart3,
	Bell,
	LayoutGrid,
	Settings,
	Ticket,
	User,
	type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/context/DashboardContext";

interface NavItem {
	to: string;
	label: string;
	icon: LucideIcon;
}

const PERSONAL_NAV: NavItem[] = [
	{ to: "/dashboard/overview", label: "Обзор", icon: LayoutGrid },
	{ to: "/dashboard/participations", label: "Мои участия", icon: Ticket },
	{ to: "/dashboard/notifications", label: "Уведомления", icon: Bell },
	{ to: "/dashboard/account", label: "Аккаунт", icon: User },
];

const COMPANY_NAV: NavItem[] = [
	{ to: "/dashboard/draws", label: "Розыгрыши", icon: LayoutGrid },
	{ to: "/dashboard/analytics", label: "Аналитика", icon: BarChart3 },
	{ to: "/dashboard/settings", label: "Настройки", icon: Settings },
];

export default function NavList() {
	const { active } = useDashboard();
	const items = active.kind === "personal" ? PERSONAL_NAV : COMPANY_NAV;

	return (
		<nav className="flex flex-col gap-1">
			{items.map(({ to, label, icon: Icon }) => (
				<NavLink
					key={to}
					to={to}
					end
					className={({ isActive }) =>
						cn(
							"flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
							isActive
								? "bg-accent text-accent-foreground"
								: "text-foreground hover:bg-accent/60"
						)
					}
				>
					<Icon className="size-4" />
					{label}
				</NavLink>
			))}
		</nav>
	);
}
