import { useEffect, useState } from "react";
import { approveApplication, rejectApplication } from "@/api/services/moderation";
import type { OrganizerApplication } from "@/api/types/moderation.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

interface ApplicationReviewSheetProps {
	application: OrganizerApplication | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onResolved: () => void;
}

function statusLabel(status: OrganizerApplication["status"]): string {
	if (status === "pending") return "На модерации";
	if (status === "accepted") return "Одобрена";
	return "Отклонена";
}

function statusVariant(
	status: OrganizerApplication["status"],
): "default" | "secondary" | "outline" | "destructive" {
	if (status === "accepted") return "default";
	if (status === "rejected") return "destructive";
	return "outline";
}

export default function ApplicationReviewSheet({
	application,
	open,
	onOpenChange,
	onResolved,
}: ApplicationReviewSheetProps) {
	const [reason, setReason] = useState("");
	const [showRejectForm, setShowRejectForm] = useState(false);
	const [saving, setSaving] = useState<"approve" | "reject" | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setReason("");
			setShowRejectForm(false);
			setError(null);
		}
	}, [open, application?.id]);

	if (!application) return null;

	async function handleApprove() {
		if (!application) return;
		setSaving("approve");
		setError(null);
		try {
			await approveApplication(application.id);
			onResolved();
			onOpenChange(false);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Не удалось одобрить заявку");
		} finally {
			setSaving(null);
		}
	}

	async function handleReject() {
		if (!application) return;
		if (reason.trim() === "") {
			setError("Укажите причину отклонения");
			return;
		}
		setSaving("reject");
		setError(null);
		try {
			await rejectApplication(application.id, reason.trim());
			onResolved();
			onOpenChange(false);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Не удалось отклонить заявку");
		} finally {
			setSaving(null);
		}
	}

	const isResolved = application.status !== "pending";
	const company = application.company_data;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="overflow-y-auto sm:max-w-md">
				<SheetHeader>
					<div className="flex items-center justify-between gap-2 pr-8">
						<SheetTitle>Заявка на регистрацию</SheetTitle>
						<Badge variant={statusVariant(application.status)}>
							{statusLabel(application.status)}
						</Badge>
					</div>
					<SheetDescription>
						Подана {new Date(application.created_at).toLocaleString("ru-RU")}
					</SheetDescription>
				</SheetHeader>

				<div className="flex flex-col gap-4 px-4">
					<div className="flex flex-col gap-1">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">
							Наименование
						</p>
						<p className="text-sm text-foreground">{company.name}</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-1">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">ИНН</p>
							<p className="font-mono text-sm">{company.inn}</p>
						</div>
						<div className="flex flex-col gap-1">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">ОГРН</p>
							<p className="font-mono text-sm">{company.ogrn}</p>
						</div>
					</div>

					<Separator />

					<div className="flex flex-col gap-1">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
						<p className="text-sm text-foreground">{company.email}</p>
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">Телефон</p>
						<p className="text-sm text-foreground">{company.phone}</p>
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">Адрес</p>
						<p className="text-sm text-foreground">{company.address}</p>
					</div>

					{isResolved && application.rejection_reason ? (
						<>
							<Separator />
							<div className="flex flex-col gap-1">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Причина отклонения
								</p>
								<p className="text-sm text-foreground">{application.rejection_reason}</p>
							</div>
						</>
					) : null}

					{!isResolved && showRejectForm ? (
						<div className="flex flex-col gap-2">
							<Label htmlFor="reject-reason">Причина отклонения</Label>
							<textarea
								id="reject-reason"
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								rows={4}
								className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
								placeholder="Опишите, что не так с заявкой..."
							/>
						</div>
					) : null}

					{error ? <p className="text-sm text-destructive">{error}</p> : null}
				</div>

				{!isResolved && (
					<SheetFooter>
						{showRejectForm ? (
							<div className="flex w-full justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => setShowRejectForm(false)}
									disabled={saving !== null}
								>
									Отмена
								</Button>
								<Button
									variant="destructive"
									onClick={handleReject}
									disabled={saving !== null}
								>
									{saving === "reject" ? "..." : "Подтвердить отклонение"}
								</Button>
							</div>
						) : (
							<div className="flex w-full justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => setShowRejectForm(true)}
									disabled={saving !== null}
								>
									Отклонить
								</Button>
								<Button onClick={handleApprove} disabled={saving !== null}>
									{saving === "approve" ? "..." : "Одобрить"}
								</Button>
							</div>
						)}
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	);
}
