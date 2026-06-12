import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useMyOrganizerApplication } from "@/hooks/useMyOrganizerApplication";
import { UserRole } from "@/api/types/user.types";
import ApplyCompanyForm from "@/components/organizer/ApplyCompanyForm";
import ModerationStatus from "@/components/organizer/ModerationStatus";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";

export default function PageOrganizerApply() {
	const allowed = useRequireRole([UserRole.participant]);
	const navigate = useNavigate();
	const { application, loading, error, refetch } = useMyOrganizerApplication();
	const [reapplying, setReapplying] = useState(false);

	useEffect(() => {
		if (application?.status === "accepted") {
			navigate("/organizer", { replace: true });
		}
	}, [application, navigate]);

	if (!allowed) return null;

	const showForm =
		!application || (application.status === "rejected" && reapplying);

	return (
		<main className="min-h-[calc(100svh-3.5rem)] bg-background text-foreground">
			<div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
				{/* Навигация */}
				<Button
					variant="ghost"
					onClick={() => navigate("/profile")}
					className="mb-8 -ml-2 text-foreground hover:bg-muted/50"
				>
					<ChevronLeft className="mr-1 size-4" />
					Назад
				</Button>

				{/* Заголовок */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Заявка на регистрацию организатора
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Заполните информацию о вашей компании. После отправки заявка будет рассмотрена
						модератором в течение 1-2 рабочих дней.
					</p>
				</div>

				{/* Основной контент */}
				{loading ? (
					<div className="space-y-4">
						<div className="h-10 bg-border/50 rounded animate-pulse" />
						<div className="h-64 bg-border/50 rounded animate-pulse" />
					</div>
				) : error ? (
					<div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
						<div className="flex gap-3">
							<AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
							<div>
								<p className="text-sm font-medium text-destructive">{error}</p>
								<Button
									onClick={refetch}
									variant="outline"
									className="mt-3"
									size="sm"
								>
									Повторить
								</Button>
							</div>
						</div>
					</div>
				) : showForm ? (
					<ApplyCompanyForm
						onSubmitted={() => {
							setReapplying(false);
							refetch();
						}}
					/>
				) : application ? (
					<ModerationStatus
						application={application}
						onReapply={
							application.status === "rejected"
								? () => setReapplying(true)
								: undefined
						}
					/>
				) : null}
			</div>
		</main>
	);
}
