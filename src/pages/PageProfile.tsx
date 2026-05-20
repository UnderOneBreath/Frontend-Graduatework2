import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "@/api/services/auth";
import { updateUser } from "@/api/services/user";
import type { UserResponse } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSection from "@/components/profile/ProfileSection";
import ProfileField from "@/components/profile/ProfileField";
import OrganizerPromo from "@/components/profile/OrganizerPromo";
import SecuritySection from "@/components/profile/SecuritySection";
import TelegramSection from "@/components/profile/TelegramSection";
import ProfileSidebar, {
	type ProfileTab,
} from "@/components/profile/ProfileSidebar";
import ParticipationList from "@/components/profile/ParticipationList";
import NotificationsList from "@/components/profile/NotificationsList";
import { useUserCompanies } from "@/hooks/useUserCompanies";

const TAB_TITLES: Record<ProfileTab, string> = {
	overview: "Обзор",
	participations: "Мои участия",
	notifications: "Уведомления",
	account: "Аккаунт",
};

export default function PageProfile() {
	const navigate = useNavigate();
	const [user, setUser] = useState<UserResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [tab, setTab] = useState<ProfileTab>("overview");
	const [menuOpen, setMenuOpen] = useState(false);
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState<{ name: string; phone: string }>({ name: "", phone: "" });
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const { companies } = useUserCompanies();

	useEffect(() => {
		getCurrentUser()
			.then(setUser)
			.catch(() => setError("Сессия недействительна — войдите снова"));
	}, []);

	async function handleLogout() {
		await logout();
		navigate("/login");
	}

	function startEditing() {
		if (!user) return;
		setDraft({ name: user.name, phone: user.phone });
		setSaveError(null);
		setEditing(true);
	}

	async function saveContacts() {
		if (!user) return;
		setSaving(true);
		setSaveError(null);
		try {
			const updated = await updateUser(user.id, {
				name: draft.name.trim(),
				phone: draft.phone.trim(),
			});
			setUser(updated);
			setEditing(false);
		} catch (err) {
			setSaveError(err instanceof Error ? err.message : "Не удалось сохранить");
		} finally {
			setSaving(false);
		}
	}

	if (error) {
		return (
			<div className="flex min-h-svh w-full items-center justify-center flex-col gap-4">
				<p className="text-sm text-foreground">{error}</p>
				<Button variant="outline" onClick={() => navigate("/login")}>
					Войти
				</Button>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex min-h-svh w-full items-center justify-center">
				<p className="text-muted-foreground text-sm">Загрузка...</p>
			</div>
		);
	}

	return (
		<div className="w-full bg-background text-foreground">
			<div className="mx-auto max-w-5xl px-6 md:px-8 py-8 flex flex-col md:flex-row md:items-start gap-8">
				<ProfileSidebar
					active={tab}
					onSelect={setTab}
					open={menuOpen}
					onClose={() => setMenuOpen(false)}
					showOrganizerLink={companies.length > 0}
				/>

				<main className="flex-1 min-w-0 max-w-3xl">
					<div className="flex items-center gap-3 pb-6 md:hidden">
						<button
							type="button"
							aria-label="Открыть меню"
							onClick={() => setMenuOpen(true)}
							className="flex flex-col gap-1 p-2 -ml-2 border border-border rounded-md"
						>
							<span className="block h-px w-5 bg-foreground" />
							<span className="block h-px w-5 bg-foreground" />
							<span className="block h-px w-5 bg-foreground" />
						</button>
						<h2 className="text-sm uppercase tracking-wide text-muted-foreground">
							{TAB_TITLES[tab]}
						</h2>
					</div>

					{tab === "overview" && (
						<>
							<ProfileHeader user={user} onEdit={() => setTab("account")} />
							<Separator />
							<OrganizerPromo />
						</>
					)}

					{tab === "participations" && (
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
					)}

					{tab === "notifications" && (
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
					)}

					{tab === "account" && (
						<section className="flex flex-col">
							<div className="flex flex-col gap-1 pb-6">
								<h2 className="text-2xl text-foreground">Аккаунт</h2>
								<p className="text-sm text-muted-foreground">
									Контактные данные, безопасность и завершение сеанса.
								</p>
							</div>
							<Separator />

							<ProfileSection
								title="Контактные данные"
								description="Используются для входа и уведомлений."
								action={
									editing ? (
										<div className="flex gap-2">
											<Button
												variant="outline"
												onClick={() => setEditing(false)}
												disabled={saving}
											>
												Отмена
											</Button>
											<Button onClick={saveContacts} disabled={saving}>
												{saving ? "..." : "Сохранить"}
											</Button>
										</div>
									) : (
										<Button variant="outline" onClick={startEditing}>
											Изменить
										</Button>
									)
								}
							>
								{editing ? (
									<div className="flex flex-col gap-4">
										<div className="flex flex-col gap-2">
											<Label htmlFor="profile-name">Имя</Label>
											<Input
												id="profile-name"
												value={draft.name}
												onChange={(e) =>
													setDraft((p) => ({ ...p, name: e.target.value }))
												}
											/>
										</div>
										<ProfileField label="Email" value={user.email} />
										<div className="flex flex-col gap-2">
											<Label htmlFor="profile-phone">Телефон</Label>
											<Input
												id="profile-phone"
												value={draft.phone}
												onChange={(e) =>
													setDraft((p) => ({ ...p, phone: e.target.value }))
												}
											/>
										</div>
										{saveError && (
											<p className="text-sm text-destructive">{saveError}</p>
										)}
									</div>
								) : (
									<>
										<ProfileField label="Имя" value={user.name} />
										<ProfileField label="Email" value={user.email} />
										<ProfileField label="Телефон" value={user.phone} />
									</>
								)}
							</ProfileSection>
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
					)}
				</main>
			</div>
		</div>
	);
}
