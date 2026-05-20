import { useNavigate } from "react-router-dom";
import { Building2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/context/DashboardContext";

const PERSONAL_VALUE = "personal";

export default function ContextSwitcher() {
	const { active, companies, loadingCompanies, setPersonal, setCompany } = useDashboard();
	const navigate = useNavigate();

	const value = active.kind === "personal" ? PERSONAL_VALUE : active.company.id;

	function onChange(next: string) {
		if (next === PERSONAL_VALUE) {
			setPersonal();
			navigate("/dashboard/overview");
		} else {
			setCompany(next);
			navigate("/dashboard/draws");
		}
	}

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full" aria-label="Контекст рабочего пространства">
				<SelectValue>
					{active.kind === "personal" ? (
						<span className="flex items-center gap-2">
							<User className="size-4" />
							<span className="truncate">Личный кабинет</span>
						</span>
					) : (
						<span className="flex items-center gap-2">
							<Building2 className="size-4" />
							<span className="truncate">{active.company.name}</span>
						</span>
					)}
				</SelectValue>
			</SelectTrigger>
			<SelectContent position="popper" align="start" className="w-(--radix-select-trigger-width)">
				<SelectItem value={PERSONAL_VALUE}>
					<span className="flex items-center gap-2">
						<User className="size-4" />
						Личный кабинет
					</span>
				</SelectItem>
				{companies.length > 0 ? (
					<>
						<SelectSeparator />
						<SelectGroup>
							<SelectLabel>Компании</SelectLabel>
							{companies.map((c) => (
								<SelectItem key={c.id} value={c.id}>
									<span className="flex w-full min-w-0 items-center justify-between gap-2">
										<span className="flex min-w-0 items-center gap-2">
											<Building2 className="size-4 shrink-0" />
											<span className="truncate">{c.name}</span>
										</span>
										<Badge
											variant="outline"
											className="shrink-0 text-[10px] uppercase tracking-wider"
										>
											Member
										</Badge>
									</span>
								</SelectItem>
							))}
						</SelectGroup>
					</>
				) : null}
				{loadingCompanies ? (
					<div className="px-3 py-2 text-xs text-muted-foreground">Загрузка…</div>
				) : null}
			</SelectContent>
		</Select>
	);
}
