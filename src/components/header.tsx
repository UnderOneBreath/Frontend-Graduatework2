import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCurrentRole, isAuthenticated } from "@/api/utils/jwt";
import { UserRole } from "@/api/types/user.types";

function getInitials(email: string): string {
	const local = email.split("@")[0] ?? email;
	const parts = local.split(/[._\-+]/).filter(Boolean);
	if (parts.length === 0) return "?";
	return parts
		.slice(0, 2)
		.map((p) => p[0])
		.join("")
		.toUpperCase();
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
	`text-sm transition-colors ${
		isActive
			? "text-foreground font-medium"
			: "text-muted-foreground hover:text-foreground"
	}`;

export default function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	const isLoggedIn = isAuthenticated();
	const email = isLoggedIn ? localStorage.getItem("userEmail") : null;
	const role = isLoggedIn ? getCurrentRole() : null;
	const showAdminLink = role === UserRole.admin || role === UserRole.moderator;

	if (location.pathname.startsWith("/dashboard")) return null;
	if (location.pathname.startsWith("/admin")) return null;
	if (location.pathname.startsWith("/__prototype")) return null;

	return (
		<header className="w-full border-b border-border bg-background">
			<div className="mx-auto max-w-6xl px-6 h-14 grid grid-cols-3 items-center gap-6">
				<div className="justify-self-start">
					<Link
						to="/"
						className="text-base text-foreground tracking-tight hover:opacity-80 transition-opacity"
					>
						{/* Лотерея */}
					</Link>
				</div>

				<nav className="justify-self-center flex items-center gap-8">
					<NavLink to="/" end className={navLinkClass}>
						Главная
					</NavLink>
					<NavLink to="/lotteries" className={navLinkClass}>
						Розыгрыши
					</NavLink>
					{showAdminLink && (
						<NavLink to="/admin" className={navLinkClass}>
							Админка
						</NavLink>
					)}
				</nav>

				<div className="justify-self-end">
					{isLoggedIn && email ? (
						<Link
							to="/dashboard"
							aria-label="Личный кабинет"
							title="Личный кабинет"
							className="h-9 w-9 rounded-md bg-muted text-foreground text-sm font-medium flex items-center justify-center hover:bg-muted/70 transition-colors"
						>
							{getInitials(email)}
						</Link>
					) : (
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigate("/login")}
						>
							Войти
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
