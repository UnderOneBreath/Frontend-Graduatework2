interface ProfileFieldProps {
	label: string;
	value: string;
}

export default function ProfileField({ label, value }: ProfileFieldProps) {
	return (
		<div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
			<span className="text-xs uppercase tracking-wide text-muted-foreground sm:w-32 shrink-0">
				{label}
			</span>
			<span className="text-sm text-foreground break-all">{value || "—"}</span>
		</div>
	);
}
