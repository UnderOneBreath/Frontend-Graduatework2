import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentRole, isAuthenticated } from "@/api/utils/jwt";
import { UserRole } from "@/api/types/user.types";
import { logout } from "@/api/services/auth";
import { useTheme } from "@/context/ThemeProvider";

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
	const { theme, toggle } = useTheme();
	const isLoggedIn = isAuthenticated();
	const email = isLoggedIn ? localStorage.getItem("userEmail") : null;
	const role = isLoggedIn ? getCurrentRole() : null;
	const showAdminLink = role === UserRole.admin || role === UserRole.moderator;
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function onClickOutside(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, []);

	async function handleLogout() {
		setMenuOpen(false);
		await logout();
		navigate("/login", { replace: true });
	}

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

				<div className="justify-self-end flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={toggle}
						aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
					>
						{theme === "light" ? <Moon /> : <Sun />}
					</Button>

					{isLoggedIn && email ? (
						<div ref={menuRef} className="relative">
							<button
								type="button"
								onClick={() => setMenuOpen((o) => !o)}
								className="flex items-center gap-2 rounded-md p-1 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50"
								aria-haspopup="menu"
								aria-expanded={menuOpen}
								aria-label="Меню пользователя"
							>
								<Avatar size="sm">
									<AvatarFallback>{getInitials(email)}</AvatarFallback>
								</Avatar>
							</button>
							{menuOpen ? (
								<div
									role="menu"
									className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
								>
									<div className="border-b px-3 py-2 text-sm">
										<div className="truncate font-medium">{email.split("@")[0]}</div>
										<div className="truncate text-xs text-muted-foreground">{email}</div>
									</div>
									<Link
										to="/dashboard"
										role="menuitem"
										onClick={() => setMenuOpen(false)}
										className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
									>
										<User className="size-4" /> Личный кабинет
									</Link>
									<button
										type="button"
										role="menuitem"
										onClick={handleLogout}
										className="flex w-full items-center gap-2 border-t px-3 py-2 text-sm hover:bg-accent"
									>
										<LogOut className="size-4" /> Выйти
									</button>
								</div>
							) : null}
						</div>
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
