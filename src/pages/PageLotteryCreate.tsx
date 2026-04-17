import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Label, Card, CardContent, Separator } from "@/components/ui/";
import type { LotteryCreateRequest, PrizeInput } from "@/api/types/lottery.types";
import type { CompanyResponse } from "@/api/types/company.types";
import { createLottery } from "@/api/services/lottery";
import { getCompanies } from "@/api/services/organizer";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { UploadCloud, X, ImageIcon } from "lucide-react";

// ─── helpers ───────────────────────────────────────────────────────────────

const STEPS = ["Основное", "Призы", "Подтверждение"] as const;
const emptyPrize: PrizeInput = { name: "", description: "", img_path: "", price: 0 };

function datePart(dt: string) { return dt.split("T")[0] ?? ""; }
function timePart(dt: string) { return dt.split("T")[1] ?? ""; }
function joinDatetime(date: string, time: string) {
	if (!date) return "";
	return `${date}T${time || "00:00"}`;
}

function formatPreview(dt: string) {
	if (!dt) return "—";
	const [date, time] = dt.split("T");
	return `${date} ${time ?? ""}`.trim();
}

// ─── ImageUpload component ──────────────────────────────────────────────────

interface ImageUploadProps {
	value: string;
	onChange: (base64: string) => void;
	onClear: () => void;
}

