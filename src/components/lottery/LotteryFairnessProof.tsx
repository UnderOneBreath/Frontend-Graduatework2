import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RANDOMIZER_REGISTRY } from "@/api/types/randomizer.types";
import type { RandomizerResult } from "@/api/types/randomizer.types";

interface LotteryFairnessProofProps {
	result: RandomizerResult | null;
}

export function LotteryFairnessProof({ result }: LotteryFairnessProofProps) {
	if (!result) return null;
	const meta = RANDOMIZER_REGISTRY[result.provider];
	return (
		<div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
			<div className="flex items-center gap-2 flex-wrap">
				<h3 className="text-base font-semibold">Пруф розыгрыша</h3>
				<Badge variant="secondary">{meta.name}</Badge>
			</div>
			<p className="text-sm text-muted-foreground">
				Победители определены {new Date(result.requestedAt).toLocaleString()} через сервис {meta.name}. Серийники победителей:{" "}
				<span className="font-mono">{result.winningSerials.join(", ")}</span>
			</p>
			{result.verifyUrl && (
				<a
					href={result.verifyUrl}
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center gap-1 text-sm text-primary hover:underline w-fit"
				>
					Проверить у провайдера
					<ExternalLink className="size-3.5" />
				</a>
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
