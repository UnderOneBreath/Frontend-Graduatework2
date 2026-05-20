import { refreshToken } from "@/api/services/auth/refresh";
import {
	clearTokenInfo,
	decodeAccessToken,
	getCurrentUserId,
	isTokenExpired,
	persistTokenInfo,
} from "@/api/utils/jwt";

const REFRESH_LEEWAY_MS = 60_000;

let timerId: ReturnType<typeof setTimeout> | null = null;
let currentExpMs: number | null = null;
let visibilityListenerAttached = false;

function clearTimer(): void {
	if (timerId !== null) {
		clearTimeout(timerId);
		timerId = null;
	}
}

function ensureVisibilityListener(): void {
	if (visibilityListenerAttached || typeof document === "undefined") return;
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState !== "visible") return;
		if (currentExpMs === null) return;
		if (currentExpMs - Date.now() <= REFRESH_LEEWAY_MS) {
			void refreshNow();
		}
	});
	visibilityListenerAttached = true;
}

async function refreshNow(): Promise<void> {
	clearTimer();
	try {
		const { token } = await refreshToken();
		persistTokenInfo(token);
		scheduleRefreshFromToken(token);
	} catch {
		cancelRefresh();
		clearTokenInfo();
		localStorage.removeItem("userEmail");
		if (typeof window !== "undefined" && window.location.pathname !== "/login") {
			window.location.assign("/login");
		}
	}
}

export function scheduleRefreshFromToken(accessToken: string): void {
	const { exp } = decodeAccessToken(accessToken);
	if (!exp) return;
	clearTimer();
	currentExpMs = exp * 1000;
	const delay = currentExpMs - Date.now() - REFRESH_LEEWAY_MS;
	if (delay <= 0) {
		void refreshNow();
	} else {
		timerId = setTimeout(() => void refreshNow(), delay);
	}
	ensureVisibilityListener();
}

export function cancelRefresh(): void {
	clearTimer();
	currentExpMs = null;
}

export async function bootstrapRefresh(): Promise<void> {
	if (typeof localStorage === "undefined") return;
	if (!getCurrentUserId()) return;

	// Проверяем, истёк ли токен ДО попытки обновить
	if (!isTokenExpired()) {
		// Токен ещё валидный, просто запланируем обновление перед истечением
		const token = localStorage.getItem("accessToken");
		if (token) scheduleRefreshFromToken(decodeAccessToken(token).sub);
		return;
	}
	
	// Токен истёк — пытаемся обновить
	await refreshNow();
}
