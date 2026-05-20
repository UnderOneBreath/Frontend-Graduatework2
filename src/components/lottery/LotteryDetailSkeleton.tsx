export function LotteryDetailSkeleton() {
	return (
		<div className="max-w-5xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6 animate-pulse">
			<div className="h-4 w-1/3 rounded bg-muted" />
			<div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-0 overflow-hidden rounded-2xl border border-border">
				<div className="aspect-[16/10] bg-muted" />
				<div className="flex flex-col gap-4 p-6">
					<div className="h-6 w-3/4 rounded bg-muted" />
					<div className="h-3 w-1/2 rounded bg-muted" />
					<div className="h-3 w-2/3 rounded bg-muted" />
					<div className="mt-auto h-10 w-40 rounded bg-muted" />
				</div>
			</div>
			<div className="h-24 rounded-xl bg-muted" />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="h-72 rounded-xl bg-muted" />
				))}
			</div>
		</div>
	);
}
