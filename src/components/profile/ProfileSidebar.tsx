import { useEffect } from "react";
import { Link } from "react-router-dom";

export type ProfileTab = "overview" | "participations" | "notifications" | "account";

interface SidebarItem {
	id: ProfileTab;
	label: string;
	hint?: string;
}

const ITEMS: SidebarItem[] = [
	{ id: "overview", label: "Обзор", hint: "Профиль и бизнес-пространство" },
	{ id: "participations", label: "Мои участия", hint: "История розыгрышей" },
	{ id: "notifications", label: "Уведомления", hint: "Новости и победы" },
	{ id: "account", label: "Аккаунт", hint: "Контакты, безопасность, выход" },
];

interface ProfileSidebarProps {
	active: ProfileTab;
	onSelect: (tab: ProfileTab) => void;
	open: boolean;
	onClose: () => void;
	showOrganizerLink?: boolean;
}

export default function ProfileSidebar({
	active,
	onSelect,
	open,
	onClose,
	showOrganizerLink = false,
}: ProfileSidebarProps) {
	useEffect(() => {
		if (!open) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	function handleSelect(id: ProfileTab) {
		onSelect(id);
		onClose();
	}

	return (
		<>
			{open && (
				<button
					type="button"
					aria-label="Закрыть меню"
					onClick={onClose}
					className="fixed inset-0 z-30 bg-foreground/20 md:hidden"
				/>
			)}

			<aside
				className={[
					"bg-background transition-transform",
					"fixed z-40 inset-y-0 left-0 w-72 border-r border-border",
					open ? "translate-x-0" : "-translate-x-full",
					"md:static md:inset-auto md:translate-x-0 md:w-64 md:shrink-0",
					"md:h-auto md:border md:border-border md:rounded-md",
				].join(" ")}
			>
				<div className="flex flex-col">
					<div className="flex items-center justify-between px-5 py-4 border-b border-border md:hidden">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">
							Меню
						</p>
						<button
							type="button"
							onClick={onClose}
							aria-label="Закрыть меню"
							className="text-muted-foreground hover:text-foreground text-sm"
						>
							✕
						</button>
					</div>

					<nav className="flex flex-col py-2">
						{ITEMS.map((item) => {
							const isActive = item.id === active;
							return (
								<button
									key={item.id}
									type="button"
									onClick={() => handleSelect(item.id)}
									className={`w-full text-left px-6 py-3 border-l-2 transition-colors ${
										isActive
											? "bg-muted border-foreground text-foreground"
											: "border-transparent text-foreground hover:bg-muted/50"
									}`}
								>
									<div className="text-sm">{item.label}</div>
									{item.hint && (
										<div className="text-xs text-muted-foreground mt-0.5">
											{item.hint}
										</div>
									)}
								</button>
							);
						})}
						{showOrganizerLink && (
							<Link
								to="/organizer"
								onClick={onClose}
								className="block w-full text-left px-6 py-3 border-l-2 border-transparent text-foreground hover:bg-muted/50 transition-colors"
							>
								<div className="text-sm">Панель организатора</div>
								<div className="text-xs text-muted-foreground mt-0.5">
									Управление компанией и розыгрышами
								</div>
							</Link>
						)}
					</nav>
				</div>
			</aside>
		</>
	);
}
