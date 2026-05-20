import { useCallback, useEffect, useState } from "react";
import { getLotteries } from "@/api/services/lottery";
import type { LotteryResponse } from "@/api/types/lottery.types";

type State =
	| { kind: "loading" }
	| { kind: "ready"; lotteries: LotteryResponse[] }
	| { kind: "error"; error: string };

interface UseCompanyLotteriesResult {
	lotteries: LotteryResponse[];
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useCompanyLotteries(orgId: string | null | undefined): UseCompanyLotteriesResult {
	const [state, setState] = useState<State>({ kind: "loading" });
	const [tick, setTick] = useState(0);

	const refetch = useCallback(() => setTick((t) => t + 1), []);

	useEffect(() => {
		if (!orgId) return;
		let cancelled = false;
		getLotteries()
			.then((all) => {
				if (cancelled) return;
				const filtered = all.filter((l) => l.org_id === orgId);
				setState({ kind: "ready", lotteries: filtered });
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				console.error("[useCompanyLotteries] getLotteries failed:", err);
				const msg = err instanceof Error ? err.message : "Не удалось загрузить розыгрыши";
				setState({ kind: "error", error: msg });
			});
		return () => {
			cancelled = true;
		};
	}, [orgId, tick]);

	if (!orgId) {
		return { lotteries: [], loading: false, error: null, refetch };
	}

	if (state.kind === "loading") {
		return { lotteries: [], loading: true, error: null, refetch };
	}
	if (state.kind === "error") {
		return { lotteries: [], loading: false, error: state.error, refetch };
	}
	return { lotteries: state.lotteries, loading: false, error: null, refetch };
}
