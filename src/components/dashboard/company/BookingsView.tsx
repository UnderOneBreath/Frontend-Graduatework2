import OrganizerBookingsTab from "@/components/organizer/OrganizerBookingsTab";
import { useDashboard } from "@/context/DashboardContext";
import { useRequireRole } from "@/hooks/useRequireRole";
import { UserRole } from "@/api/types/user.types";

export default function BookingsView() {
	const allowed = useRequireRole([UserRole.organizer, UserRole.admin]);
	const { active } = useDashboard();

	if (!allowed) return null;

	if (active.kind !== "company") {
		return (
			<p className="text-sm text-muted-foreground">
				Выберите компанию в переключателе, чтобы увидеть бронирования.
			</p>
		);
	}

	return (
		<section className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">Бронирования</h1>
				<p className="text-sm text-muted-foreground">{active.company.name}</p>
			</div>
			<OrganizerBookingsTab companyId={active.company.id} />
		</section>
	);
}
