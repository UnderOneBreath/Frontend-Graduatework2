import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useMyOrganizerApplication } from "@/hooks/useMyOrganizerApplication";
import { UserRole } from "@/api/types/user.types";
import ApplyCompanyForm from "@/components/organizer/ApplyCompanyForm";
import ModerationStatus from "@/components/organizer/ModerationStatus";
import { Button } from "@/components/ui/button";

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
		<div className="mx-auto max-w-2xl px-8 py-12">
			<div className="flex items-center gap-3 pb-8">
				<Button variant="ghost" onClick={() => navigate("/profile")}>
					← Назад
				</Button>
				<h1 className="text-2xl text-foreground">Заявка на регистрацию компании</h1>
			</div>

			{loading ? (
				<p className="text-sm text-muted-foreground">Загрузка…</p>
			) : error ? (
				<div className="flex flex-col gap-3">
					<p className="text-sm text-destructive">{error}</p>
					<Button variant="outline" onClick={refetch} className="w-fit">
						Повторить
					</Button>
				</div>
			) : showForm ? (
				<>
					<p className="text-sm text-muted-foreground pb-6">
						Заполните данные предприятия. После отправки заявка будет передана
						на модерацию.
					</p>
					<ApplyCompanyForm
						onSubmitted={() => {
							setReapplying(false);
							refetch();
						}}
					/>
				</>
			) : application ? (
				<ModerationStatus
					application={application}
					onReapply={
						application.status === "rejected" ? () => setReapplying(true) : undefined
					}
				/>
			) : null}
		</div>
	);
}
