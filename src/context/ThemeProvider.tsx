import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggle: () => void;
}

const STORAGE_KEY = "theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): Theme {
	if (typeof window === "undefined") return "light";
	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === "light" || stored === "dark") return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
	document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(readInitialTheme);

	useEffect(() => {
		applyTheme(theme);
		window.localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => setThemeState(next), []);
	const toggle = useCallback(
		() => setThemeState((prev) => (prev === "light" ? "dark" : "light")),
		[]
	);

	const value = useMemo<ThemeContextValue>(
		() => ({ theme, setTheme, toggle }),
		[theme, setTheme, toggle]
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}
