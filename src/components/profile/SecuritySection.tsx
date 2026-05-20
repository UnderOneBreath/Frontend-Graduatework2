import { Button } from "@/components/ui/button";
import ProfileSection from "./ProfileSection";

export default function SecuritySection() {
	return (
		<ProfileSection
			title="Безопасность"
			description="Пароль и параметры входа."
			action={
				<Button variant="outline" disabled title="Скоро">
					Сменить пароль
				</Button>
			}
		>
			<p className="text-sm text-muted-foreground">
				Смена пароля будет доступна после подключения соответствующего сервиса.
			</p>
		</ProfileSection>
	);
}
