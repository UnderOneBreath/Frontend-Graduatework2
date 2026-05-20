import { Separator } from "@/components/ui/separator";
import ParticipationList from "@/components/profile/ParticipationList";
import { useDashboard } from "@/context/DashboardContext";

export default function ParticipationsView() {
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
				<h2 className="text-2xl text-foreground">Мои участия</h2>
				<p className="text-sm text-muted-foreground">
					Розыгрыши, в которых вы участвуете или участвовали.
				</p>
			</div>
			<Separator />
			<ParticipationList userId={user.id} />
		</section>
	);
}
