import type { CompanyResponse } from "@/api/types/company.types";
import CompanyCard from "./CompanyCard";

interface CompanySwitcherProps {
	companies: CompanyResponse[];
	activeId: string | null;
	onSelect: (id: string) => void;
}

export default function CompanySwitcher({
	companies,
	activeId,
	onSelect,
}: CompanySwitcherProps) {
	return (
		<nav className="flex flex-col">
			<p className="text-xs uppercase tracking-wide text-muted-foreground px-4 py-3">
				Компании
			</p>
			<div className="flex flex-col">
				{companies.map((c) => (
					<CompanyCard
						key={c.id}
						company={c}
						active={c.id === activeId}
						onClick={() => onSelect(c.id)}
					/>
				))}
			</div>
		</nav>
	);
}
