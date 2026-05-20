import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/api/utils/jwt";

export function useRequireAuth(redirectTo = "/login"): boolean {
	const navigate = useNavigate();
	const [authed] = useState(isAuthenticated);

	useEffect(() => {
		if (!authed) {
			navigate(redirectTo, { replace: true });
		}
	}, [authed, navigate, redirectTo]);

	return authed;
}
