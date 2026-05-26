import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
import {
	Button,
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui";
import { getLotteries, getTicketsByLottery, changeTicketStatus } from "@/api/services/lottery";
import type { LotteryResponse, TicketResponse } from "@/api/types/lottery.types";
import { TicketStatus } from "@/api/types/lottery.types";

interface OrganizerBookingsTabProps {
	companyId: string;
}

interface BookingRow {
	ticket: TicketResponse;
	lottery: LotteryResponse;
}

export default function OrganizerBookingsTab({ companyId }: OrganizerBookingsTabProps) {
	const [rows, setRows] = useState<BookingRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pendingId, setPendingId] = useState<string | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const allLotteries = await getLotteries();
			const orgLotteries = allLotteries.filter((l) => l.org_id === companyId);

			const ticketsByLottery = await Promise.all(
				orgLotteries.map(async (l) => ({
					lottery: l,
					tickets: await getTicketsByLottery(l.id),
				})),
			);

			const flat: BookingRow[] = [];
			for (const { lottery, tickets } of ticketsByLottery) {
				for (const t of tickets) {
					if (t.status === TicketStatus.Booked) {
						flat.push({ ticket: t, lottery });
					}
				}
			}
			flat.sort((a, b) =>
				(b.ticket.purchase_date ?? "").localeCompare(a.ticket.purchase_date ?? ""),
			);
			setRows(flat);
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : "Не удалось загрузить бронирования");
		} finally {
			setLoading(false);
		}
	}, [companyId]);

	useEffect(() => {
		load();
	}, [load]);

	async function act(ticketId: string, status: TicketStatus) {
		if (pendingId) return;
		setPendingId(ticketId);
		try {
			await changeTicketStatus(ticketId, status);
			setRows((prev) => prev.filter((r) => r.ticket.id !== ticketId));
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : "Не удалось обновить статус");
		} finally {
			setPendingId(null);
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="size-5 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center gap-3 py-12">
				<p className="text-sm text-destructive">{error}</p>
				<Button variant="outline" size="sm" onClick={load}>
					<RefreshCw className="size-4" />
					Повторить
				</Button>
			</div>
		);
	}

	if (rows.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-sm text-muted-foreground">Нет бронирований на проверке оплаты.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					Подтвердите оплату или отмените бронь после проверки перевода.
				</p>
				<Button variant="ghost" size="sm" onClick={load}>
					<RefreshCw className="size-4" />
					Обновить
				</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Лотерея</TableHead>
						<TableHead>Билет</TableHead>
						<TableHead>Участник</TableHead>
						<TableHead>Дата брони</TableHead>
						<TableHead>Сумма</TableHead>
						<TableHead className="text-right">Действия</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map(({ ticket, lottery }) => {
						const isPending = pendingId === ticket.id;
						return (
							<TableRow key={ticket.id}>
								<TableCell>
									<Link
										to={`/lotteries/${lottery.id}`}
										className="text-primary hover:underline"
									>
										{lottery.name}
									</Link>
								</TableCell>
								<TableCell className="font-mono">#{ticket.serial_number}</TableCell>
								<TableCell className="font-mono text-xs text-muted-foreground">
									{ticket.user_id || "—"}
								</TableCell>
								<TableCell className="text-sm text-muted-foreground">
									{ticket.purchase_date
										? new Date(ticket.purchase_date).toLocaleString()
										: "—"}
								</TableCell>
								<TableCell>{ticket.price} ₽</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button
											size="sm"
											disabled={isPending}
											onClick={() => act(ticket.id, TicketStatus.Paid)}
										>
											{isPending ? <Loader2 className="size-3 animate-spin" /> : null}
											Подтвердить оплату
										</Button>
										<Button
											size="sm"
											variant="outline"
											disabled={isPending}
											onClick={() => act(ticket.id, TicketStatus.Vacant)}
										>
											Отменить
										</Button>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
