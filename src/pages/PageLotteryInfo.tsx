import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLotteryDetail } from "@/hooks/useLotteryDetail";
import { useUserCompanies } from "@/hooks/useUserCompanies";
import { getCurrentRole, getCurrentUserId, isAuthenticated } from "@/api/utils/jwt";
import { UserRole } from "@/api/types/user.types";
import { updateLottery, setTicketWinner } from "@/api/services/lottery";
import { drawWinners } from "@/api/services/randomizer";
import { LotteryStatus, TicketStatus } from "@/api/types/lottery.types";
import { RandomizerProvider } from "@/api/types/randomizer.types";
import type { RandomizerResult } from "@/api/types/randomizer.types";
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
import { LotteryFairnessProof } from "@/components/lottery/LotteryFairnessProof";

function loadProofFromStorage(lotteryId: string | undefined): RandomizerResult | null {
	if (!lotteryId) return null;
	try {
		const raw = sessionStorage.getItem(`lotteryProof_${lotteryId}`);
		return raw ? (JSON.parse(raw) as RandomizerResult) : null;
	} catch {
		return null;
	}
}

export default function PageLotteryInfo() {
	const { id } = useParams<{ id: string }>();
	const detail = useLotteryDetail(id);
	const { companies } = useUserCompanies();

	const authed = isAuthenticated();
	const userId = getCurrentUserId();
	const role = getCurrentRole();
	const isOwner = useMemo(
		() =>
			role === UserRole.organizer &&
			!!detail.lottery &&
			companies.some((c) => c.id === detail.lottery!.org_id),
		[role, detail.lottery, companies],
	);

	const prizesById = useMemo(
		() => Object.fromEntries(detail.prizes.map((p) => [p.id, p])),
		[detail.prizes],
	);

	const [publishing, setPublishing] = useState(false);
	const [publishError, setPublishError] = useState<string | null>(null);
	const [drawing, setDrawing] = useState(false);
	const [drawError, setDrawError] = useState<string | null>(null);
	const [proof, setProof] = useState<RandomizerResult | null>(() => loadProofFromStorage(id));

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
	const canDraw =
		isOwner &&
		lottery.status === LotteryStatus.Active &&
		new Date(lottery.end_date) <= new Date() &&
		winners.length === 0;

	const effectiveProof = lottery.randomizer_result ?? proof;

	async function handleDraw() {
		if (drawing) return;
		setDrawing(true);
		setDrawError(null);
		try {
			const paid = tickets.filter((t) => t.status === TicketStatus.Paid);
			if (paid.length < prizes.length) {
				throw new Error(
					`Недостаточно оплаченных участников: ${paid.length} из ${prizes.length}`,
				);
			}
			const provider = lottery.randomizer_type ?? RandomizerProvider.RandomOrg;
			const result = await drawWinners(provider, prizes.length, paid.length);

			for (let i = 0; i < prizes.length; i++) {
				const ticket = paid[result.winningSerials[i] - 1];
				await setTicketWinner(ticket.id, prizes[i].id);
			}

			await updateLottery(lottery.id, { status: LotteryStatus.Completed });
			sessionStorage.setItem(`lotteryProof_${lottery.id}`, JSON.stringify(result));
			setProof(result);
			refetch();
		} catch (err: unknown) {
			console.error("[handleDraw] failed:", err);
			const msg = err instanceof Error ? err.message : String(err);
			setDrawError(msg);
		} finally {
			setDrawing(false);
		}
	}

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

			{canDraw && (
				<div
					role="status"
					aria-live="polite"
					className="rounded-lg border border-primary/50 bg-primary/5 p-4 flex flex-col gap-3 sm:flex-row sm:items-center"
				>
					<div className="flex-1">
						<p className="font-medium text-foreground">Время определить победителей</p>
						<p className="text-sm text-muted-foreground">
							Срок розыгрыша истёк. Запустите выбор победителей через внешний рандомайзер — результат будет публично проверяемым.
						</p>
						{drawError && (
							<p className="text-sm text-destructive mt-2">Ошибка: {drawError}</p>
						)}
					</div>
					<Button onClick={handleDraw} disabled={drawing} className="shrink-0">
						{drawing ? "Проводим..." : "Провести розыгрыш"}
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
						organizer={organizer}
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

			{effectiveProof && (
				<>
					<Separator />
					<section id="fairness" className="flex flex-col gap-4 animate-in fade-in duration-500">
						<SectionHeading
							title="Проверка честности"
							description="Как был определён победитель"
						/>
						<LotteryFairnessProof result={effectiveProof} />
					</section>
				</>
			)}

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
