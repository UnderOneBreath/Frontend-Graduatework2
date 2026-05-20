import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LotteriesModerationView() {
	return (
		<section className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">
					Лотереи на модерации
				</h1>
				<p className="text-sm text-muted-foreground">
					Очередь розыгрышей, ожидающих проверки.
				</p>
			</div>
			<Card>
				<CardContent className="flex flex-col items-center gap-3 py-16 text-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						<Trophy className="size-6 text-muted-foreground" />
					</div>
					<p className="text-sm font-medium">В разработке</p>
					<p className="text-sm text-muted-foreground max-w-md">
						Workflow модерации лотерей пока не реализован на бэкенде. Раздел появится,
						когда у розыгрышей будет статус «на проверке».
					</p>
				</CardContent>
			</Card>
		</section>
	);
}
