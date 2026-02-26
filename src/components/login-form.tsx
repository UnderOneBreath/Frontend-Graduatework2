import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { login } from "@/api/services/auth";
import type { LoginRequest } from "@/api/types";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const navigate = useNavigate();
	const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login(form);
			navigate("/profile", { replace: true });
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Ошибка авторизации");
			setLoading(false);
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Войдите в свой аккаунт</CardTitle>
					<CardDescription>
						Введите свой адрес электронной почты для входа в аккаунт
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Электронная почта</FieldLabel>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="m@example.com"
									required
									value={form.email}
									onChange={handleChange}
								/>
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Пароль</FieldLabel>
									<a
										href="#"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Забыли пароль?
									</a>
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									required
									value={form.password}
									onChange={handleChange}
								/>
							</Field>
							{error && (
								<Field>
									<FieldError>{error}</FieldError>
								</Field>
							)}
							<Field>
								<Button type="submit" disabled={loading}>
									{loading ? "Вход..." : "Войти"}
								</Button>
								<FieldDescription className="text-center">
									Нет аккаунта?{" "}
									<Link
										to="/signup"
										className="underline-offset-4 hover:underline"
									>
										Зарегистрироваться
									</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
