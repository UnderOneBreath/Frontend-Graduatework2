import { Outlet } from "react-router-dom";
import { DashboardProvider } from "@/context/DashboardContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
	return (
		<DashboardProvider>
			<div className="min-h-screen bg-background text-foreground">
				<DashboardHeader />
				<div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 md:grid-cols-[260px_1fr]">
					<AdminSidebar />
					<main className="min-w-0">
						<Outlet />
					</main>
				</div>
			</div>
		</DashboardProvider>
	);
}
