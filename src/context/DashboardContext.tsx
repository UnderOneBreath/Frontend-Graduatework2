import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/api/services/auth";
import type { CompanyResponse } from "@/api/types/company.types";
import type { UserResponse } from "@/api/types/user.types";
import { useUserCompanies } from "@/hooks/useUserCompanies";
import { getCurrentUserId } from "@/api/utils/jwt";

type ActiveContext = { kind: "personal" } | { kind: "company"; company: CompanyResponse };

interface DashboardContextValue {
	active: ActiveContext;
	setPersonal: () => void;
	setCompany: (companyId: string) => void;
	companies: CompanyResponse[];
	loadingCompanies: boolean;
	companiesError: string | null;
	refetchCompanies: () => void;
	user: UserResponse | null;
	loadingUser: boolean;
	setUser: (user: UserResponse) => void;
}

const PERSONAL = "personal";

function storageKey(userId: string): string {
	return `dashboard.activeContext.${userId}`;
}

function readInitialPersisted(): string {
	if (typeof window === "undefined") return PERSONAL;
	const userId = getCurrentUserId();
	if (!userId) return PERSONAL;
	try {
		return window.localStorage.getItem(storageKey(userId)) ?? PERSONAL;
	} catch {
		return PERSONAL;
	}
}

function persist(value: string) {
	if (typeof window === "undefined") return;
	const userId = getCurrentUserId();
	if (!userId) return;
	try {
		window.localStorage.setItem(storageKey(userId), value);
	} catch {
		// localStorage может быть заблокирован; выбор не будет сохранен в этом сеансе
	}
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
	const { companies, loading: loadingCompanies, error: companiesError, refetch: refetchCompanies } =
		useUserCompanies();
	const [user, setUser] = useState<UserResponse | null>(null);
	const [loadingUser, setLoadingUser] = useState(true);
	const [persisted, setPersisted] = useState<string>(readInitialPersisted);

	useEffect(() => {
		let cancelled = false;
		getCurrentUser()
			.then((u) => {
				if (!cancelled) setUser(u);
			})
			.catch((err: unknown) => {
				console.error("[DashboardContext] getCurrentUser failed:", err);
			})
			.finally(() => {
				if (!cancelled) setLoadingUser(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const active = useMemo<ActiveContext>(() => {
		if (persisted === PERSONAL) return { kind: "personal" };
		const match = companies.find((c) => c.id === persisted);
		if (match) return { kind: "company", company: match };
		return { kind: "personal" };
	}, [persisted, companies]);

	const setPersonal = useCallback(() => {
		setPersisted(PERSONAL);
		persist(PERSONAL);
	}, []);

	const setCompany = useCallback((companyId: string) => {
		setPersisted(companyId);
		persist(companyId);
	}, []);

	const setUserExternal = useCallback((next: UserResponse) => setUser(next), []);

	const value = useMemo<DashboardContextValue>(
		() => ({
			active,
			setPersonal,
			setCompany,
			companies,
			loadingCompanies,
			companiesError,
			refetchCompanies,
			user,
			loadingUser,
			setUser: setUserExternal,
		}),
		[
			active,
			setPersonal,
			setCompany,
			companies,
			loadingCompanies,
			companiesError,
			refetchCompanies,
			user,
			loadingUser,
			setUserExternal,
		]
	);

	return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDashboard(): DashboardContextValue {
	const ctx = useContext(DashboardContext);
	if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
	return ctx;
}
