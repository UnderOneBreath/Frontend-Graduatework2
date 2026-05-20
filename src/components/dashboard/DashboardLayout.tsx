import { Outlet } from "react-router-dom";
import { DashboardProvider } from "@/context/DashboardContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout() {
	const isAuthenticated = useRequireAuth();
	if (!isAuthenticated) return null;

	return (
		<DashboardProvider>
			<div className="min-h-screen bg-background text-foreground">
				<DashboardHeader />
				<div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 md:grid-cols-[260px_1fr]">
					<DashboardSidebar />
					<main className="min-w-0">
						<Outlet />
					</main>
				</div>
			</div>
		</DashboardProvider>
	);
}
