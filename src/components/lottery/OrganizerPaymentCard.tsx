import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CompanyResponse } from "@/api/types/company.types";

interface OrganizerPaymentCardProps {
	organizer: CompanyResponse;
}

interface PaymentRow {
	label: string;
	value: string;
	mono?: boolean;
}

function buildRows(organizer: CompanyResponse): PaymentRow[] {
	const rows: PaymentRow[] = [];
	if (organizer.payment_card)
		rows.push({ label: "Номер карты", value: organizer.payment_card, mono: true });
	if (organizer.payment_account)
		rows.push({ label: "Расчётный счёт", value: organizer.payment_account, mono: true });
	if (organizer.bank_name)
		rows.push({ label: "Банк", value: organizer.bank_name });
	if (organizer.bik)
		rows.push({ label: "БИК", value: organizer.bik, mono: true });
	return rows;
}

export default function OrganizerPaymentCard({ organizer }: OrganizerPaymentCardProps) {
	const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
	const rows = buildRows(organizer);
	const hasAny = rows.length > 0 || Boolean(organizer.payment_note);

	if (!hasAny) {
		return (
			<div className="rounded-lg border border-dashed p-3">
				<p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
					Реквизиты для оплаты
				</p>
				<p className="text-sm text-muted-foreground">
					Организатор пока не указал платёжные реквизиты. Свяжитесь по контактам выше.
				</p>
			</div>
		);
	}

	async function copy(row: PaymentRow) {
		try {
			await navigator.clipboard.writeText(row.value);
			setCopiedLabel(row.label);
			setTimeout(() => setCopiedLabel((cur) => (cur === row.label ? null : cur)), 1500);
		} catch {
			/* clipboard may be unavailable — skip silently */
		}
	}

	return (
		<div className="rounded-lg border p-3 flex flex-col gap-2">
			<p className="text-xs uppercase tracking-wide text-muted-foreground">
				Реквизиты для оплаты
			</p>
			{rows.map((row) => {
				const copied = copiedLabel === row.label;
				return (
					<div
						key={row.label}
						className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-2.5 py-1.5"
					>
						<div className="min-w-0">
							<p className="text-[11px] uppercase text-muted-foreground">{row.label}</p>
							<p className={`text-sm break-all ${row.mono ? "font-mono tracking-tight" : ""}`}>
								{row.value}
							</p>
						</div>
						<button
							type="button"
							onClick={() => copy(row)}
							className="shrink-0 inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs hover:bg-accent"
							aria-label={`Скопировать ${row.label}`}
						>
							{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
							{copied ? "Скопировано" : "Копировать"}
						</button>
					</div>
				);
			})}
			{organizer.payment_note && (
				<p className="text-xs text-muted-foreground border-t pt-2 mt-1 whitespace-pre-wrap">
					{organizer.payment_note}
				</p>
			)}
		</div>
	);
}
