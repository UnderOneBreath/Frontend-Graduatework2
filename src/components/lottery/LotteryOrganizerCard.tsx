import { Building2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CompanyResponse } from "@/api/types/company.types";

interface LotteryOrganizerCardProps {
	organizer: CompanyResponse | null;
}

function initials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? "")
		.join("");
}

export function LotteryOrganizerCard({ organizer }: LotteryOrganizerCardProps) {
	if (!organizer) {
		return (
			<div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
				Информация об организаторе временно недоступна
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
			<div className="flex items-start gap-4">
				<Avatar size="lg">
					{organizer.logo && <AvatarImage src={organizer.logo} alt={organizer.name} />}
					<AvatarFallback>{initials(organizer.name)}</AvatarFallback>
				</Avatar>
				<div className="flex flex-1 flex-col gap-1 min-w-0">
					<div className="flex items-center gap-2">
						<h3 className="text-lg font-semibold text-foreground truncate">{organizer.name}</h3>
						<span
							className="inline-flex items-center gap-1 text-xs text-green-600"
							title="Организатор верифицирован"
						>
							<ShieldCheck className="size-3.5" />
							Верифицирован
						</span>
					</div>
					<p className="text-xs text-muted-foreground">ИНН {organizer.inn} · ОГРН {organizer.ogrn}</p>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
				<InfoRow icon={<MapPin className="size-4" />} value={organizer.address} />
				<InfoRow icon={<Phone className="size-4" />} value={organizer.phone} href={`tel:${organizer.phone}`} />
				<InfoRow icon={<Mail className="size-4" />} value={organizer.email} href={`mailto:${organizer.email}`} />
				<InfoRow icon={<Building2 className="size-4" />} value="Юридическое лицо" />
			</div>
		</div>
	);
}

function InfoRow({ icon, value, href }: { icon: React.ReactNode; value: string; href?: string }) {
	return (
		<div className="flex items-center gap-2 text-muted-foreground">
			<span className="text-muted-foreground/70">{icon}</span>
			{href ? (
				<a href={href} className="truncate text-foreground hover:underline">
					{value}
				</a>
			) : (
				<span className="truncate text-foreground">{value}</span>
			)}
		</div>
	);
}
