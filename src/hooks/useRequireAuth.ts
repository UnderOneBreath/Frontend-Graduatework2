import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useRequireAuth(redirectTo = "/login"): boolean {
	const navigate = useNavigate();
	const [isAuthenticated] = useState(() => !!localStorage.getItem("userEmail"));

	useEffect(() => {
		if (!isAuthenticated) {
			navigate(redirectTo, { replace: true });
		}
	}, [isAuthenticated, navigate, redirectTo]);

	return isAuthenticated;
}
