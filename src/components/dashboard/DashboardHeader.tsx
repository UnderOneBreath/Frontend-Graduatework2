import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { logout } from "@/api/services/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/DashboardContext";
import { useTheme } from "@/context/ThemeProvider";

function getInitials(name: string, email: string): string {
	if (name) {
		const parts = name.trim().split(/\s+/).filter(Boolean);
		if (parts.length > 0) {
			return parts
				.slice(0, 2)
				.map((p) => p[0])
				.join("")
				.toUpperCase();
		}
	}
	const local = email.split("@")[0] ?? email;
	const parts = local.split(/[._\-+]/).filter(Boolean);
	if (parts.length === 0) return "?";
	return parts
		.slice(0, 2)
		.map((p) => p[0])
		.join("")
		.toUpperCase();
}

export default function DashboardHeader() {
	const { theme, toggle } = useTheme();
	const { user } = useDashboard();
	const navigate = useNavigate();
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

	const email = user?.email ?? localStorage.getItem("userEmail") ?? "";
	const initials = getInitials(user?.name ?? "", email);

	return (
		<header className="border-b border-border bg-background">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-6">
				<Link to="/" className="text-base font-medium tracking-tight hover:opacity-80">
					Лотерея
				</Link>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={toggle}
						aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
					>
						{theme === "light" ? <Moon /> : <Sun />}
					</Button>
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
								<AvatarFallback>{initials}</AvatarFallback>
							</Avatar>
						</button>
						{menuOpen ? (
							<div
								role="menu"
								className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
							>
								<div className="border-b px-3 py-2 text-sm">
									<div className="truncate font-medium">{user?.name ?? "—"}</div>
									<div className="truncate text-xs text-muted-foreground">{email}</div>
								</div>
								<Link
									to="/dashboard/account"
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
				</div>
			</div>
		</header>
	);
}
