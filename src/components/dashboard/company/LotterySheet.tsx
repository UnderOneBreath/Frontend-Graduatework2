import { useState } from "react";
import { ImageIcon, Plus, Trash2 } from "lucide-react";
import { createLottery, updateLottery } from "@/api/services/lottery";
import type {
	LotteryCreateRequest,
	LotteryResponse,
	LotteryStatus,
	LotteryUpdateRequest,
	PrizeInput,
} from "@/api/types/lottery.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

type Mode = { kind: "create"; orgId: string } | { kind: "edit"; lottery: LotteryResponse };

interface LotterySheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: Mode;
	onSaved: () => void;
}

interface FormState {
	name: string;
	start_date: string;
	end_date: string;
	max_entries: number;
	status: LotteryStatus;
	prizes: PrizeInput[];
}

const EMPTY_PRIZE: PrizeInput = { name: "", description: "", img_path: "", price: 0 };

function initialForm(mode: Mode): FormState {
	if (mode.kind === "edit") {
		return {
			name: mode.lottery.name,
			start_date: mode.lottery.start_date,
			end_date: mode.lottery.end_date,
			max_entries: mode.lottery.max_entries,
			status: mode.lottery.status,
			prizes: [],
		};
	}
	return {
		name: "",
		start_date: "",
		end_date: "",
		max_entries: 100,
		status: "active" as LotteryStatus,
		prizes: [],
	};
}

