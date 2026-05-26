import { useMemo, useState } from "react";
import { Loader2, Ticket, CheckCircle2, Phone, Mail } from "lucide-react";
import {
	Button,
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetFooter,
	Separator,
	Badge,
} from "@/components/ui";
import type { LotteryResponse, TicketResponse } from "@/api/types/lottery.types";
import { TicketStatus } from "@/api/types/lottery.types";
import type { CompanyResponse } from "@/api/types/company.types";
import { buyTickets } from "@/api/services/lottery";

interface LotteryBookingFormProps {
	lottery: LotteryResponse;
	tickets: TicketResponse[];
	organizer: CompanyResponse | null;
	userId: string;
	onBooked: () => void;
	trigger: React.ReactNode;
}

type View = "select" | "paid";

export function LotteryBookingForm({
	lottery,
	tickets,
	organizer,
	userId,
	onBooked,
	trigger,
}: LotteryBookingFormProps) {
	const [open, setOpen] = useState(false);
	const [view, setView] = useState<View>("select");
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [bookedSerials, setBookedSerials] = useState<string[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const sortedTickets = useMemo(
		() => [...tickets].sort((a, b) => {
			const numA = parseInt(String(a.serial_number).split('_').pop() || '0');
			const numB = parseInt(String(b.serial_number).split('_').pop() || '0');
			return numA - numB;
		}),
		[tickets],
	);

	const totalPrice = useMemo(() => {
		return sortedTickets
			.filter((t) => selected.has(t.id))
			.reduce((sum, t) => sum + t.price, 0);
	}, [sortedTickets, selected]);

	function toggle(ticketId: string, status: TicketStatus) {
		if (status !== TicketStatus.Vacant) return;
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(ticketId)) next.delete(ticketId);
			else next.add(ticketId);
			return next;
		});
	}

	function reset() {
		setView("select");
		setSelected(new Set());
		setBookedSerials([]);
		setError(null);
	}

	async function submit() {
		if (submitting || selected.size === 0) return;
		setSubmitting(true);
		setError(null);
		try {
			const ids = Array.from(selected);
			const booked = await buyTickets(lottery.id, { ticket_ids: ids, user_id: userId });
			setBookedSerials(booked.map((t) => t.serial_number));
			setView("paid");
			onBooked();
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : "Не удалось забронировать билеты";
			setError(msg);
		} finally {
			setSubmitting(false);
		}
	}

	function handleOpenChange(next: boolean) {
		setOpen(next);
		if (!next) reset();
	}

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
				{view === "select" && (
					<>
						<SheetHeader>
							<SheetTitle>Выберите билеты</SheetTitle>
							<SheetDescription>
								{lottery.name}. Каждый билет — одна попытка выиграть приз.
							</SheetDescription>
						</SheetHeader>

						<div className="flex-1 overflow-y-auto px-4 pb-4">
							{sortedTickets.length === 0 ? (
								<p className="text-sm text-muted-foreground py-8 text-center">
									Билеты ещё не сформированы организатором
								</p>
							) : (
								<div className="grid grid-cols-3 gap-2">
									{sortedTickets.map((t) => {
										const isSelected = selected.has(t.id);
										const isVacant = t.status === TicketStatus.Vacant;
										const stateLabel =
											t.status === TicketStatus.Paid
												? "оплачен"
												: t.status === TicketStatus.Booked
													? "занят"
													: null;
										return (
											<button
												key={t.id}
												type="button"
												disabled={!isVacant}
												onClick={() => toggle(t.id, t.status)}
												className={`rounded-lg border-2 p-2 text-left transition-colors ${
													isSelected
														? "border-primary bg-primary/10"
														: "border-border hover:border-primary/60"
												} ${
													!isVacant ? "opacity-50 cursor-not-allowed bg-muted/40" : "cursor-pointer"
												}`}
											>
												<p className="text-sm font-medium">#{t.serial_number}</p>
												<p className="text-xs text-muted-foreground">
													{stateLabel ?? `${t.price} ₽`}
												</p>
											</button>
										);
									})}
								</div>
							)}
							{error && <p className="text-sm text-destructive mt-3">{error}</p>}
						</div>

						<SheetFooter className="border-t">
							<div className="flex items-center justify-between gap-3 w-full">
								<div className="text-sm">
									<p className="text-muted-foreground">Выбрано: {selected.size}</p>
									<p className="font-medium">К оплате: {totalPrice} ₽</p>
								</div>
								<Button
									type="button"
									onClick={submit}
									disabled={submitting || selected.size === 0}
								>
									{submitting ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										<Ticket className="size-4" />
									)}
									Забронировать
								</Button>
							</div>
						</SheetFooter>
					</>
				)}

				{view === "paid" && (
					<>
						<SheetHeader>
							<SheetTitle className="flex items-center gap-2">
								<CheckCircle2 className="size-5 text-primary" />
								Бронь оформлена
							</SheetTitle>
							<SheetDescription>
								Свяжитесь с организатором и переведите оплату напрямую. После
								подтверждения статус билета изменится на «оплачен» и вы попадёте в розыгрыш.
							</SheetDescription>
						</SheetHeader>

						<div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
							<div className="rounded-lg border p-3">
								<p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
									Ваши билеты
								</p>
								<div className="flex flex-wrap gap-1.5 mb-3">
									{bookedSerials.map((sn) => (
										<Badge key={sn} variant="secondary">#{sn}</Badge>
									))}
								</div>
								<Separator className="my-2" />
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">К оплате</span>
									<span className="font-medium">{totalPrice} ₽</span>
								</div>
							</div>

							{organizer && (
								<div className="rounded-lg border p-3 flex flex-col gap-2">
									<p className="text-xs text-muted-foreground uppercase tracking-wide">
										Контакты организатора
									</p>
									<p className="font-medium">{organizer.name}</p>
									{organizer.phone && (
										<a
											href={`tel:${organizer.phone}`}
											className="flex items-center gap-2 text-sm hover:underline"
										>
											<Phone className="size-3.5" />
											{organizer.phone}
										</a>
									)}
									{organizer.email && (
										<a
											href={`mailto:${organizer.email}`}
											className="flex items-center gap-2 text-sm hover:underline"
										>
											<Mail className="size-3.5" />
											{organizer.email}
										</a>
									)}
								</div>
							)}

							<p className="text-xs text-muted-foreground">
								Без подтверждения оплаты бронь будет автоматически снята через 24 часа.
							</p>
						</div>

						<SheetFooter className="border-t">
							<Button type="button" className="w-full" onClick={() => setOpen(false)}>
								Закрыть
							</Button>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
