import "tailwindcss";
import "@/index.css";
import { useEffect } from "react";
import Header from "@/components/header";
import DashboardHeader from "./components/dashboard/DashboardHeader";
// import { useDashboard } from "./context/DashboardContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import * as Pages from "@/pages";
import OverviewView from "@/components/dashboard/personal/OverviewView";
import ParticipationsView from "@/components/dashboard/personal/ParticipationsView";
import NotificationsView from "@/components/dashboard/personal/NotificationsView";
import AccountView from "@/components/dashboard/personal/AccountView";
import DrawsView from "@/components/dashboard/company/DrawsView";
import AnalyticsView from "@/components/dashboard/company/AnalyticsView";
import SettingsView from "@/components/dashboard/company/SettingsView";
import ApplicationsView from "@/components/admin/ApplicationsView";
import LotteriesModerationView from "@/components/admin/LotteriesModerationView";
import { bootstrapRefresh } from "@/api/auth/tokenRefresher";
import { DashboardProvider } from "./context/DashboardContext";

function App() {
	useEffect(() => {
		void bootstrapRefresh();
	}, []);

	return (
		<>
			<Router>
				<DashboardProvider>
					<Header></Header>
					<Routes>
						<Route path="/" element={<Pages.PageMain />} />
						<Route path="/login" element={<Pages.Login />} />
						<Route path="/signup" element={<Pages.SignUp />} />
						<Route path="/profile" element={<Navigate replace to="/dashboard/overview" />} />
						<Route path="/lotteries" element={<Pages.PageLotteries />} />
						<Route path="/lotteries/create" element={<Pages.PageLotteryCreate />} />
						<Route path="/lotteries/:id" element={<Pages.PageLotteryInfo />} />
						<Route path="/organizer" element={<Navigate replace to="/dashboard/draws" />} />
						<Route path="/organizer/apply" element={<Pages.PageOrganizerApply />} />
						<Route path="/dashboard" element={<Pages.PageDashboard />}>
							<Route index element={<Navigate replace to="overview" />} />
							<Route path="overview" element={<OverviewView />} />
							<Route path="participations" element={<ParticipationsView />} />
							<Route path="notifications" element={<NotificationsView />} />
							<Route path="account" element={<AccountView />} />
							<Route path="draws" element={<DrawsView />} />
							<Route path="analytics" element={<AnalyticsView />} />
							<Route path="settings" element={<SettingsView />} />
						</Route>
						<Route path="/admin" element={<Pages.PageAdmin />}>
							<Route index element={<Navigate replace to="applications" />} />
							<Route path="applications" element={<ApplicationsView />} />
							<Route path="lotteries" element={<LotteriesModerationView />} />
						</Route>
					</Routes>
				</DashboardProvider>
			</Router>
		</>
	);
}

export default App;
