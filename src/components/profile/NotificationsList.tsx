import { useEffect, useState } from "react";
import type { NotificationResponse } from "@/api/types";
import { NotificationType } from "@/api/types";
import { getNotifications } from "@/api/services/notification";
import NotificationsEmpty from "./NotificationsEmpty";

const TYPE_LABEL: Record<NotificationType, string> = {
	[NotificationType.Win]: "Победа",
	[NotificationType.EndOfLottery]: "Розыгрыш завершён",
	[NotificationType.LotteryStartsSoon]: "Скоро старт",
	[NotificationType.TicketBuyApproval]: "Покупка одобрена",
	[NotificationType.OrgRegReqApproval]: "Заявка одобрена",
	[NotificationType.TicketBuyRejection]: "Покупка отклонена",
	[NotificationType.OrgRegReqRejection]: "Заявка отклонена",
	[NotificationType.AccountBan]: "Блокировка аккаунта",
	[NotificationType.LotteryCancellation]: "Розыгрыш отменён",
	[NotificationType.PostByOrg]: "Сообщение организатора",
};

interface NotificationsListProps {
	userId: string;
}

export default function NotificationsList({ userId }: NotificationsListProps) {
	const [items, setItems] = useState<NotificationResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		getNotifications()
			.then((all) => {
				if (cancelled) return;
				const mine = all
					.filter((n) => n.receiver === userId)
					.sort((a, b) => b.created_at.localeCompare(a.created_at));
				setItems(mine);
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : "Не удалось загрузить уведомления");
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [userId]);

	if (loading) {
		return <p className="text-sm text-muted-foreground">Загрузка...</p>;
	}

	if (error) {
		return <p className="text-sm text-destructive">{error}</p>;
	}

	if (items.length === 0) {
		return <NotificationsEmpty />;
	}

	return (
		<ul className="flex flex-col gap-3">
			{items.map((n) => (
				<li key={n.id} className="border border-border rounded-md p-4 flex flex-col gap-1">
					<div className="flex items-center justify-between gap-3">
						<span className="text-xs uppercase tracking-wide text-muted-foreground">
							{TYPE_LABEL[n.type] ?? n.type}
						</span>
						<time className="text-xs text-muted-foreground">
							{new Date(n.created_at).toLocaleString("ru-RU")}
						</time>
					</div>
					<p className="text-sm text-foreground">{n.message}</p>
				</li>
			))}
		</ul>
	);
}
