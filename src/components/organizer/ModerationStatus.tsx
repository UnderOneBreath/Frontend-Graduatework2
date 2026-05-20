import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ModerationStatus() {
	const navigate = useNavigate();
	return (
		<Card className="shadow-none">
			<CardContent className="flex flex-col gap-4 py-8 items-center text-center">
				<p className="text-xs uppercase tracking-wide text-muted-foreground">
					Статус заявки
				</p>
				<h2 className="text-xl text-foreground">На модерации</h2>
				<p className="text-sm text-muted-foreground max-w-sm">
					Заявка отправлена. После проверки данных компания появится в панели
					организатора.
				</p>
				<Button variant="outline" onClick={() => navigate("/profile")}>
					Вернуться в профиль
				</Button>
			</CardContent>
		</Card>
	);
}