function ImageUpload({ value, onChange, onClear }: ImageUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragOver, setDragOver] = useState(false);

	function processFile(file: File) {
		if (!file.type.startsWith("image/")) return;
		const reader = new FileReader();
		reader.onload = (e) => onChange(e.target?.result as string);
		reader.readAsDataURL(file);
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setDragOver(false);
		const file = e.dataTransfer.files[0];
		if (file) processFile(file);
	}

	if (value) {
		return (
			<div className="relative rounded-xl overflow-hidden border border-border h-40 bg-muted">
				<img src={value} alt="Превью" className="w-full h-full object-cover" />
				<button
					type="button"
					onClick={onClear}
					className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full p-1 transition-colors"
				>
					<X className="w-4 h-4" />
				</button>
			</div>
		);
	}

	return (
		<div
			className={`border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
				dragOver
					? "border-primary bg-primary/5"
					: "border-border hover:border-primary/60 hover:bg-muted/50"
			}`}
			onClick={() => inputRef.current?.click()}
			onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
			onDragLeave={() => setDragOver(false)}
			onDrop={handleDrop}
		>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
			/>
			<UploadCloud className={`w-8 h-8 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
			<p className="text-sm text-muted-foreground text-center px-4">
				<span className="text-primary font-medium">Нажмите для загрузки</span> или перетащите файл
			</p>
			<p className="text-xs text-muted-foreground">PNG, JPG, WebP до 5 МБ</p>
		</div>
	);
}

// ─── DateTimeInput component ────────────────────────────────────────────────

interface DateTimeInputProps {
	id: string;
	value: string;
	onChange: (value: string) => void;
	min?: string;
}

function DateTimeInput({ id, value, onChange, min }: DateTimeInputProps) {
	return (
		<div className="grid grid-cols-[1fr_auto] gap-2">
			<Input
				id={`${id}-date`}
				type="date"
				value={datePart(value)}
				min={min ? datePart(min) : undefined}
				onChange={(e) => onChange(joinDatetime(e.target.value, timePart(value)))}
				className="cursor-pointer"
			/>
			<Input
				id={`${id}-time`}
				type="time"
				value={timePart(value)}
				onChange={(e) => onChange(joinDatetime(datePart(value), e.target.value))}
				className="w-28 cursor-pointer"
			/>
		</div>
	);
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function PageLotteryCreate() {
	const navigate = useNavigate();
	const isAuthenticated = useRequireAuth();

	const [step, setStep] = useState(1);
	const [form, setForm] = useState<LotteryCreateRequest>({
		name: "",
		start_date: "",
		end_date: "",
		max_entries: 100,
		org_id: "",
		prizes: [],
	});
	const [organizers, setOrganizers] = useState<CompanyResponse[]>([]);
	const [editOrg, setEditOrg] = useState(false);
	const [newPrize, setNewPrize] = useState<PrizeInput>(emptyPrize);
	const [showPrizeForm, setShowPrizeForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isAuthenticated) return;
		const userId = localStorage.getItem("userId");
		getCompanies()
			.then((list) => {
				const mine = userId
					? list.filter((o) => o.employees?.some((e) => e.user_id === userId))
					: [];
				setOrganizers(mine);
				setForm((prev) =>
					prev.org_id || mine.length === 0 ? prev : { ...prev, org_id: mine[0].id },
				);
			})
			.catch(() => {}); // список опциональный, ошибка не критична
	}, [isAuthenticated]);

	if (!isAuthenticated) return null;

	// ── validation ───────────────────────────────────────────────

	const step1Valid =
		form.name.trim() !== "" &&
		form.org_id !== "" &&
		form.start_date !== "" &&
		form.end_date !== "" &&
		form.max_entries >= 1 &&
		(form.end_date > form.start_date);

	const dateError =
		form.start_date && form.end_date && form.end_date <= form.start_date
			? "Дата окончания должна быть позже даты начала"
			: null;

	// ── handlers ─────────────────────────────────────────────────

	function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: name === "max_entries" ? Number(value) : value,
		}));
	}

	function handlePrizeChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setNewPrize((prev) => ({
			...prev,
			[name]: name === "price" ? Number(value) : value,
		}));
	}

	function addPrize() {
		if (!newPrize.name.trim()) return;
		setForm((prev) => ({ ...prev, prizes: [...prev.prizes, { ...newPrize }] }));
		setNewPrize(emptyPrize);
		setShowPrizeForm(false);
	}

	function removePrize(index: number) {
		setForm((prev) => ({
			...prev,
			prizes: prev.prizes.filter((_, i) => i !== index),
		}));
	}

	async function handleSubmit() {
		if (isLoading) return;
		setIsLoading(true);
		setError(null);
		try {
			await createLottery(form);
			navigate("/lotteries");
		} catch (err: unknown) {
			console.error("[createLottery] failed:", err);
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
				(err instanceof Error ? err.message : String(err));
			setError(`Ошибка: ${msg}`);
		} finally {
			setIsLoading(false);
		}
	}

	// ── render ───────────────────────────────────────────────────

	return (
		<div className="max-w-xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="flex items-center gap-4 mb-8">
				<Button variant="ghost" onClick={() => navigate("/lotteries")}>
					← Назад
				</Button>
				<h1 className="text-2xl font-bold">Создать розыгрыш</h1>
			</div>

			{/* Step indicator */}
			<div className="flex items-center mb-8">
				{STEPS.map((label, i) => {
					const num = i + 1;
					const isActive = step === num;
					const isDone = step > num;
					return (
						<React.Fragment key={label}>
							<div className="flex flex-col items-center gap-1">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
										isDone
											? "bg-primary border-primary text-primary-foreground"
											: isActive
											? "border-primary text-primary"
											: "border-muted-foreground text-muted-foreground"
									}`}
								>
									{isDone ? "✓" : num}
								</div>
								<span className={`text-xs ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
									{label}
								</span>
							</div>
							{i < STEPS.length - 1 && (
								<div
									className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${
										step > i + 1 ? "bg-primary" : "bg-muted"
									}`}
								/>
							)}
						</React.Fragment>
					);
				})}
			</div>

			{/* ── Step 1 — Основное ─────────────────────────────── */}
			{step === 1 && (
				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="name">Название</Label>
						<Input
							id="name"
							name="name"
							placeholder="Введите название розыгрыша"
							value={form.name}
							onChange={handleFormChange}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="org_id">Организатор</Label>
						{editOrg || !form.org_id ? (
							<select
								id="org_id"
								value={form.org_id}
								onChange={(e) => {
									setForm((p) => ({ ...p, org_id: e.target.value }));
									if (e.target.value) setEditOrg(false);
								}}
								className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
							>
								<option value="">Выберите организатора</option>
								{organizers.map((o) => (
									<option key={o.id} value={o.id}>{o.name}</option>
								))}
							</select>
						) : (
							<div className="flex items-center gap-2">
								<div className="h-9 flex-1 rounded-md border border-input bg-muted/40 px-3 flex items-center text-sm">
									{organizers.find((o) => o.id === form.org_id)?.name ?? form.org_id}
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setEditOrg(true)}
									disabled={organizers.length <= 1}
								>
									Изменить
								</Button>
							</div>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Дата и время начала</Label>
						<DateTimeInput
							id="start_date"
							value={form.start_date}
							onChange={(v) => setForm((p) => ({ ...p, start_date: v }))}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label>Дата и время окончания</Label>
						<DateTimeInput
							id="end_date"
							value={form.end_date}
							min={form.start_date}
							onChange={(v) => setForm((p) => ({ ...p, end_date: v }))}
						/>
						{dateError && (
							<p className="text-xs text-destructive">{dateError}</p>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="max_entries">Максимум участников</Label>
						<Input
							id="max_entries"
							name="max_entries"
							type="number"
							min={1}
							value={form.max_entries}
							onChange={handleFormChange}
						/>
						{form.max_entries < 1 && (
							<p className="text-xs text-destructive">Должно быть не менее 1</p>
						)}
					</div>

					<div className="flex justify-end gap-3 mt-2">
						<Button type="button" variant="outline" onClick={() => navigate("/lotteries")}>
							Отмена
						</Button>
						<Button type="button" disabled={!step1Valid} onClick={() => setStep(2)}>
							Далее →
						</Button>
					</div>
				</div>
			)}

			{/* ── Step 2 — Призы ───────────────────────────────── */}
			{step === 2 && (
				<div className="flex flex-col gap-5">
					<p className="text-sm text-muted-foreground">
						Добавьте призы розыгрыша. Этот шаг необязателен.
					</p>

					{/* Prize list */}
					{form.prizes.length > 0 && (
						<div className="flex flex-col gap-2">
							{form.prizes.map((prize, i) => (
								<Card key={i}>
									<CardContent className="py-3 flex items-center gap-3">
										{prize.img_path ? (
											<img
												src={prize.img_path}
												alt={prize.name}
												className="w-10 h-10 rounded-lg object-cover shrink-0"
											/>
										) : (
											<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
												<ImageIcon className="w-5 h-5 text-muted-foreground" />
											</div>
										)}
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate">{prize.name}</p>
											<p className="text-sm text-muted-foreground">{prize.price} ₽</p>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => removePrize(i)}
										>
											Удалить
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Inline add-prize form */}
					{showPrizeForm ? (
						<Card>
							<CardContent className="py-4 flex flex-col gap-4">
								<div className="flex flex-col gap-1.5">
									<Label>Изображение</Label>
									<ImageUpload
										value={newPrize.img_path ?? ""}
										onChange={(v) => setNewPrize((p) => ({ ...p, img_path: v }))}
										onClear={() => setNewPrize((p) => ({ ...p, img_path: "" }))}
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<Label>Название приза</Label>
									<Input
										name="name"
										placeholder="Например: AirPods Pro"
										value={newPrize.name}
										onChange={handlePrizeChange}
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<Label>Описание</Label>
									<Input
										name="description"
										placeholder="Краткое описание приза"
										value={newPrize.description}
										onChange={handlePrizeChange}
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<Label>Цена (₽)</Label>
									<Input
										name="price"
										type="number"
										min={0}
										value={newPrize.price}
										onChange={handlePrizeChange}
									/>
								</div>

								<div className="flex gap-2 justify-end">
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setShowPrizeForm(false);
											setNewPrize(emptyPrize);
										}}
									>
										Отмена
									</Button>
									<Button
										type="button"
										disabled={!newPrize.name.trim()}
										onClick={addPrize}
									>
										Добавить приз
									</Button>
								</div>
							</CardContent>
						</Card>
					) : (
						<Button
							type="button"
							variant="outline"
							onClick={() => setShowPrizeForm(true)}
						>
							+ Добавить приз
						</Button>
					)}

					<div className="flex justify-between mt-2">
						<Button type="button" variant="outline" onClick={() => setStep(1)}>
							← Назад
						</Button>
						<Button type="button" onClick={() => setStep(3)}>
							Далее →
						</Button>
					</div>
				</div>
			)}

			{/* ── Step 3 — Подтверждение ────────────────────────── */}
			{step === 3 && (
				<div className="flex flex-col gap-5">
					<Card>
						<CardContent className="py-4 flex flex-col gap-3">
							<div>
								<p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Название</p>
								<p className="font-medium">{form.name}</p>
							</div>
							<Separator />
							<div>
								<p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Организатор</p>
								<p className="font-medium">
									{organizers.find((o) => o.id === form.org_id)?.name ?? form.org_id}
								</p>
							</div>
							<Separator />
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Дата начала</p>
									<p className="text-sm">{formatPreview(form.start_date)}</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Дата окончания</p>
									<p className="text-sm">{formatPreview(form.end_date)}</p>
								</div>
							</div>
							<Separator />
							<div>
								<p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Макс. участников</p>
								<p className="text-sm">{form.max_entries}</p>
							</div>

							{form.prizes.length > 0 && (
								<>
									<Separator />
									<div>
										<p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
											Призы ({form.prizes.length})
										</p>
										<div className="flex flex-col gap-2">
											{form.prizes.map((prize, i) => (
												<div key={i} className="flex items-center gap-3">
													{prize.img_path ? (
														<img
															src={prize.img_path}
															alt={prize.name}
															className="w-8 h-8 rounded object-cover shrink-0"
														/>
													) : (
														<div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
															<ImageIcon className="w-4 h-4 text-muted-foreground" />
														</div>
													)}
													<span className="flex-1 text-sm truncate">{prize.name}</span>
													<span className="text-sm text-muted-foreground">{prize.price} ₽</span>
												</div>
											))}
										</div>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					{error && <p className="text-sm text-destructive">{error}</p>}

					<div className="flex justify-between mt-2">
						<Button type="button" variant="outline" onClick={() => setStep(2)}>
							← Назад
						</Button>
						<Button type="button" onClick={handleSubmit} disabled={isLoading}>
							{isLoading ? "Создание..." : "Создать розыгрыш"}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
