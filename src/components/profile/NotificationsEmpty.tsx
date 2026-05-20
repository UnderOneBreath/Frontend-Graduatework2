export default function NotificationsEmpty() {
	return (
		<div className="border border-dashed border-border rounded-md p-10 text-center">
			<p className="text-sm text-foreground">Пока нет уведомлений</p>
			<p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">
				Здесь будут появляться новости от организаторов и сообщения о результатах
				розыгрышей.
			</p>
		</div>
	);
}
