import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import type { CompanyCreateRequest } from "@/api/types/company.types";
import { createCompany } from "@/api/services/organizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
	password: string;
	logo: string;
}

const empty: FormState = {
	name: "",
	inn: "",
	ogrn: "",
	phone: "",
	address: "",
	email: "",
	password: "",
	logo: "",
};

function LogoUpload({
	value,
	onChange,
	onClear,
}: {
	value: string;
	onChange: (base64: string) => void;
	onClear: () => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragOver, setDragOver] = useState(false);

	function processFile(file: File) {
		if (!file.type.startsWith("image/")) return;
		const reader = new FileReader();
		reader.onload = (e) => onChange(e.target?.result as string);
		reader.readAsDataURL(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		setDragOver(false);
		const file = e.dataTransfer.files[0];
		if (file) processFile(file);
	}

	if (value) {
		return (
			<div className="relative h-32 w-32 overflow-hidden border border-border bg-muted rounded-md">
				<img src={value} alt="Логотип" className="h-full w-full object-cover" />
				<button
					type="button"
					onClick={onClear}
					className="absolute top-1 right-1 px-2 py-0.5 text-xs bg-background border border-border rounded-md"
				>
					Удалить
				</button>
			</div>
		);
	}

	return (
		<div
			onClick={() => inputRef.current?.click()}
			onDragOver={(e) => {
				e.preventDefault();
				setDragOver(true);
			}}
			onDragLeave={() => setDragOver(false)}
			onDrop={handleDrop}
			className={`h-32 w-32 cursor-pointer border border-dashed flex items-center justify-center text-xs text-muted-foreground rounded-md ${
				dragOver ? "border-foreground bg-muted" : "border-border hover:bg-muted/50"
			}`}
		>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					const f = e.target.files?.[0];
					if (f) processFile(f);
				}}
			/>
			Загрузить логотип
		</div>
	);
}

export default function ApplyCompanyForm({ onSubmitted }: ApplyCompanyFormProps) {
	const [form, setForm] = useState<FormState>(empty);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	const valid =
		form.name.trim() !== "" &&
		/^\d{10,12}$/.test(form.inn) &&
		/^\d{13,15}$/.test(form.ogrn) &&
		form.phone.trim() !== "" &&
		form.address.trim() !== "" &&
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
		form.password.length >= 6;

	async function handleSubmit(e: { preventDefault: () => void }) {
		e.preventDefault();
		if (!valid || loading) return;
		const payload: CompanyCreateRequest = {
			name: form.name.trim(),
			inn: Number(form.inn),
			ogrn: Number(form.ogrn),
			phone: form.phone.trim(),
			address: form.address.trim(),
			email: form.email.trim(),
			password: form.password,
			...(form.logo ? { logo: form.logo } : {}),
		};
		setLoading(true);
		setError(null);
		try {
			await createCompany(payload);
			onSubmitted();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Не удалось отправить заявку");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<Label htmlFor="logo">Логотип</Label>
				<LogoUpload
					value={form.logo}
					onChange={(v) => setForm((p) => ({ ...p, logo: v }))}
					onClear={() => setForm((p) => ({ ...p, logo: "" }))}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="name">Полное наименование</Label>
				<Input
					id="name"
					name="name"
					value={form.name}
					onChange={handleChange}
					placeholder="ООО «Пример»"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="inn">ИНН</Label>
					<Input
						id="inn"
						name="inn"
						inputMode="numeric"
						value={form.inn}
						onChange={handleChange}
						placeholder="10–12 цифр"
						className="font-mono tracking-tight"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="ogrn">ОГРН</Label>
					<Input
						id="ogrn"
						name="ogrn"
						inputMode="numeric"
						value={form.ogrn}
						onChange={handleChange}
						placeholder="13–15 цифр"
						className="font-mono tracking-tight"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="phone">Телефон</Label>
					<Input
						id="phone"
						name="phone"
						value={form.phone}
						onChange={handleChange}
						placeholder="+7 ..."
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						value={form.email}
						onChange={handleChange}
						placeholder="company@example.com"
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="address">Адрес</Label>
				<Input
					id="address"
					name="address"
					value={form.address}
					onChange={handleChange}
					placeholder="Город, улица, дом"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="password">Пароль для входа от имени компании</Label>
				<Input
					id="password"
					name="password"
					type="password"
					value={form.password}
					onChange={handleChange}
					placeholder="Минимум 6 символов"
				/>
			</div>

			{error && <p className="text-sm text-foreground border border-border px-3 py-2 rounded-md">{error}</p>}

			<div className="flex gap-3 justify-end">
				<Button type="submit" disabled={!valid || loading}>
					{loading ? "Отправка..." : "Отправить на модерацию"}
				</Button>
			</div>
		</form>
	);
}
