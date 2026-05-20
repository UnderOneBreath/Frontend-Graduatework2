import { useEffect, useRef, useState } from "react";
import {
	BarChart3,
	Bell,
	Building2,
	Check,
	ChevronsUpDown,
	LayoutGrid,
	LogOut,
	Moon,
	Pencil,
	Plus,
	Settings,
	Sun,
	Ticket,
	User,
	X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MockCompany = { id: string; name: string; address: string; inn: string; email: string };
type DrawStatus = "active" | "completed" | "draft";
type MockDraw = {
	id: string;
	name: string;
	status: DrawStatus;
	endDate: string;
	prizes: number;
	orgId: string;
};

type ActiveContext = { kind: "personal" } | { kind: "company"; companyId: string };

const MOCK_USER = { id: "u1", name: "Alex Petrov", email: "alex@example.com" };

const MOCK_COMPANIES: MockCompany[] = [
	{
		id: "c1",
		name: "Stellar Marketing",
		address: "Moscow, Tverskaya 12",
		inn: "7700000001",
		email: "team@stellar.example",
	},
	{
		id: "c2",
		name: "Indigo Studio",
		address: "St. Petersburg, Nevsky 45",
		inn: "7800000002",
		email: "hi@indigo.example",
	},
];

const MOCK_DRAWS: MockDraw[] = [
	{ id: "d1", name: "Summer Giveaway 2026", status: "active", endDate: "2026-07-15", prizes: 5, orgId: "c1" },
	{ id: "d2", name: "Black Friday Spin", status: "active", endDate: "2026-11-28", prizes: 3, orgId: "c1" },
	{ id: "d3", name: "Birthday Lottery", status: "completed", endDate: "2026-02-10", prizes: 10, orgId: "c1" },
	{ id: "d4", name: "Spring Launch", status: "completed", endDate: "2026-03-20", prizes: 7, orgId: "c1" },
	{ id: "d5", name: "Loyalty Reward", status: "draft", endDate: "2026-09-01", prizes: 2, orgId: "c1" },
	{ id: "d6", name: "Studio Showcase", status: "active", endDate: "2026-08-05", prizes: 4, orgId: "c2" },
	{ id: "d7", name: "Beta Release Draw", status: "draft", endDate: "2026-10-12", prizes: 1, orgId: "c2" },
];

const PERSONAL_NAV = [
	{ key: "overview", label: "Overview", icon: LayoutGrid },
	{ key: "participations", label: "My Participations", icon: Ticket },
	{ key: "notifications", label: "Notifications", icon: Bell },
	{ key: "account", label: "Account", icon: User },
] as const;

const COMPANY_NAV = [
	{ key: "draws", label: "Company Draws", icon: LayoutGrid },
	{ key: "analytics", label: "Analytics", icon: BarChart3 },
	{ key: "settings", label: "Organization Settings", icon: Settings },
] as const;

export default function UnifiedDashboardPrototype() {
	const [active, setActive] = useState<ActiveContext>({ kind: "personal" });
	const [nav, setNav] = useState<string>("overview");
	const [tab, setTab] = useState<"active" | "completed" | "drafts">("active");
	const [theme, setTheme] = useState<"light" | "dark">(() =>
		typeof document !== "undefined" && document.documentElement.classList.contains("dark")
			? "dark"
			: "light"
	);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editingDraw, setEditingDraw] = useState<MockDraw | null>(null);
	const [switcherOpen, setSwitcherOpen] = useState(false);
	const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

	const switcherRef = useRef<HTMLDivElement>(null);
	const avatarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handle(e: MouseEvent) {
			if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
				setSwitcherOpen(false);
			}
			if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
				setAvatarMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", handle);
		return () => document.removeEventListener("mousedown", handle);
	}, []);

	function toggleTheme() {
		const next = theme === "light" ? "dark" : "light";
		setTheme(next);
		document.documentElement.classList.toggle("dark", next === "dark");
	}

	function selectPersonal() {
		setActive({ kind: "personal" });
		setNav("overview");
		setSwitcherOpen(false);
	}

	function selectCompany(companyId: string) {
		setActive({ kind: "company", companyId });
		setNav("draws");
		setSwitcherOpen(false);
	}

	function openCreate() {
		setEditingDraw(null);
		setSheetOpen(true);
	}

	function openEdit(draw: MockDraw) {
		setEditingDraw(draw);
		setSheetOpen(true);
	}

	const activeCompany =
		active.kind === "company"
			? MOCK_COMPANIES.find((c) => c.id === active.companyId) ?? null
			: null;

	const navItems = active.kind === "personal" ? PERSONAL_NAV : COMPANY_NAV;

	const drawsForCompany =
		active.kind === "company" ? MOCK_DRAWS.filter((d) => d.orgId === active.companyId) : [];

	const filteredDraws = drawsForCompany.filter((d) => {
		if (tab === "active") return d.status === "active";
		if (tab === "completed") return d.status === "completed";
		return d.status !== "active" && d.status !== "completed";
	});

	const initials = MOCK_USER.name
		.split(" ")
		.map((p) => p[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
					<div className="flex items-center gap-2 font-semibold">
						<div className="size-6 rounded-md bg-foreground" />
						<span className="tracking-tight">Lottery</span>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={toggleTheme}
							aria-label="Toggle theme"
						>
							{theme === "light" ? <Moon /> : <Sun />}
						</Button>
						<div ref={avatarRef} className="relative">
							<button
								type="button"
								onClick={() => setAvatarMenuOpen((o) => !o)}
								className="flex items-center gap-2 rounded-md p-1 hover:bg-accent"
								aria-haspopup="menu"
								aria-expanded={avatarMenuOpen}
							>
								<Avatar size="sm">
									<AvatarFallback>{initials}</AvatarFallback>
								</Avatar>
							</button>
							{avatarMenuOpen ? (
								<div
									role="menu"
									className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
								>
									<div className="border-b px-3 py-2 text-sm">
										<div className="font-medium">{MOCK_USER.name}</div>
										<div className="text-muted-foreground text-xs">{MOCK_USER.email}</div>
									</div>
									<button
										type="button"
										role="menuitem"
										className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
									>
										<LogOut className="size-4" /> Log out
									</button>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</header>

			<div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 md:grid-cols-[280px_1fr]">
				<aside>
					<Card className="gap-3 py-3">
						<CardContent className="px-3">
							<div ref={switcherRef} className="relative">
								<button
									type="button"
									onClick={() => setSwitcherOpen((o) => !o)}
									className="flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-left text-sm hover:bg-accent"
									aria-haspopup="listbox"
									aria-expanded={switcherOpen}
								>
									<span className="flex items-center gap-2 truncate">
										{active.kind === "personal" ? (
											<>
												<User className="size-4 shrink-0" />
												<span className="truncate">Personal Account</span>
											</>
										) : (
											<>
												<Building2 className="size-4 shrink-0" />
												<span className="truncate">
													{activeCompany?.name ?? "Company"}
												</span>
											</>
										)}
									</span>
									<ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
								</button>
								{switcherOpen ? (
									<div
										role="listbox"
										className="absolute left-0 right-0 top-full z-40 mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
									>
										<button
											type="button"
											role="option"
											aria-selected={active.kind === "personal"}
											onClick={selectPersonal}
											className="flex w-full items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-accent"
										>
											<span className="flex items-center gap-2">
												<User className="size-4" />
												Personal Account
											</span>
											{active.kind === "personal" ? (
												<Check className="size-4" />
											) : null}
										</button>
										<div className="border-t" />
										{MOCK_COMPANIES.map((c) => {
											const selected =
												active.kind === "company" && active.companyId === c.id;
											return (
												<button
													key={c.id}
													type="button"
													role="option"
													aria-selected={selected}
													onClick={() => selectCompany(c.id)}
													className="flex w-full items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-accent"
												>
													<span className="flex min-w-0 items-center gap-2">
														<Building2 className="size-4 shrink-0" />
														<span className="truncate">{c.name}</span>
													</span>
													<span className="flex shrink-0 items-center gap-2">
														<Badge
															variant="outline"
															className="text-[10px] uppercase tracking-wider"
														>
															Member
														</Badge>
														{selected ? <Check className="size-4" /> : null}
													</span>
												</button>
											);
										})}
									</div>
								) : null}
							</div>

							<nav className="mt-3 flex flex-col gap-1">
								{navItems.map((item) => {
									const Icon = item.icon;
									const selected = nav === item.key;
									return (
										<button
											key={item.key}
											type="button"
											onClick={() => setNav(item.key)}
											className={cn(
												"flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
												selected
													? "bg-accent text-accent-foreground"
													: "text-foreground hover:bg-accent/60"
											)}
										>
											<Icon className="size-4" />
											{item.label}
										</button>
									);
								})}
							</nav>
						</CardContent>
					</Card>
				</aside>

				<main className="min-h-[60vh]">
					{active.kind === "personal" ? (
						<PersonalContent nav={nav} userName={MOCK_USER.name} email={MOCK_USER.email} />
					) : (
						<CompanyContent
							nav={nav}
							tab={tab}
							setTab={setTab}
							draws={filteredDraws}
							company={activeCompany}
							onCreate={openCreate}
							onEdit={openEdit}
						/>
					)}
				</main>
			</div>

			{sheetOpen ? (
				<Sheet
					onClose={() => setSheetOpen(false)}
					title={editingDraw ? "Edit draw" : "Create draw"}
					draw={editingDraw}
				/>
			) : null}
		</div>
	);
}

function PersonalContent({
	nav,
	userName,
	email,
}: {
	nav: string;
	userName: string;
	email: string;
}) {
	if (nav === "overview") {
		return (
			<div className="flex flex-col gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Welcome back, {userName.split(" ")[0]}</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Your personal dashboard. Switch to a company in the sidebar to manage draws.
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Become an organizer</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">
							Register a company to host your own draws.
						</span>
						<Button variant="outline" size="sm">
							Apply
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (nav === "participations") {
		return (
			<PlaceholderView
				title="My Participations"
				hint="Draws you've entered will appear here."
			/>
		);
	}

	if (nav === "notifications") {
		return (
			<PlaceholderView
				title="Notifications"
				hint="System messages and draw updates."
			/>
		);
	}

	if (nav === "account") {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Account</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 text-sm">
					<ReadField label="Name" value={userName} />
					<ReadField label="Email" value={email} />
					<ReadField label="Phone" value="+7 (000) 000-00-00" />
				</CardContent>
			</Card>
		);
	}

	return null;
}

function CompanyContent({
	nav,
	tab,
	setTab,
	draws,
	company,
	onCreate,
	onEdit,
}: {
	nav: string;
	tab: "active" | "completed" | "drafts";
	setTab: (t: "active" | "completed" | "drafts") => void;
	draws: MockDraw[];
	company: MockCompany | null;
	onCreate: () => void;
	onEdit: (d: MockDraw) => void;
}) {
	if (nav === "draws") {
		return (
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">My Draws</h1>
						<p className="text-sm text-muted-foreground">{company?.name ?? ""}</p>
					</div>
					<Button onClick={onCreate}>
						<Plus />
						Create Draw
					</Button>
				</div>

				<div className="flex w-fit gap-1 rounded-md bg-muted p-1">
					{(["active", "completed", "drafts"] as const).map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => setTab(t)}
							className={cn(
								"rounded px-3 py-1.5 text-sm font-medium capitalize transition-colors",
								tab === t
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							)}
						>
							{t}
						</button>
					))}
				</div>

				{draws.length === 0 ? (
					<Card>
						<CardContent className="py-12 text-center text-sm text-muted-foreground">
							No draws in this view.
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{draws.map((d) => (
							<Card key={d.id} className="gap-3">
								<CardHeader className="gap-2">
									<div className="flex items-start justify-between gap-2">
										<CardTitle className="text-base">{d.name}</CardTitle>
										<Badge
											variant={
												d.status === "active"
													? "default"
													: d.status === "completed"
														? "secondary"
														: "outline"
											}
											className="capitalize"
										>
											{d.status}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="flex items-center justify-between text-sm text-muted-foreground">
									<span>Ends {new Date(d.endDate).toLocaleDateString()}</span>
									<Button variant="ghost" size="xs" onClick={() => onEdit(d)}>
										<Pencil />
										Edit
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		);
	}

	if (nav === "analytics") {
		return (
			<PlaceholderView
				title="Analytics"
				hint="Engagement and ticket metrics. Coming soon."
			/>
		);
	}

	if (nav === "settings") {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Organization Settings</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 text-sm">
					<ReadField label="Company name" value={company?.name ?? ""} />
					<ReadField label="INN" value={company?.inn ?? ""} />
					<ReadField label="Address" value={company?.address ?? ""} />
					<ReadField label="Email" value={company?.email ?? ""} />
				</CardContent>
			</Card>
		);
	}

	return null;
}

function PlaceholderView({ title, hint }: { title: string; hint: string }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="text-sm text-muted-foreground">{hint}</CardContent>
		</Card>
	);
}

function ReadField({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid grid-cols-[140px_1fr] items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0">
			<span className="text-muted-foreground">{label}</span>
			<span className="font-medium">{value || "—"}</span>
		</div>
	);
}

function Sheet({
	onClose,
	title,
	draw,
}: {
	onClose: () => void;
	title: string;
	draw: MockDraw | null;
}) {
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [onClose]);

	return (
		<div className="fixed inset-0 z-50">
			<div
				className="absolute inset-0 bg-black/40"
				onClick={onClose}
				aria-hidden="true"
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col gap-6 border-l bg-background p-6 shadow-xl"
			>
				<div className="flex items-start justify-between">
					<div>
						<h2 className="text-lg font-semibold tracking-tight">{title}</h2>
						<p className="text-sm text-muted-foreground">
							{draw ? "Update the draw configuration." : "Configure the new draw."}
						</p>
					</div>
					<Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
						<X />
					</Button>
				</div>

				<div className="flex flex-1 flex-col gap-4 overflow-y-auto">
					<FormField label="Name" defaultValue={draw?.name} />
					<FormField label="End date" type="date" defaultValue={draw?.endDate} />
					<FormField
						label="Prizes"
						type="number"
						defaultValue={draw ? String(draw.prizes) : "1"}
					/>
					<FormField label="Max entries" type="number" placeholder="1000" />
				</div>

				<div className="flex justify-end gap-2 border-t pt-4">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={onClose}>{draw ? "Save changes" : "Create draw"}</Button>
				</div>
			</div>
		</div>
	);
}

function FormField({
	label,
	type = "text",
	defaultValue,
	placeholder,
}: {
	label: string;
	type?: string;
	defaultValue?: string;
	placeholder?: string;
}) {
	return (
		<label className="grid gap-1.5">
			<span className="text-sm font-medium">{label}</span>
			<input
				type={type}
				defaultValue={defaultValue}
				placeholder={placeholder}
				className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
			/>
		</label>
	);
}
