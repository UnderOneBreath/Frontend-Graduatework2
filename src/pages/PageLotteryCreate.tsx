import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ImageIcon, Trash2 } from "lucide-react";
import {
	Button,
	Card,
	CardContent,
	ImageUpload,
	Input,
	Label,
	Separator,
} from "@/components/ui";
import type { LotteryCreateRequest, PrizeInput } from "@/api/types/lottery.types";
import type { CompanyResponse } from "@/api/types/company.types";
import { RandomizerProvider, RANDOMIZER_REGISTRY } from "@/api/types/randomizer.types";
import { createLottery, bulkCreateTickets } from "@/api/services/lottery";
import { getCompanies } from "@/api/services/organizer";
import { getCurrentUserId, getCurrentRole, isAuthenticated } from "@/api/utils/jwt";
import { UserRole } from "@/api/types/user.types";

const emptyPrize: PrizeInput = { name: "", description: "", img_path: "", price: 0 };

function datePart(dt: string) {
	return dt.split("T")[0] ?? "";
}
function timePart(dt: string) {
	return dt.split("T")[1] ?? "";
}
function joinDatetime(date: string, time: string) {
	if (!date) return "";
	return `${date}T${time || "00:00"}`;
}
function formatPreview(dt: string) {
	if (!dt) return "—";
	const [date, time] = dt.split("T");
	return `${date} ${time ?? ""}`.trim();
}

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
				lang="ru-RU"
				value={timePart(value)}
				onChange={(e) => onChange(joinDatetime(datePart(value), e.target.value))}
				className="w-28 cursor-pointer"
			/>
		</div>
	);
}

