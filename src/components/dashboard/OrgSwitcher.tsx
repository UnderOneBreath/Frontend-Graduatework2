import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/context/DashboardContext";

export default function OrgSwitcher() {
	const { active, companies, loadingCompanies, setCompany } = useDashboard();
	const navigate = useNavigate();

	const value = active.kind === "company" ? active.company.id : undefined;

	function onChange(next: string) {
		setCompany(next);
		navigate("/dashboard/draws");
	}

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full" aria-label="Выбор организации">
				<SelectValue placeholder="Выберите организацию">
					{active.kind === "company" ? (
						<span className="flex items-center gap-2">
							<Building2 className="size-4" />
							<span className="truncate">{active.company.name}</span>
						</span>
					) : null}
				</SelectValue>
			</SelectTrigger>
			<SelectContent position="popper" align="start" className="w-(--radix-select-trigger-width)">
				{companies.map((c) => (
					<SelectItem key={c.id} value={c.id}>
						<span className="flex items-center gap-2">
							<Building2 className="size-4 shrink-0" />
							<span className="truncate">{c.name}</span>
						</span>
					</SelectItem>
				))}
				{loadingCompanies && companies.length === 0 ? (
					<div className="px-3 py-2 text-xs text-muted-foreground">Загрузка…</div>
				) : null}
			</SelectContent>
		</Select>
	);
}
