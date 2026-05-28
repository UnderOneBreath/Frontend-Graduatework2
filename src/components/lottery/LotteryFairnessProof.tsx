import { useState } from "react";
import { Check, Copy, ExternalLink, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RANDOMIZER_REGISTRY } from "@/api/types/randomizer.types";
import type { RandomizerResult } from "@/api/types/randomizer.types";
import { sha256Hex } from "@/lib/hash";

interface LotteryFairnessProofProps {
	result: RandomizerResult | null;
}

export function LotteryFairnessProof({ result }: LotteryFairnessProofProps) {
	const [copied, setCopied] = useState(false);
	const [recomputed, setRecomputed] = useState<string | null>(null);

	if (!result) return null;
	const meta = RANDOMIZER_REGISTRY[result.provider];

	const signed = result.signedRandom;
	const snapshot = result.participantsSnapshot ?? [];
	const winnerIndexSet = new Set(result.winningSerials);
	const claimedHash = signed?.userData?.participantsHash ?? null;
	const hashMatches = recomputed !== null && claimedHash !== null && recomputed === claimedHash;

	async function copyVerifyBundle() {
		if (!signed || !result?.signature) return;
		const bundle = JSON.stringify({ random: signed, signature: result.signature }, null, 2);
		await navigator.clipboard.writeText(bundle);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	async function recomputeHash() {
		const serials = snapshot.map((e) => e.serial);
		const hash = await sha256Hex(JSON.stringify(serials));
		setRecomputed(hash);
	}

	return (
		<div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-4">
			<div className="flex items-center gap-2 flex-wrap">
				<h3 className="text-base font-semibold">Пруф розыгрыша</h3>
				<Badge variant="secondary">{meta.name}</Badge>
				{signed && <Badge variant="outline">подпись RSA-SHA512</Badge>}
			</div>

			<p className="text-sm text-muted-foreground">
				Победители определены{" "}
				{new Date(signed?.completionTime ?? result.requestedAt).toLocaleString()}{" "}
				через сервис {meta.name}. Выпавшие индексы:{" "}
				<span className="font-mono">{result.winningSerials.join(", ")}</span>.
			</p>

			{signed && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
					<KV label="Serial № запроса" value={String(signed.serialNumber)} mono />
					<KV
						label="Хэш списка участников"
						value={signed.userData.participantsHash}
						mono
						truncate
					/>
					<KV label="lotteryId в подписи" value={signed.userData.lotteryId} mono truncate />
					<KV
						label="Подпись"
						value={result.signature ?? ""}
						mono
						truncate
					/>
				</div>
			)}

			{signed && result.verifyUrl && (
				<div className="flex flex-wrap gap-2">
					<Button size="sm" variant="outline" onClick={copyVerifyBundle}>
						{copied ? (
							<>
								<Check className="size-3.5" /> Скопировано
							</>
						) : (
							<>
								<Copy className="size-3.5" /> Скопировать пакет проверки
							</>
						)}
					</Button>
					<Button size="sm" variant="outline" asChild>
						<a href={result.verifyUrl} target="_blank" rel="noreferrer">
							Открыть форму Random.org <ExternalLink className="size-3.5" />
						</a>
					</Button>
				</div>
			)}

			{snapshot.length > 0 && (
				<>
					<Separator />
					<div className="flex items-center justify-between gap-2 flex-wrap">
						<h4 className="text-sm font-semibold">
							Список участников на момент розыгрыша ({snapshot.length})
						</h4>
						{claimedHash && (
							<Button size="sm" variant="ghost" onClick={recomputeHash}>
								Пересчитать хэш списка
							</Button>
						)}
					</div>

					{recomputed !== null && (
						<div
							className={
								"rounded-md px-3 py-2 text-xs " +
								(hashMatches
									? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
									: "bg-destructive/10 text-destructive")
							}
						>
							{hashMatches
								? "Совпадает с хэшем в подписи Random.org — список не подменён."
								: "Не совпадает с хэшем в подписи — список был изменён после розыгрыша."}
							<div className="font-mono break-all opacity-80 mt-1">{recomputed}</div>
						</div>
					)}

					<div className="overflow-x-auto">
						<table className="w-full text-xs">
							<thead className="text-muted-foreground text-left">
								<tr>
									<th className="font-medium py-1 pr-3">#</th>
									<th className="font-medium py-1 pr-3">Серийный номер</th>
									<th className="font-medium py-1 pr-3">Билет</th>
									<th className="font-medium py-1">Победитель</th>
								</tr>
							</thead>
							<tbody>
								{snapshot.map((e) => {
									const isWinner = winnerIndexSet.has(e.index);
									return (
										<tr
											key={e.ticketId}
											className={isWinner ? "bg-primary/5" : undefined}
										>
											<td className="py-1 pr-3 font-mono text-muted-foreground">{e.index}</td>
											<td className="py-1 pr-3 font-mono">{e.serial}</td>
											<td className="py-1 pr-3 font-mono text-muted-foreground truncate max-w-[200px]">
												{e.ticketId}
											</td>
											<td className="py-1">
												{isWinner && (
													<span className="inline-flex items-center gap-1 text-primary">
														<Trophy className="size-3.5" /> да
													</span>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</>
			)}

			<Separator />
			<details className="text-xs">
				<summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">
					Сырой ответ API
				</summary>
				<pre className="mt-2 p-3 rounded bg-muted overflow-x-auto text-[11px] leading-relaxed">
					{JSON.stringify(result.rawResponse, null, 2)}
				</pre>
			</details>
		</div>
	);
}

function KV({
	label,
	value,
	mono,
	truncate,
}: {
	label: string;
	value: string;
	mono?: boolean;
	truncate?: boolean;
}) {
	return (
		<div className="flex flex-col gap-0.5 min-w-0">
			<span className="text-muted-foreground uppercase tracking-wide text-[10px]">{label}</span>
			<span
				className={
					(mono ? "font-mono " : "") +
					(truncate ? "truncate" : "break-all") +
					" text-foreground"
				}
				title={value}
			>
				{value}
			</span>
		</div>
	);
}
