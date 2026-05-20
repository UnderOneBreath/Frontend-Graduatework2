import type { ReactNode } from "react";

interface ProfileSectionProps {
	title: string;
	description?: string;
	action?: ReactNode;
	children?: ReactNode;
}

export default function ProfileSection({
	title,
	description,
	action,
	children,
}: ProfileSectionProps) {
	return (
		<section className="py-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
			<div className="flex flex-col gap-1">
				<h2 className="text-xs uppercase tracking-wide text-muted-foreground">
					{title}
				</h2>
				{description && (
					<p className="text-xs text-muted-foreground/80 leading-snug">
						{description}
					</p>
				)}
			</div>
			<div className="flex flex-col gap-4">
				{children}
				{action && <div className="flex justify-start">{action}</div>}
			</div>
		</section>
	);
}
