import type { LotteryResponse } from "@/api/types/lottery.types";
import { LotteryStatus } from "@/api/types/lottery.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LotteryCardProps {
	lottery: LotteryResponse;
	companyName?: string;
	onDetails?: (id: string) => void;
}

export function LotteryCard({
	lottery,
	companyName,
	onDetails,
}: LotteryCardProps) {
	const isActive = lottery.status === LotteryStatus.Active;
	const prizes = lottery.prizes ?? [];
	const coverImage = prizes.find((p) => p.img_path)?.img_path ?? null;

	return (
		<div
			className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md"
			onClick={() => onDetails?.(lottery.id)}
		>
			{/* Картинка */}
			<div className="h-44 bg-gray-100 relative">
				{coverImage ? (
					<img
						src={coverImage}
						alt={lottery.name}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gray-200">
						<span className="text-gray-400 text-sm">Нет фото</span>
					</div>
				)}

				{/* Статус розыгрыша */}
				<div className="absolute top-3 left-3">
					<Badge
						variant={isActive ? "success" : "secondary"}
						className="shadow-sm"
					>
						{isActive ? "Активна" : "Завершена"}
					</Badge>
				</div>
			</div>

			{/* Контент */}
			<div className="p-4">
				<p className="font-semibold text-base">{lottery.name}</p>

				{companyName && (
					<p className="text-sm text-gray-500 mt-1">{companyName}</p>
				)}

				<p className="text-sm text-gray-400 mt-2">
					{isActive ? "Активна" : "Завершена"}
				</p>

				{prizes.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-3">
						{prizes.slice(0, 3).map((prize) => (
							<span
								key={prize.id}
								className="text-xs border rounded px-2 py-0.5 text-gray-600"
							>
								{prize.name}
							</span>
						))}
					</div>
				)}

				<Button
					className="mt-4 w-full"
					onClick={(e) => {
						e.stopPropagation();
						onDetails?.(lottery.id);
					}}
				>
					{isActive ? "Купить билет" : "Подробнее"}
				</Button>
			</div>
		</div>
	);
}
