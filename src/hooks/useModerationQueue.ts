import { useCallback, useEffect, useState } from "react";
import { listApplications } from "@/api/services/moderation";
import type { OrganizerApplication } from "@/api/types/moderation.types";

type State =
	| { kind: "loading" }
	| { kind: "ready"; applications: OrganizerApplication[] }
	| { kind: "error"; error: string };

interface UseModerationQueueResult {
	applications: OrganizerApplication[];
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useModerationQueue(): UseModerationQueueResult {
	const [state, setState] = useState<State>({ kind: "loading" });
	const [tick, setTick] = useState(0);

	const refetch = useCallback(() => setTick((t) => t + 1), []);

	useEffect(() => {
		let cancelled = false;
		listApplications()
			.then((list) => {
				if (cancelled) return;
				setState({ kind: "ready", applications: list });
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				console.error("[useModerationQueue] listApplications failed:", err);
				const msg = err instanceof Error ? err.message : "Не удалось загрузить заявки";
				setState({ kind: "error", error: msg });
			});
		return () => {
			cancelled = true;
		};
	}, [tick]);

	if (state.kind === "loading") {
		return { applications: [], loading: true, error: null, refetch };
	}
	if (state.kind === "error") {
		return { applications: [], loading: false, error: state.error, refetch };
	}
	return { applications: state.applications, loading: false, error: null, refetch };
}
