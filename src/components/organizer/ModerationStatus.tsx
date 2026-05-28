import { useNavigate } from "react-router-dom";
import type { OrganizerApplication } from "@/api/types/moderation.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ModerationStatusProps {
	application: OrganizerApplication;
	onReapply?: () => void;
}

export default function ModerationStatus({ application, onReapply }: ModerationStatusProps) {
	const navigate = useNavigate();
	const submitted = new Date(application.created_at).toLocaleString("ru-RU");

	if (application.status === "accepted") {
		return (
			<Card className="shadow-none">
				<CardContent className="flex flex-col gap-4 py-8 items-center text-center">
					<p className="text-xs uppercase tracking-wide text-muted-foreground">
						Статус заявки
					</p>
					<h2 className="text-xl text-foreground">Заявка одобрена</h2>
					<p className="text-sm text-muted-foreground max-w-sm">
						Компания «{application.company_data.name}» одобрена. Перейдите в панель
						организатора, чтобы начать работу.
					</p>
					<Button onClick={() => navigate("/organizer")}>В панель организатора</Button>
				</CardContent>
			</Card>
		);
	}

	if (application.status === "rejected") {
		return (
			<Card className="shadow-none">
				<CardContent className="flex flex-col gap-4 py-8 items-center text-center">
					<p className="text-xs uppercase tracking-wide text-muted-foreground">
						Статус заявки
					</p>
					<h2 className="text-xl text-foreground">Заявка отклонена</h2>
					{application.rejection_reason && (
						<div className="w-full text-left rounded-md border border-border bg-muted/40 px-4 py-3">
							<p className="text-xs uppercase tracking-wide text-muted-foreground pb-1">
								Причина отклонения
							</p>
							<p className="text-sm text-foreground">{application.rejection_reason}</p>
						</div>
					)}
					<p className="text-xs text-muted-foreground">Подана: {submitted}</p>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => navigate("/profile")}>
							В профиль
						</Button>
						{onReapply && <Button onClick={onReapply}>Подать новую заявку</Button>}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="shadow-none">
			<CardContent className="flex flex-col gap-4 py-8 items-center text-center">
				<p className="text-xs uppercase tracking-wide text-muted-foreground">
					Статус заявки
				</p>
				<h2 className="text-xl text-foreground">На модерации</h2>
				<p className="text-sm text-muted-foreground max-w-sm">
					Заявка отправлена {submitted}. Страница автоматически обновится, когда
					модератор примет решение.
				</p>
				<Button variant="outline" onClick={() => navigate("/profile")}>
					Вернуться в профиль
				</Button>
			</CardContent>
		</Card>
	);
}
