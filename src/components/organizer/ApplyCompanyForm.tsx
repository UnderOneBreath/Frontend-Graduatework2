import { useState, type ChangeEvent } from "react";
import type { ApplicationCreateRequest } from "@/api/types/moderation.types";
import { submitApplication } from "@/api/services/moderation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import LogoUpload from "@/components/organizer/LogoUpload";

interface ApplyCompanyFormProps {
	onSubmitted: () => void;
}

interface FormState {
	name: string;
	inn: string;
	ogrn: string;
	phone: string;
	address: string;
	email: string;
	logo: string;
}

const empty: FormState = {
	name: "",
	inn: "",
	ogrn: "",
	phone: "",
	address: "",
	email: "",
	logo: "",
};

export default function ApplyCompanyForm({ onSubmitted }: ApplyCompanyFormProps) {
	const [form, setForm] = useState<FormState>(empty);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isValid =
		form.name.trim().length > 0 &&
		/^\d{10,12}$/.test(form.inn) &&
		/^\d{13,15}$/.test(form.ogrn) &&
		form.phone.trim().length > 0 &&
		form.address.trim().length > 0 &&
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	async function handleSubmit(e: { preventDefault: () => void }) {
		e.preventDefault();
		if (!isValid || loading) return;

		const payload: ApplicationCreateRequest = {
			name: form.name.trim(),
			inn: Number(form.inn),
			ogrn: Number(form.ogrn),
			phone: form.phone.trim(),
			address: form.address.trim(),
			email: form.email.trim(),
			// backend requires a UUID string for logo; use uploaded value or generate a placeholder
			logo: form.logo || crypto.randomUUID(),
		};

		setLoading(true);
		setError(null);
		try {
			await submitApplication(payload);
			onSubmitted();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Не удалось отправить заявку");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Логотип */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Логотип компании</CardTitle>
					<CardDescription>
						Опциональное поле. Логотип помогает пользователям быстро узнавать вашу компанию
					</CardDescription>
				</CardHeader>
				<CardContent>
					<LogoUpload
						value={form.logo}
						onChange={(v) => setForm((p) => ({ ...p, logo: v }))}
						onClear={() => setForm((p) => ({ ...p, logo: "" }))}
					/>
				</CardContent>
			</Card>

			{/* Основная информация */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Основная информация</CardTitle>
					<CardDescription>
						Данные будут указаны как название организатора в системе
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Полное наименование компании *</Label>
						<Input
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="ООО «Компания»"
							disabled={loading}
						/>
						<p className="text-xs text-muted-foreground">
							Как указано в учредительных документах
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="inn">ИНН *</Label>
							<Input
								id="inn"
								name="inn"
								value={form.inn}
								onChange={handleChange}
								placeholder="0000000000"
								inputMode="numeric"
								disabled={loading}
							/>
							<p className="text-xs text-muted-foreground">
								10–12 цифр
							</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="ogrn">ОГРН *</Label>
							<Input
								id="ogrn"
								name="ogrn"
								value={form.ogrn}
								onChange={handleChange}
								placeholder="0000000000000"
								inputMode="numeric"
								disabled={loading}
							/>
							<p className="text-xs text-muted-foreground">
								13–15 цифр
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Контактная информация */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Контактная информация</CardTitle>
					<CardDescription>
						Модератор будет связываться с вами по этим данным
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email *</Label>
						<Input
							id="email"
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							placeholder="info@company.com"
							disabled={loading}
						/>
						<p className="text-xs text-muted-foreground">
							На этот адрес придет подтверждение заявки
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone">Телефон *</Label>
						<Input
							id="phone"
							name="phone"
							value={form.phone}
							onChange={handleChange}
							placeholder="+7 (999) 123-45-67"
							disabled={loading}
						/>
						<p className="text-xs text-muted-foreground">
							Для срочных уведомлений
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="address">Адрес *</Label>
						<Input
							id="address"
							name="address"
							value={form.address}
							onChange={handleChange}
							placeholder="г. Москва, ул. Примерная, д. 1"
							disabled={loading}
						/>
						<p className="text-xs text-muted-foreground">
							Юридический адрес компании
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Ошибка */}
			{error && (
				<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex gap-3">
					<AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
					<p className="text-sm text-destructive">{error}</p>
				</div>
			)}

			{/* Кнопка отправки */}
			<div className="flex justify-end pt-4">
				<Button
					type="submit"
					disabled={!isValid || loading}
					size="lg"
				>
					{loading ? "Отправка заявки..." : "Отправить заявку"}
				</Button>
			</div>

			{/* Дополнительная информация */}
			<Card className="bg-muted/30 border-0">
				<CardContent className="pt-6">
					<p className="text-sm text-muted-foreground">
						<span className="font-medium text-foreground">Время рассмотрения:</span> Обычно заявка рассматривается в течение 1-2 рабочих дней.
						Вам будет отправлено письмо на указанный email с результатом.
					</p>
				</CardContent>
			</Card>
		</form>
	);
}
