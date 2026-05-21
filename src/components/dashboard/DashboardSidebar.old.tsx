import { Card, CardContent } from "@/components/ui/card";
import ContextSwitcher from "@/components/dashboard/ContextSwitcher";
import NavList from "@/components/dashboard/NavList";

export default function DashboardSidebar() {
	return (
		<aside className="md:sticky md:top-6 md:self-start">
			<Card className="gap-3 py-3">
				<CardContent className="flex flex-col gap-3 px-3">
					<ContextSwitcher />
					<NavList />
				</CardContent>
			</Card>
		</aside>
	);
}
