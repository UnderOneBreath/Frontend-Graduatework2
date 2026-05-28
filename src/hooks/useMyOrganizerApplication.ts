import { useCallback, useEffect, useRef, useState } from "react";
import { getMyApplications } from "@/api/services/moderation";
import { getCurrentUserId } from "@/api/utils/jwt";
import type { OrganizerApplication } from "@/api/types/moderation.types";

const POLL_INTERVAL_MS = 30_000;

interface UseMyOrganizerApplicationResult {
	application: OrganizerApplication | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useMyOrganizerApplication(): UseMyOrganizerApplicationResult {
	const [application, setApplication] = useState<OrganizerApplication | null>(null);
	const [loading, setLoading] = useState<boolean>(() => getCurrentUserId() !== null);
	const [error, setError] = useState<string | null>(null);
	const [tick, setTick] = useState(0);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const refetch = useCallback(() => setTick((t) => t + 1), []);

	useEffect(() => {
		const userId = getCurrentUserId();
		if (!userId) return;

		let cancelled = false;

		getMyApplications(userId)
			.then((items) => {
				if (cancelled) return;
				const latest = items.length > 0 ? items[0] : null;
				setApplication(latest);
				setLoading(false);
				setError(null);
				if (latest?.status === "pending") {
					timerRef.current = setTimeout(() => setTick((t) => t + 1), POLL_INTERVAL_MS);
				}
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				const msg = err instanceof Error ? err.message : "Не удалось загрузить заявку";
				setError(msg);
				setLoading(false);
			});

		return () => {
			cancelled = true;
			if (timerRef.current !== null) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [tick]);

	return { application, loading, error, refetch };
}
