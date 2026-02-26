import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "@/api/services/auth";
import type { UserResponse } from "@/api/types";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export default function PageProfile() {
	const navigate = useNavigate();
	const [user, setUser] = useState<UserResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getCurrentUser()
			.then(setUser)
			.catch((err: unknown) => {
				console.error("[PageProfile] getCurrentUser failed:", err);
				setError("Сессия недействительна — войдите снова");
			});
	}, []);

	async function handleLogout() {
		await logout();
		navigate("/login");
	}

	if (error) {
		return (
			<div className="flex min-h-svh w-full items-center justify-center flex-col gap-4">
				<p className="text-destructive">{error}</p>
				<Button variant="default" onClick={() => navigate("/login")}>
					Войти
				</Button>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex min-h-svh w-full items-center justify-center">
				<p className="text-muted-foreground">Загрузка...</p>
			</div>
		);
	}

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6">
			<Card className="w-full max-w-sm">
				<CardHeader className="flex flex-row items-center gap-4">
					<Avatar size="lg">
						<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
					</Avatar>
					<CardTitle className="text-xl">{user.name}</CardTitle>
				</CardHeader>
				<Separator />
				<CardContent className="flex flex-col gap-3 pt-4">
					<div className="flex flex-col gap-1">
						<span className="text-muted-foreground text-xs">Электронная почта</span>
						<span className="text-sm">{user.email}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-muted-foreground text-xs">Телефон</span>
						<span className="text-sm">{user.phone}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-muted-foreground text-xs">Роль</span>
						<span className="text-sm capitalize">{user.role}</span>
					</div>
					<Separator />
					<Button variant="destructive" onClick={handleLogout}>
						Выйти
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
