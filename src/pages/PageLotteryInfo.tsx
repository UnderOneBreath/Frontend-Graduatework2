import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLotteryDetail } from "@/hooks/useLotteryDetail";
import { useUserCompanies } from "@/hooks/useUserCompanies";
import { getCurrentUserId, isAuthenticated } from "@/api/utils/jwt";
import { updateLottery } from "@/api/services/lottery";
import { LotteryStatus } from "@/api/types/lottery.types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LotteryBreadcrumbs } from "@/components/lottery/LotteryBreadcrumbs";
import { LotteryHero } from "@/components/lottery/LotteryHero";
import { LotteryMetaStats } from "@/components/lottery/LotteryMetaStats";
import { LotteryPrizeGrid } from "@/components/lottery/LotteryPrizeGrid";
import { LotteryOrganizerCard } from "@/components/lottery/LotteryOrganizerCard";
import { LotteryWinnersList } from "@/components/lottery/LotteryWinnersList";
import { LotterySimilarSection } from "@/components/lottery/LotterySimilarSection";
import { LotteryShareButton } from "@/components/lottery/LotteryShareButton";
import { LotteryPrimaryCTA } from "@/components/lottery/LotteryPrimaryCTA";
import { LotteryDetailSkeleton } from "@/components/lottery/LotteryDetailSkeleton";

export default function PageLotteryInfo() {
	const { id } = useParams<{ id: string }>();
	const detail = useLotteryDetail(id);
	const { companies } = useUserCompanies();

	const authed = isAuthenticated();
	const userId = getCurrentUserId();
	const isOwner = useMemo(
		() => !!detail.lottery && companies.some((c) => c.id === detail.lottery!.org_id),
		[detail.lottery, companies],
	);

	const prizesById = useMemo(
		() => Object.fromEntries(detail.prizes.map((p) => [p.id, p])),
		[detail.prizes],
	);

	const [publishing, setPublishing] = useState(false);
	const [publishError, setPublishError] = useState<string | null>(null);

	if (detail.isLoading) {
		return <LotteryDetailSkeleton />;
	}

	if (detail.notFound || !detail.lottery) {
		return (
			<div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center gap-4 text-center">
				<h1 className="text-2xl font-semibold text-foreground">Розыгрыш не найден</h1>
				<p className="text-sm text-muted-foreground">
					Возможно, он был удалён или ссылка указана с ошибкой.
				</p>
				<Button asChild>
					<Link to="/lotteries">К списку розыгрышей</Link>
				</Button>
			</div>
		);
	}

	if (detail.error) {
		return (
			<div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center gap-4 text-center">
				<p className="text-destructive">{detail.error}</p>
				<Button variant="outline" onClick={detail.refetch}>
					Повторить
				</Button>
			</div>
		);
	}

	const { lottery, prizes, tickets, winners, organizer, paidCount, refetch } = detail;

	const isDraft = lottery.status !== "active" && lottery.status !== "completed";

	async function handlePublish() {
		if (publishing) return;
		setPublishing(true);
		setPublishError(null);
		try {
			await updateLottery(lottery.id, { status: LotteryStatus.Active });
			refetch();
		} catch (err: unknown) {
			console.error("[publishLottery] failed:", err);
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
				(err instanceof Error ? err.message : String(err));
			setPublishError(msg);
		} finally {
			setPublishing(false);
		}
	}

	return (
		<div className="max-w-5xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
			<LotteryBreadcrumbs name={lottery.name} />

			{isOwner && isDraft && (
				<div
					role="status"
					aria-live="polite"
					className="rounded-lg border border-amber-500/50 bg-amber-500/10 dark:bg-amber-500/15 p-4 flex flex-col gap-3 sm:flex-row sm:items-center"
				>
					<div className="flex-1">
						<p className="font-medium text-foreground">Этот розыгрыш — черновик</p>
						<p className="text-sm text-muted-foreground">
							Он скрыт от других пользователей и не отображается в общем списке. Опубликуйте его, чтобы участники могли присоединиться.
						</p>
						{publishError && (
							<p className="text-sm text-destructive mt-2">Не удалось опубликовать: {publishError}</p>
						)}
					</div>
					<Button onClick={handlePublish} disabled={publishing} className="shrink-0">
						{publishing ? "Публикуем..." : "Опубликовать розыгрыш"}
					</Button>
				</div>
			)}

			<LotteryHero lottery={lottery} prizes={prizes} organizer={organizer}>
				<div className="flex flex-wrap items-center gap-3">
					<LotteryPrimaryCTA
						lottery={lottery}
						tickets={tickets}
						paidCount={paidCount}
						isAuthenticated={authed}
						userId={userId}
						isOwner={isOwner}
						onParticipated={refetch}
					/>
					<LotteryShareButton />
				</div>
			</LotteryHero>

			<LotteryMetaStats
				lottery={lottery}
				prizeCount={prizes.length}
				paidCount={paidCount}
			/>

			<section id="prizes" className="flex flex-col gap-4 animate-in fade-in duration-500">
				<SectionHeading title="Призы" description="Что разыгрывается в этом розыгрыше" />
				<LotteryPrizeGrid prizes={prizes} />
			</section>

			<Separator />

			<section id="organizer" className="flex flex-col gap-4 animate-in fade-in duration-500">
				<SectionHeading title="Организатор" description="Юридическое лицо, проводящее розыгрыш" />
				<LotteryOrganizerCard organizer={organizer} />
			</section>

			<Separator />

			<section id="winners" className="flex flex-col gap-4 animate-in fade-in duration-500">
				<SectionHeading
					title="Победители"
					description={
						winners.length > 0
							? `Всего победителей: ${winners.length}`
							: "Список будет опубликован после розыгрыша"
					}
				/>
				<LotteryWinnersList
					winners={winners}
					prizesById={prizesById}
					status={lottery.status}
				/>
			</section>

			<Separator />

			{false && (
				<section id="similar" className="flex flex-col gap-4 animate-in fade-in duration-500">
					<SectionHeading
						title="Другие розыгрыши организатора"
						description="Похожие активности от того же бренда"
					/>
					<LotterySimilarSection orgId={lottery.org_id} currentId={lottery.id} />
				</section>
			)}

			<div className="flex justify-center pt-4">
				<LotteryShareButton />
			</div>
		</div>
	);
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
	return (
		<div className="flex flex-col gap-1">
			<h2 className="text-xl font-semibold text-foreground">{title}</h2>
			{description && <p className="text-sm text-muted-foreground">{description}</p>}
		</div>
	);
}