export default function LotterySheet({ open, onOpenChange, mode, onSaved }: LotterySheetProps) {
	const [form, setForm] = useState<FormState>(() => initialForm(mode));
	const [newPrize, setNewPrize] = useState<PrizeInput>(EMPTY_PRIZE);
	const [showPrizeForm, setShowPrizeForm] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const dateError =
		form.start_date && form.end_date && form.end_date <= form.start_date
			? "Дата окончания должна быть позже даты начала"
			: null;

	const canSubmit =
		form.name.trim() !== "" &&
		form.start_date !== "" &&
		form.end_date !== "" &&
		form.max_entries >= 1 &&
		!dateError &&
		!saving;

	function reset() {
		setForm(initialForm(mode));
		setNewPrize(EMPTY_PRIZE);
		setShowPrizeForm(false);
		setError(null);
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) reset();
		onOpenChange(nextOpen);
	}

	function addPrize() {
		if (!newPrize.name.trim()) return;
		setForm((p) => ({ ...p, prizes: [...p.prizes, { ...newPrize }] }));
		setNewPrize(EMPTY_PRIZE);
		setShowPrizeForm(false);
	}

	function removePrize(idx: number) {
		setForm((p) => ({ ...p, prizes: p.prizes.filter((_, i) => i !== idx) }));
	}

	async function submit() {
		setSaving(true);
		setError(null);
		try {
			if (mode.kind === "create") {
				const body: LotteryCreateRequest = {
					name: form.name.trim(),
					start_date: form.start_date,
					end_date: form.end_date,
					max_entries: form.max_entries,
					org_id: mode.orgId,
					prizes: form.prizes,
				};
				await createLottery(body);
			} else {
				const body: LotteryUpdateRequest = {
					name: form.name.trim(),
					start_date: form.start_date,
					end_date: form.end_date,
					max_entries: form.max_entries,
					status: form.status,
				};
				await updateLottery(mode.lottery.id, body);
			}
			onSaved();
			handleOpenChange(false);
		} catch (err: unknown) {
			console.error("[LotterySheet] save failed:", err);
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
				(err instanceof Error ? err.message : "Не удалось сохранить");
			setError(msg);
		} finally {
			setSaving(false);
		}
	}

	const isEdit = mode.kind === "edit";

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent className="flex w-full flex-col gap-0 sm:max-w-lg">
				<SheetHeader className="border-b">
					<SheetTitle>{isEdit ? "Редактирование розыгрыша" : "Новый розыгрыш"}</SheetTitle>
					<SheetDescription>
						{isEdit
							? "Изменение основных параметров розыгрыша."
							: "Заполните основные параметры и добавьте призы."}
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto p-4">
					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="lottery-name">Название</Label>
							<Input
								id="lottery-name"
								placeholder="Например: Летний розыгрыш 2026"
								value={form.name}
								onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
							/>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="lottery-start">Начало</Label>
								<Input
									id="lottery-start"
									type="datetime-local"
									value={form.start_date}
									onChange={(e) =>
										setForm((p) => ({ ...p, start_date: e.target.value }))
									}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="lottery-end">Окончание</Label>
								<Input
									id="lottery-end"
									type="datetime-local"
									value={form.end_date}
									min={form.start_date || undefined}
									onChange={(e) =>
										setForm((p) => ({ ...p, end_date: e.target.value }))
									}
								/>
							</div>
						</div>
						{dateError ? <p className="text-xs text-destructive">{dateError}</p> : null}

						<div className="flex flex-col gap-1.5">
							<Label htmlFor="lottery-max">Максимум участников</Label>
							<Input
								id="lottery-max"
								type="number"
								min={1}
								value={form.max_entries}
								onChange={(e) =>
									setForm((p) => ({
										...p,
										max_entries: Math.max(1, Number(e.target.value) || 1),
									}))
								}
							/>
						</div>

						{isEdit ? (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="lottery-status">Статус</Label>
								<select
									id="lottery-status"
									value={form.status}
									onChange={(e) =>
										setForm((p) => ({
											...p,
											status: e.target.value as LotteryStatus,
										}))
									}
									className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
								>
									<option value="active">Активна</option>
									<option value="completed">Завершена</option>
								</select>
							</div>
						) : null}

						{!isEdit ? (
							<div className="flex flex-col gap-2">
								<Label>Призы</Label>
								{form.prizes.length > 0 ? (
									<div className="flex flex-col gap-2">
										{form.prizes.map((prize, i) => (
											<Card key={i} className="gap-0 py-2">
												<CardContent className="flex items-center gap-3 px-3">
													{prize.img_path ? (
														<img
															src={prize.img_path}
															alt={prize.name}
															className="size-10 shrink-0 rounded object-cover"
														/>
													) : (
														<div className="flex size-10 shrink-0 items-center justify-center rounded bg-muted">
															<ImageIcon className="size-5 text-muted-foreground" />
														</div>
													)}
													<div className="min-w-0 flex-1">
														<p className="truncate text-sm font-medium">{prize.name}</p>
														<p className="text-xs text-muted-foreground">
															{prize.price} ₽
														</p>
													</div>
													<Button
														type="button"
														variant="ghost"
														size="icon-sm"
														onClick={() => removePrize(i)}
														aria-label="Удалить приз"
													>
														<Trash2 />
													</Button>
												</CardContent>
											</Card>
										))}
									</div>
								) : null}

								{showPrizeForm ? (
									<Card>
										<CardContent className="flex flex-col gap-3 px-4">
											<div className="flex flex-col gap-1.5">
												<Label htmlFor="prize-name">Название приза</Label>
												<Input
													id="prize-name"
													placeholder="Например: AirPods Pro"
													value={newPrize.name}
													onChange={(e) =>
														setNewPrize((p) => ({ ...p, name: e.target.value }))
													}
												/>
											</div>
											<div className="flex flex-col gap-1.5">
												<Label htmlFor="prize-desc">Описание</Label>
												<Input
													id="prize-desc"
													placeholder="Краткое описание"
													value={newPrize.description}
													onChange={(e) =>
														setNewPrize((p) => ({
															...p,
															description: e.target.value,
														}))
													}
												/>
											</div>
											<div className="flex flex-col gap-1.5">
												<Label htmlFor="prize-price">Цена (₽)</Label>
												<Input
													id="prize-price"
													type="number"
													min={0}
													value={newPrize.price}
													onChange={(e) =>
														setNewPrize((p) => ({
															...p,
															price: Number(e.target.value) || 0,
														}))
													}
												/>
											</div>
											<div className="flex justify-end gap-2">
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => {
														setShowPrizeForm(false);
														setNewPrize(EMPTY_PRIZE);
													}}
												>
													Отмена
												</Button>
												<Button
													type="button"
													size="sm"
													disabled={!newPrize.name.trim()}
													onClick={addPrize}
												>
													Добавить
												</Button>
											</div>
										</CardContent>
									</Card>
								) : (
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setShowPrizeForm(true)}
									>
										<Plus />
										Добавить приз
									</Button>
								)}
							</div>
						) : null}

						{error ? <p className="text-sm text-destructive">{error}</p> : null}
					</div>
				</div>

				<SheetFooter className="border-t">
					<div className="flex w-full justify-end gap-2">
						<Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
							Отмена
						</Button>
						<Button onClick={submit} disabled={!canSubmit}>
							{saving ? "..." : isEdit ? "Сохранить" : "Создать"}
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
