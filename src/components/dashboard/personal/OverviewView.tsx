import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import ProfileHeader from "@/components/profile/ProfileHeader";
import OrganizerPromo from "@/components/profile/OrganizerPromo";
import { useDashboard } from "@/context/DashboardContext";

export default function OverviewView() {
	const { user, loadingUser } = useDashboard();
	const navigate = useNavigate();

	if (loadingUser && !user) {
		return <p className="text-sm text-muted-foreground">Загрузка…</p>;
	}

	if (!user) {
		return <p className="text-sm text-destructive">Не удалось загрузить пользователя.</p>;
	}

	return (
		<section className="flex flex-col">
			<ProfileHeader user={user} onEdit={() => navigate("/dashboard/account")} />
			<Separator />
			<OrganizerPromo />
		</section>
	);
}
