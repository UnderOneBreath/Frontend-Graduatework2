import { useCallback, useEffect, useState } from "react";
import { getCompanies } from "@/api/services/organizer";
import type { CompanyResponse } from "@/api/types/company.types";
import { getCurrentUserId } from "@/api/utils/jwt";

interface UseUserCompaniesResult {
	companies: CompanyResponse[];
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useUserCompanies(): UseUserCompaniesResult {
	const [companies, setCompanies] = useState<CompanyResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [tick, setTick] = useState(0);

	const refetch = useCallback(() => setTick((t) => t + 1), []);

	useEffect(() => {
		const userId = getCurrentUserId();
		if (!userId) {
			setCompanies([]);
			setLoading(false);
			return;
		}
		let cancelled = false;
		setLoading(true);
		setError(null);
		getCompanies()
			.then((list) => {
				if (cancelled) return;
				// TODO: вернуть фильтр по employees, когда бэк будет отдавать
				// связи из таблицы orguserslink в поле CompanyResponse.employees.
				setCompanies(list);
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				console.error("[useUserCompanies] getCompanies failed:", err);
				setError("Не удалось загрузить компании");
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [tick]);

	return { companies, loading, error, refetch };
}