export default function PageLotteryCreate() {
	const navigate = useNavigate();
	const [allowed] = useState<boolean>(() => {
		if (!isAuthenticated()) return false;
		return getCurrentRole() === UserRole.organizer;
	});

	useEffect(() => {
		if (allowed) return;
		if (!isAuthenticated()) {
			navigate("/login", { replace: true });
			return;
		}
		navigate("/organizer/apply", { replace: true });
	}, [allowed, navigate]);

	const [form, setForm] = useState<LotteryCreateRequest>({
		name: "",
		start_date: "",
		end_date: "",
		max_entries: 100,
		org_id: "",
		prizes: [{ ...emptyPrize }],
		randomizer_type: RandomizerProvider.RandomOrg,
	});
	const [organizers, setOrganizers] = useState<CompanyResponse[]>([]);
	const [ticketPrice, setTicketPrice] = useState<number>(100);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!allowed) return;
		const userId = getCurrentUserId();
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
			.catch(() => {});
	}, [allowed]);

	if (!allowed) return null;

	function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: name === "max_entries" ? Number(value) : value,
		}));
	}

	function updatePrize(index: number, patch: Partial<PrizeInput>) {
		setForm((prev) => ({
			...prev,
			prizes: prev.prizes.map((p, i) => (i === index ? { ...p, ...patch } : p)),
		}));
	}

	function addPrize() {
		setForm((prev) => ({ ...prev, prizes: [...prev.prizes, { ...emptyPrize }] }));
	}

	function removePrize(index: number) {
		setForm((prev) => ({
			...prev,
			prizes:
				prev.prizes.length <= 1
					? prev.prizes
					: prev.prizes.filter((_, i) => i !== index),
		}));
	}

	const dateError =
		form.start_date && form.end_date && form.end_date <= form.start_date
			? "Дата окончания должна быть позже даты начала"
			: null;

	const prizesValid = form.prizes.every((p) => p.name.trim() !== "");

	const canSubmit =
		form.name.trim() !== "" &&
		form.org_id !== "" &&
		form.start_date !== "" &&
		form.end_date !== "" &&
		form.max_entries >= 1 &&
		ticketPrice >= 0 &&
		!dateError &&
		prizesValid &&
		!isLoading;

	async function handleSubmit() {
		if (!canSubmit) return;
		setIsLoading(true);
		setError(null);
		try {
			const created = await createLottery(form);
			try {
				await bulkCreateTickets({
					lottery_id: created.id,
					price: ticketPrice,
					number: form.max_entries,
				});
			} catch (ticketErr) {
				console.error("[bulkCreateTickets] failed:", ticketErr);
				setError("Лотерея создана, но билеты не сгенерированы. Свяжитесь с поддержкой.");
			}
			navigate(`/lotteries/${created.id}`);
		} catch (err: unknown) {
			console.error("[createLottery] failed:", err);
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
				(err instanceof Error ? err.message : String(err));
			setError(`Ошибка: ${msg}`);
			setIsLoading(false);
		}
	}

	const selectedOrgName =
		organizers.find((o) => o.id === form.org_id)?.name ?? form.org_id;
	const randomizerName = form.randomizer_type
		? RANDOMIZER_REGISTRY[form.randomizer_type].name
		: "—";

	return (
		<div className="max-w-2xl mx-auto px-4 py-8">
			<div className="flex items-center gap-4 mb-8">
				<Button variant="ghost" onClick={() => navigate("/lotteries")}>
					← Назад
				</Button>
				<h1 className="text-2xl font-bold">Создать розыгрыш</h1>
			</div>

			<div className="flex flex-col gap-8">
				{/* Основное */}
				<section className="flex flex-col gap-5">
					<h2 className="text-lg font-semibold">Основное</h2>

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

					{organizers.length > 1 && (
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="org_id">Организатор</Label>
							<select
								id="org_id"
								value={form.org_id}
								onChange={(e) => setForm((p) => ({ ...p, org_id: e.target.value }))}
								className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
							>
								<option value="">Выберите организатора</option>
								{organizers.map((o) => (
									<option key={o.id} value={o.id}>
										{o.name}
									</option>
								))}
							</select>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
							{dateError && <p className="text-xs text-destructive">{dateError}</p>}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="max_entries">Макс. участников</Label>
							<Input
								id="max_entries"
								name="max_entries"
								type="number"
								min={1}
								value={form.max_entries}
								onChange={handleFormChange}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="ticket_price">Цена билета (₽)</Label>
							<Input
								id="ticket_price"
								type="number"
								min={0}
								value={ticketPrice}
								onChange={(e) => setTicketPrice(Number(e.target.value))}
							/>
						</div>
					</div>
				</section>

				{/* Призы */}
				<section className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">Призы</h2>
						<Button type="button" variant="outline" size="sm" onClick={addPrize}>
							+ Добавить ещё
						</Button>
					</div>

					<div className="flex flex-col gap-3">
						{form.prizes.map((prize, i) => (
							<Card key={i}>
								<CardContent className="py-4 flex flex-col gap-3">
									<div className="flex items-center justify-between">
										<p className="text-xs uppercase tracking-wide text-muted-foreground">
											Приз {i + 1}
										</p>
										{form.prizes.length > 1 && (
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removePrize(i)}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										)}
									</div>

									<ImageUpload
										value={prize.img_path ?? ""}
										onChange={(v) => updatePrize(i, { img_path: v })}
										onClear={() => updatePrize(i, { img_path: "" })}
										height="sm"
									/>

									<div className="flex flex-col gap-1.5">
										<Label htmlFor={`prize-name-${i}`}>Название</Label>
										<Input
											id={`prize-name-${i}`}
											placeholder="Например: AirPods Pro"
											value={prize.name}
											onChange={(e) => updatePrize(i, { name: e.target.value })}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-3">
										<div className="flex flex-col gap-1.5">
											<Label htmlFor={`prize-desc-${i}`}>Описание</Label>
											<Input
												id={`prize-desc-${i}`}
												placeholder="Краткое описание"
												value={prize.description}
												onChange={(e) => updatePrize(i, { description: e.target.value })}
											/>
										</div>
										<div className="flex flex-col gap-1.5">
											<Label htmlFor={`prize-price-${i}`}>Цена (₽)</Label>
											<Input
												id={`prize-price-${i}`}
												type="number"
												min={0}
												value={prize.price}
												onChange={(e) =>
													updatePrize(i, { price: Number(e.target.value) })
												}
											/>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
					{!prizesValid && (
						<p className="text-xs text-destructive">
							У каждого приза должно быть название
						</p>
					)}
				</section>

				{/* Доп. настройки */}
				<details className="group rounded-xl border border-border">
					<summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between text-sm font-medium select-none">
						<span>Дополнительные настройки</span>
						<ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
					</summary>
					<div className="px-4 pb-4 pt-1 flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label>Рандомайзер</Label>
							<p className="text-xs text-muted-foreground">
								Внешний сервис, который определит победителей. По умолчанию — random.org.
							</p>
							<div className="flex flex-col gap-2">
								{Object.values(RANDOMIZER_REGISTRY).map((meta) => {
									const isSelected = form.randomizer_type === meta.id;
									const disabled = !meta.supported;
									return (
										<button
											key={meta.id}
											type="button"
											disabled={disabled}
											onClick={() =>
												setForm((p) => ({ ...p, randomizer_type: meta.id }))
											}
											className={`text-left rounded-lg border-2 px-3 py-2 transition-colors ${
												isSelected
													? "border-primary bg-primary/5"
													: "border-border hover:border-primary/60"
											} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
										>
											<div className="flex items-center justify-between gap-2">
												<span className="font-medium text-sm">{meta.name}</span>
												{!meta.supported && (
													<span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
														Скоро
													</span>
												)}
											</div>
											<p className="text-xs text-muted-foreground mt-0.5">
												{meta.description}
											</p>
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</details>

				{/* Summary */}
				<Card>
					<CardContent className="py-4 flex flex-col gap-3 text-sm">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">
							Перед публикацией
						</p>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<p className="text-xs text-muted-foreground">Название</p>
								<p className="font-medium">{form.name || "—"}</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Организатор</p>
								<p className="font-medium">{selectedOrgName || "—"}</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Старт</p>
								<p>{formatPreview(form.start_date)}</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Финиш</p>
								<p>{formatPreview(form.end_date)}</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Билетов</p>
								<p>
									{form.max_entries} × {ticketPrice} ₽
								</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Рандомайзер</p>
								<p>{randomizerName}</p>
							</div>
						</div>
						<Separator />
						<div>
							<p className="text-xs text-muted-foreground mb-2">
								Призы ({form.prizes.length})
							</p>
							<div className="flex flex-col gap-1.5">
								{form.prizes.map((prize, i) => (
									<div key={i} className="flex items-center gap-2">
										{prize.img_path ? (
											<img
												src={prize.img_path}
												alt={prize.name}
												className="w-6 h-6 rounded object-cover shrink-0"
											/>
										) : (
											<div className="w-6 h-6 rounded bg-muted flex items-center justify-center shrink-0">
												<ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
											</div>
										)}
										<span className="flex-1 truncate">{prize.name || "Без названия"}</span>
										<span className="text-muted-foreground">{prize.price} ₽</span>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{error && <p className="text-sm text-destructive">{error}</p>}

				<div className="flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={() => navigate("/lotteries")}
						disabled={isLoading}
					>
						Отмена
					</Button>
					<Button type="button" onClick={handleSubmit} disabled={!canSubmit}>
						{isLoading ? "Создаём…" : "Создать"}
					</Button>
				</div>
			</div>
		</div>
	);
}
