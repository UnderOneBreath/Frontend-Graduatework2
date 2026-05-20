import { Separator } from "@/components/ui/separator";
import NotificationsList from "@/components/profile/NotificationsList";
import { useDashboard } from "@/context/DashboardContext";

export default function NotificationsView() {
	const { user, loadingUser } = useDashboard();

	if (loadingUser && !user) {
		return <p className="text-sm text-muted-foreground">Загрузка…</p>;
	}

	if (!user) {
		return <p className="text-sm text-destructive">Не удалось загрузить пользователя.</p>;
	}

	return (
		<section className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h2 className="text-2xl text-foreground">Уведомления</h2>
				<p className="text-sm text-muted-foreground">
					Сообщения от организаторов и результаты розыгрышей.
				</p>
			</div>
			<Separator />
			<NotificationsList userId={user.id} />
		</section>
	);
}
