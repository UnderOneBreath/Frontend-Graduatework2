import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentRole, isAuthenticated } from "@/api/utils/jwt";
import type { UserRole } from "@/api/types/user.types";

export function useRequireRole(allowed: UserRole[]): boolean {
	const navigate = useNavigate();
	const [granted] = useState<boolean>(() => {
		if (!isAuthenticated()) return false;
		const role = getCurrentRole();
		return role !== null && allowed.includes(role);
	});

	useEffect(() => {
		if (granted) return;
		if (!isAuthenticated()) {
			navigate("/login", { replace: true });
			return;
		}
		navigate("/dashboard/overview", { replace: true });
	}, [granted, navigate]);

	return granted;
}
