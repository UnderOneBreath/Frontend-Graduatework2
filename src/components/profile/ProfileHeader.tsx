import type { UserResponse } from "@/api/types";
import { UserRole } from "@/api/types/user.types";
import { Button } from "@/components/ui/button";

function getInitials(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function formatRole(role: UserRole): string {
	if (role === UserRole.organizer) return "Организатор";
	if (role === UserRole.participant) return "Участник";
	return role;
}

interface ProfileHeaderProps {
	user: UserResponse;
	onEdit?: () => void;
}

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
	return (
		<header className="flex items-center gap-5 pb-8">
			<div className="h-16 w-16 rounded-md bg-muted text-foreground flex items-center justify-center text-lg shrink-0">
				{getInitials(user.name)}
			</div>
			<div className="flex flex-col gap-1 min-w-0 flex-1">
				<div className="flex items-center gap-3 flex-wrap">
					<h1 className="text-2xl text-foreground truncate">{user.name}</h1>
					<span className="text-xs uppercase tracking-wide text-muted-foreground border border-border rounded-md px-2 py-0.5">
						{formatRole(user.role)}
					</span>
				</div>
				<p className="text-sm text-muted-foreground truncate">{user.email}</p>
			</div>
			{onEdit && (
				<Button variant="outline" onClick={onEdit} className="shrink-0">
					Редактировать
				</Button>
			)}
		</header>
	);
}
