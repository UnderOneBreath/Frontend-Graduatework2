import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Pencil, Plus } from "lucide-react";
import type { LotteryResponse } from "@/api/types/lottery.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LotterySheet from "@/components/dashboard/company/LotterySheet";
import { useDashboard } from "@/context/DashboardContext";
import { useCompanyLotteries } from "@/hooks/useCompanyLotteries";
import { useRequireRole } from "@/hooks/useRequireRole";
import { UserRole } from "@/api/types/user.types";

type TabKey = "active" | "completed" | "drafts";

function formatRange(start: string, end: string): string {
	try {
		const s = new Date(start).toLocaleDateString();
		const e = new Date(end).toLocaleDateString();
		return `${s} — ${e}`;
	} catch {
		return `${start} — ${end}`;
	}
}

function statusBadgeVariant(status: string): "default" | "secondary" | "outline" {
	if (status === "active") return "default";
	if (status === "completed") return "secondary";
	return "outline";
}

function statusLabel(status: string): string {
	if (status === "active") return "Активна";
	if (status === "completed") return "Завершена";
	return "Черновик";
}

export default function DrawsView() {
	const allowed = useRequireRole([UserRole.organizer, UserRole.admin]);
	const { active } = useDashboard();
	const navigate = useNavigate();
	const orgId = active.kind === "company" ? active.company.id : null;
	const { lotteries, loading, error, refetch } = useCompanyLotteries(orgId);

	if (!allowed) return null;

	const [tab, setTab] = useState<TabKey>("active");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<LotteryResponse | null>(null);

	const filtered = useMemo(() => {
		return lotteries.filter((l) => {
			if (tab === "active") return l.status === "active";
			if (tab === "completed") return l.status === "completed";
			return l.status !== "active" && l.status !== "completed";
		});
	}, [lotteries, tab]);

	if (active.kind !== "company") {
		return (
			<p className="text-sm text-muted-foreground">
				Выберите компанию в переключателе, чтобы увидеть розыгрыши.
			</p>
		);
	}

	function openCreate() {
		setEditing(null);
		setSheetOpen(true);
	}

	function openEdit(l: LotteryResponse) {
		setEditing(l);
		setSheetOpen(true);
	}

	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight text-foreground">Розыгрыши</h1>
					<p className="text-sm text-muted-foreground">{active.company.name}</p>
				</div>
				<Button onClick={openCreate}>
					<Plus />
					Создать розыгрыш
				</Button>
			</div>

			<Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
				<TabsList>
					<TabsTrigger value="active">Активные</TabsTrigger>
					<TabsTrigger value="completed">Завершённые</TabsTrigger>
					<TabsTrigger value="drafts">Черновики</TabsTrigger>
				</TabsList>
			</Tabs>

			{loading ? (
				<p className="text-sm text-muted-foreground">Загрузка…</p>
			) : error ? (
				<Card>
					<CardContent className="flex flex-col gap-2 py-6 text-sm">
						<p className="text-destructive">{error}</p>
						<Button variant="outline" size="sm" onClick={refetch} className="w-fit">
							Повторить
						</Button>
					</CardContent>
				</Card>
			) : filtered.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center text-sm text-muted-foreground">
						{tab === "drafts"
							? "Нет черновиков. Создайте новый розыгрыш — статус черновика появится после доработки бэкенда."
							: "Здесь пока ничего нет."}
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((l) => (
						<Card key={l.id} className="gap-3">
							<CardHeader className="gap-2">
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="text-base leading-tight">{l.name}</CardTitle>
									<Badge variant={statusBadgeVariant(l.status)}>{statusLabel(l.status)}</Badge>
								</div>
								<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
									<CalendarDays className="size-3.5" />
									{formatRange(l.start_date, l.end_date)}
								</p>
							</CardHeader>
							<CardContent className="flex items-center justify-between text-sm">
								<button
									type="button"
									onClick={() => navigate(`/lotteries/${l.id}`)}
									className="rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
								>
									Подробнее
								</button>
								<Button variant="ghost" size="sm" onClick={() => openEdit(l)}>
									<Pencil />
									Изменить
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<LotterySheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				mode={
					editing
						? { kind: "edit", lottery: editing }
						: { kind: "create", orgId: active.company.id }
				}
				onSaved={refetch}
			/>
		</section>
	);
}
