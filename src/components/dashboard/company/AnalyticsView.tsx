import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRequireRole } from "@/hooks/useRequireRole";
import { UserRole } from "@/api/types/user.types";

export default function AnalyticsView() {
	const allowed = useRequireRole([UserRole.organizer, UserRole.admin]);
	if (!allowed) return null;
	return (
		<section className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">Аналитика</h1>
				<p className="text-sm text-muted-foreground">
					Метрики розыгрышей и вовлечённости.
				</p>
			</div>
			<Card>
				<CardContent className="flex flex-col items-center gap-3 py-16 text-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						<BarChart3 className="size-6 text-muted-foreground" />
					</div>
					<p className="text-sm font-medium">Скоро здесь будет аналитика</p>
					<p className="text-sm text-muted-foreground">
						Откройте раздел позже, чтобы увидеть продажу билетов, охват и конверсию по
						розыгрышам.
					</p>
				</CardContent>
			</Card>
		</section>
	);
}
