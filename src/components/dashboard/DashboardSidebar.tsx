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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/context/DashboardContext";
import OrgSwitcher from "@/components/dashboard/OrgSwitcher";

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

function navItemClass(isActive: boolean): string {
	return cn(
		"flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
		isActive
			? "bg-accent text-accent-foreground"
			: "text-foreground hover:bg-accent/60"
	);
}

export default function DashboardSidebar() {
	const { active, companies, loadingCompanies, setPersonal } = useDashboard();

	const showOrgSection = loadingCompanies || companies.length > 0;

	return (
		<aside className="md:sticky md:top-6 md:self-start">
			<Card className="gap-3 py-3">
				<CardContent className="flex flex-col gap-3 px-3">
					<div className="flex flex-col gap-1">
						<p className="px-3 pt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Личный кабинет
						</p>
						<nav className="flex flex-col gap-1">
							{PERSONAL_NAV.map(({ to, label, icon: Icon }) => (
								<NavLink
									key={to}
									to={to}
									end
									onClick={setPersonal}
									className={({ isActive }) => navItemClass(isActive)}
								>
									<Icon className="size-4" />
									{label}
								</NavLink>
							))}
						</nav>
					</div>

					{showOrgSection ? (
						<>
							<Separator />
							<div className="flex flex-col gap-1">
								<p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
									Организация
								</p>
								{/* TODO: фильтровать по OrgUsersLink.user_id когда бэк начнёт отдавать CompanyResponse.employees — см. src/hooks/useUserCompanies.ts:34 */}
								<div className="px-3">
									<OrgSwitcher />
								</div>
								{active.kind === "company" ? (
									<nav className="flex flex-col gap-1">
										{COMPANY_NAV.map(({ to, label, icon: Icon }) => (
											<NavLink
												key={to}
												to={to}
												end
												className={({ isActive }) => navItemClass(isActive)}
											>
												<Icon className="size-4" />
												{label}
											</NavLink>
										))}
									</nav>
								) : null}
							</div>
						</>
					) : null}
				</CardContent>
			</Card>
		</aside>
	);
}
