import { useMemo, useState } from "react";
import type { OrganizerApplication } from "@/api/types/moderation.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModerationQueue } from "@/hooks/useModerationQueue";
import ApplicationReviewSheet from "@/components/admin/ApplicationReviewSheet";

type TabKey = "pending" | "accepted" | "rejected";

const TAB_LABEL: Record<TabKey, string> = {
	pending: "На модерации",
	accepted: "Одобренные",
	rejected: "Отклонённые",
};

function statusVariant(
	status: OrganizerApplication["status"],
): "default" | "secondary" | "outline" | "destructive" {
	if (status === "accepted") return "default";
	if (status === "rejected") return "destructive";
	return "outline";
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
				<Card>
					<CardContent className="py-12 text-center text-sm text-muted-foreground">
						{tab === "pending"
							? "Новых заявок нет."
							: tab === "accepted"
								? "Одобренных заявок ещё нет."
								: "Отклонённых заявок ещё нет."}
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{filtered.map((app) => (
						<Card key={app.id} className="gap-3">
							<CardHeader className="gap-2">
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="text-base leading-tight">
										{app.company_data.name}
									</CardTitle>
									<Badge variant={statusVariant(app.status)}>
										{TAB_LABEL[app.status as TabKey]}
									</Badge>
								</div>
								<p className="text-xs text-muted-foreground">
									Подана {new Date(app.created_at).toLocaleDateString("ru-RU")}
								</p>
							</CardHeader>
							<CardContent className="flex flex-col gap-3 text-sm">
								<div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
									<span>ИНН: <span className="font-mono text-foreground">{app.company_data.inn}</span></span>
									<span>ОГРН: <span className="font-mono text-foreground">{app.company_data.ogrn}</span></span>
								</div>
								<div className="flex justify-end">
									<Button variant="outline" size="sm" onClick={() => openReview(app)}>
										{app.status === "pending" ? "Рассмотреть" : "Открыть"}
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
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
