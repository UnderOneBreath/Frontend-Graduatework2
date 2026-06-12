import { useMemo, useState } from "react";
import type { OrganizerApplication } from "@/api/types/moderation.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModerationQueue } from "@/hooks/useModerationQueue";
import ApplicationReviewSheet from "@/components/admin/ApplicationReviewSheet";

type TabKey = "pending" | "accepted" | "rejected";

const TAB_LABEL: Record<TabKey, string> = {
	pending: "На модерации",
	accepted: "Одобренные",
	rejected: "Отклонённые",
};

const STATUS_TEXT: Record<TabKey, string> = {
	pending: "Не рассмотрено",
	accepted: "Одобрено",
	rejected: "Отклонено",
};

function statusClass(status: OrganizerApplication["status"]): string {
	if (status === "accepted") return "text-emerald-600 dark:text-emerald-400";
	if (status === "rejected") return "text-destructive";
	return "text-muted-foreground";
}

export default function ApplicationsView() {
	const { applications, loading, error, refetch } = useModerationQueue();
	const [tab, setTab] = useState<TabKey>("pending");
	const [selected, setSelected] = useState<OrganizerApplication | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);

	const filtered = useMemo(
		() => applications.filter((a) => a.status === tab),
		[applications, tab],
	);

	function openReview(app: OrganizerApplication) {
		setSelected(app);
		setSheetOpen(true);
	}

	return (
		<section className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">
					Заявки компаний
				</h1>
				<p className="text-sm text-muted-foreground">
					Проверка реквизитов и решение по заявкам организаторов.
				</p>
			</div>

			<Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
				<TabsList>
					{(Object.keys(TAB_LABEL) as TabKey[]).map((key) => (
						<TabsTrigger key={key} value={key}>
							{TAB_LABEL[key]}
						</TabsTrigger>
					))}
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
				<p className="py-12 text-center text-sm text-muted-foreground">
					{tab === "pending"
						? "Новых заявок нет."
						: tab === "accepted"
							? "Одобренных заявок ещё нет."
							: "Отклонённых заявок ещё нет."}
				</p>
			) : (
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Компания</TableHead>
								<TableHead>ИНН</TableHead>
								<TableHead>ОГРН</TableHead>
								<TableHead>Дата подачи</TableHead>
								<TableHead>Статус</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((app) => (
								<TableRow key={app.id}>
									<TableCell className="font-medium">
										{app.company_data?.name ?? "—"}
									</TableCell>
									<TableCell className="font-mono text-xs">
										{app.company_data?.inn ?? "—"}
									</TableCell>
									<TableCell className="font-mono text-xs">
										{app.company_data?.ogrn ?? "—"}
									</TableCell>
									<TableCell className="text-xs text-muted-foreground">
										{new Date(app.created_at).toLocaleDateString("ru-RU")}
									</TableCell>
									<TableCell>
										<span className={`text-sm ${statusClass(app.status)}`}>
											{STATUS_TEXT[app.status as TabKey]}
										</span>
									</TableCell>
									<TableCell className="text-right">
										<Button variant="outline" size="sm" onClick={() => openReview(app)}>
											{app.status === "pending" ? "Рассмотреть" : "Открыть"}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			<ApplicationReviewSheet
				application={selected}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onResolved={refetch}
			/>
		</section>
	);
}
