import type { ReactNode } from "react";

interface OrganizerLayoutProps {
	sidebar: ReactNode;
	children: ReactNode;
}

export default function OrganizerLayout({ sidebar, children }: OrganizerLayoutProps) {
	return (
		<div className="min-h-svh w-full bg-background text-foreground">
			<div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0">
				<aside className="border-b md:border-b-0 md:border-r border-border md:min-h-svh">
					{sidebar}
				</aside>
				<main className="p-8">{children}</main>
			</div>
		</div>
	);
}
