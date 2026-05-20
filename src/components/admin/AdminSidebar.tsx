import { NavLink } from "react-router-dom";
import { ClipboardList, Trophy, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNavItem {
	to: string;
	label: string;
	icon: LucideIcon;
}

const ADMIN_NAV: AdminNavItem[] = [
	{ to: "/admin/applications", label: "Заявки компаний", icon: ClipboardList },
	{ to: "/admin/lotteries", label: "Лотереи на модерации", icon: Trophy },
];

export default function AdminSidebar() {
	return (
		<aside className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<p className="text-xs uppercase tracking-wide text-muted-foreground px-3">
					Модерация
				</p>
			</div>
			<nav className="flex flex-col gap-1">
				{ADMIN_NAV.map(({ to, label, icon: Icon }) => (
					<NavLink
						key={to}
						to={to}
						end
						className={({ isActive }) =>
							cn(
								"flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
								isActive
									? "bg-accent text-accent-foreground"
									: "text-foreground hover:bg-accent/60",
							)
						}
					>
						<Icon className="size-4" />
						{label}
					</NavLink>
				))}
			</nav>
		</aside>
	);
}
