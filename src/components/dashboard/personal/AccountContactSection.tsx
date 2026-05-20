import { useState } from "react";
import { updateUser } from "@/api/services/user";
import type { UserResponse } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProfileField from "@/components/profile/ProfileField";
import ProfileSection from "@/components/profile/ProfileSection";

interface AccountContactSectionProps {
	user: UserResponse;
	onUpdated: (user: UserResponse) => void;
}

export default function AccountContactSection({ user, onUpdated }: AccountContactSectionProps) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState({ name: user.name, phone: user.phone });
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	function startEditing() {
		setDraft({ name: user.name, phone: user.phone });
		setSaveError(null);
		setEditing(true);
	}

	async function save() {
		setSaving(true);
		setSaveError(null);
		try {
			const updated = await updateUser(user.id, {
				name: draft.name.trim(),
				phone: draft.phone.trim(),
			});
			onUpdated(updated);
			setEditing(false);
		} catch (err) {
			setSaveError(err instanceof Error ? err.message : "Не удалось сохранить");
		} finally {
			setSaving(false);
		}
	}

	return (
		<ProfileSection
			title="Контактные данные"
			description="Используются для входа и уведомлений."
			action={
				editing ? (
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
							Отмена
						</Button>
						<Button onClick={save} disabled={saving}>
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
						<Label htmlFor="account-name">Имя</Label>
						<Input
							id="account-name"
							value={draft.name}
							onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
						/>
					</div>
					<ProfileField label="Email" value={user.email} />
					<div className="flex flex-col gap-2">
						<Label htmlFor="account-phone">Телефон</Label>
						<Input
							id="account-phone"
							value={draft.phone}
							onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
						/>
					</div>
					{saveError ? <p className="text-sm text-destructive">{saveError}</p> : null}
				</div>
			) : (
				<>
					<ProfileField label="Имя" value={user.name} />
					<ProfileField label="Email" value={user.email} />
					<ProfileField label="Телефон" value={user.phone} />
				</>
			)}
		</ProfileSection>
	);
}
