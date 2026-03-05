import { LotteryList } from "@/components/lottery-list";

export default function PageLotteries() {
	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold">Розыгрыши</h1>
				<p className="text-muted-foreground text-sm mt-1">
					Здесь вы можете просмотреть все текущие розыгрыши и принять участие в
					них.
				</p>
			</div>
			<LotteryList />
		</div>
	);
}
