import type { CompanyResponse } from "@/api/types/company.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getInitials(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

interface CompanyCardProps {
	company: CompanyResponse;
	active?: boolean;
	onClick?: () => void;
}

export default function CompanyCard({ company, active, onClick }: CompanyCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`w-full text-left flex items-center gap-3 px-4 py-3 border-l-2 transition-colors ${
				active
					? "bg-muted border-foreground"
					: "border-transparent hover:bg-muted/50"
			}`}
		>
			<Avatar size="sm">
				{company.logo ? <AvatarImage src={company.logo} alt={company.name} /> : null}
				<AvatarFallback>{getInitials(company.name)}</AvatarFallback>
			</Avatar>
			<div className="flex-1 min-w-0">
				<p className="text-sm truncate text-foreground">{company.name}</p>
				<p className="text-xs text-muted-foreground truncate">{company.address}</p>
			</div>
		</button>
	);
}
