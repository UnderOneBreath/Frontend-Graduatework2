import { useNavigate } from "react-router-dom";
import { useUserCompanies } from "@/hooks/useUserCompanies";
import { Button } from "@/components/ui/button";
import ProfileSection from "./ProfileSection";

export default function OrganizerPromo() {
	const navigate = useNavigate();
	const { companies, loading } = useUserCompanies();

	if (loading) {
		return (
			<ProfileSection title="Бизнес-пространство">
				<p className="text-sm text-muted-foreground">Проверка статуса...</p>
			</ProfileSection>
		);
	}

	if (companies.length > 0) {
		const first = companies[0];
		const label =
			companies.length === 1
				? first.name
				: `${first.name} и ещё ${companies.length - 1}`;
		return (
			<ProfileSection
				title="Бизнес-пространство"
				description="Управление компаниями и розыгрышами."
				action={
					<Button variant="outline" onClick={() => navigate("/organizer")}>
						Открыть панель
					</Button>
				}
			>
				<p className="text-sm text-foreground">{label}</p>
			</ProfileSection>
		);
	}

	return (
		<ProfileSection
			title="Бизнес-пространство"
			description="Для проведения собственных розыгрышей требуется зарегистрировать компанию."
			action={
				<Button variant="outline" onClick={() => navigate("/organizer/apply")}>
					Стать организатором
				</Button>
			}
		>
			<p className="text-sm text-muted-foreground">
				У вас пока нет компании. Подайте заявку — она пройдёт модерацию.
			</p>
		</ProfileSection>
	);
}
