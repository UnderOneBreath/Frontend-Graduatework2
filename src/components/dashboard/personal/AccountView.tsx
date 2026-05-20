import { useNavigate } from "react-router-dom";
import { logout } from "@/api/services/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProfileSection from "@/components/profile/ProfileSection";
import SecuritySection from "@/components/profile/SecuritySection";
import TelegramSection from "@/components/profile/TelegramSection";
import AccountContactSection from "@/components/dashboard/personal/AccountContactSection";
import { useDashboard } from "@/context/DashboardContext";

export default function AccountView() {
	const { user, loadingUser, setUser } = useDashboard();
	const navigate = useNavigate();

	async function handleLogout() {
		await logout();
		navigate("/login", { replace: true });
	}

	if (loadingUser && !user) {
		return <p className="text-sm text-muted-foreground">Загрузка…</p>;
	}

	if (!user) {
		return <p className="text-sm text-destructive">Не удалось загрузить пользователя.</p>;
	}

	return (
		<section className="flex flex-col">
			<div className="flex flex-col gap-1 pb-6">
				<h2 className="text-2xl text-foreground">Аккаунт</h2>
				<p className="text-sm text-muted-foreground">
					Контактные данные, безопасность и завершение сеанса.
				</p>
			</div>
			<Separator />

			<AccountContactSection user={user} onUpdated={setUser} />
			<Separator />

			<TelegramSection userId={user.id} />
			<Separator />

			<SecuritySection />
			<Separator />

			<ProfileSection
				title="Сеанс"
				description="Завершение сеанса на этом устройстве."
				action={
					<Button variant="outline" onClick={handleLogout}>
						Выйти
					</Button>
				}
			/>
		</section>
	);
}
