import { useEffect, useState, type ChangeEvent } from "react";
import { updateCompany } from "@/api/services/organizer";
import type { CompanyResponse, CompanyUpdateRequest } from "@/api/types/company.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "@/context/DashboardContext";
import { useRequireRole } from "@/hooks/useRequireRole";
import { UserRole } from "@/api/types/user.types";

interface DraftState {
	name: string;
	inn: string;
	ogrn: string;
	phone: string;
	address: string;
	email: string;
}

function toDraft(c: CompanyResponse): DraftState {
	return {
		name: c.name,
		inn: String(c.inn ?? ""),
		ogrn: String(c.ogrn ?? ""),
		phone: c.phone,
		address: c.address,
		email: c.email,
	};
}

export default function SettingsView() {
	const allowed = useRequireRole([UserRole.organizer, UserRole.admin]);
	const { active, refetchCompanies } = useDashboard();
	const company = active.kind === "company" ? active.company : null;
	const [draft, setDraft] = useState<DraftState | null>(() => (company ? toDraft(company) : null));
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [savedAt, setSavedAt] = useState<number | null>(null);

	useEffect(() => {
		if (company) setDraft(toDraft(company));
	}, [company?.id, company]);

	if (!allowed) return null;

	if (!company || !draft) {
		return (
			<p className="text-sm text-muted-foreground">
				Выберите компанию в переключателе, чтобы открыть настройки.
			</p>
		);
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setDraft((p) => (p ? { ...p, [name]: value } : p));
	}

	const innValid = /^\d{10,12}$/.test(draft.inn);
	const ogrnValid = /^\d{13,15}$/.test(draft.ogrn);
	const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email);
	const dirty =
		draft.name !== company.name ||
		draft.inn !== String(company.inn) ||
		draft.ogrn !== String(company.ogrn) ||
		draft.phone !== company.phone ||
		draft.address !== company.address ||
		draft.email !== company.email;
	const canSave = dirty && draft.name.trim() !== "" && innValid && ogrnValid && emailValid && !saving;

	async function save() {
		if (!company || !draft) return;
		setSaving(true);
		setError(null);
		try {
			const body: CompanyUpdateRequest = {
				name: draft.name.trim(),
				inn: Number(draft.inn),
				ogrn: Number(draft.ogrn),
				phone: draft.phone.trim(),
				address: draft.address.trim(),
				email: draft.email.trim(),
			};
			await updateCompany(company.id, body);
			refetchCompanies();
			setSavedAt(Date.now());
		} catch (err: unknown) {
			console.error("[SettingsView] updateCompany failed:", err);
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
				(err instanceof Error ? err.message : "Не удалось сохранить");
			setError(msg);
		} finally {
			setSaving(false);
		}
	}

	return (
		<section className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">Настройки</h1>
				<p className="text-sm text-muted-foreground">{company.name}</p>
			</div>

			<Tabs defaultValue="details">
				<TabsList>
					<TabsTrigger value="details">Реквизиты</TabsTrigger>
					<TabsTrigger value="members">Участники</TabsTrigger>
				</TabsList>

				<TabsContent value="details" className="mt-4">
					<Card>
						<CardContent className="flex flex-col gap-5">
							<div className="flex flex-col gap-2">
								<Label htmlFor="company-name">Наименование</Label>
								<Input
									id="company-name"
									name="name"
									value={draft.name}
									onChange={handleChange}
								/>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="flex flex-col gap-2">
									<Label htmlFor="company-inn">ИНН</Label>
									<Input
										id="company-inn"
										name="inn"
										inputMode="numeric"
										value={draft.inn}
										onChange={handleChange}
										className="font-mono tracking-tight"
									/>
									{!innValid ? (
										<p className="text-xs text-destructive">10–12 цифр</p>
									) : null}
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="company-ogrn">ОГРН</Label>
									<Input
										id="company-ogrn"
										name="ogrn"
										inputMode="numeric"
										value={draft.ogrn}
										onChange={handleChange}
										className="font-mono tracking-tight"
									/>
									{!ogrnValid ? (
										<p className="text-xs text-destructive">13–15 цифр</p>
									) : null}
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="flex flex-col gap-2">
									<Label htmlFor="company-phone">Телефон</Label>
									<Input
										id="company-phone"
										name="phone"
										value={draft.phone}
										onChange={handleChange}
									/>
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="company-email">Email</Label>
									<Input
										id="company-email"
										name="email"
										type="email"
										value={draft.email}
										onChange={handleChange}
									/>
									{!emailValid ? (
										<p className="text-xs text-destructive">Некорректный email</p>
									) : null}
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="company-address">Адрес</Label>
								<Input
									id="company-address"
									name="address"
									value={draft.address}
									onChange={handleChange}
								/>
							</div>

							{error ? <p className="text-sm text-destructive">{error}</p> : null}
							{savedAt && !dirty ? (
								<p className="text-sm text-muted-foreground">Сохранено</p>
							) : null}

							<div className="flex justify-end gap-2 border-t pt-4">
								<Button
									variant="outline"
									onClick={() => setDraft(toDraft(company))}
									disabled={!dirty || saving}
								>
									Сбросить
								</Button>
								<Button onClick={save} disabled={!canSave}>
									{saving ? "..." : "Сохранить"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="members" className="mt-4">
					<Card>
						<CardContent className="flex flex-col gap-4">
							{company.employees.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									В компании ещё нет участников.
								</p>
							) : (
								<ul className="flex flex-col gap-2">
									{company.employees.map((link) => (
										<li
											key={link.user_id}
											className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
										>
											<span className="truncate font-mono text-xs text-muted-foreground">
												{link.user_id}
											</span>
											<Badge variant="outline" className="text-[10px] uppercase">
												Member
											</Badge>
										</li>
									))}
								</ul>
							)}
							<p className="text-xs text-muted-foreground">
								Полные имена участников появятся после доработки бэкенда.
							</p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</section>
	);
}
