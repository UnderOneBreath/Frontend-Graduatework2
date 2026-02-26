import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { register } from "@/api/services/auth";
import { UserRole } from "@/api/types";
import type { UserCreateRequest } from "@/api/types";

type SignupFormData = Omit<UserCreateRequest, "role"> & {
	confirmPassword: string;
};

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	const navigate = useNavigate();
	const [form, setForm] = useState<SignupFormData>({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		if (form.password !== form.confirmPassword) {
			setError("Пароли не совпадают");
			return;
		}

		setLoading(true);
		try {
			const payload: UserCreateRequest = {
				name: form.name,
				email: form.email,
				phone: form.phone,
				password: form.password,
				role: UserRole.participant,
			};
			await register(payload);
			navigate("/login");
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Ошибка регистрации");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle className="text-2xl">Создать аккаунт</CardTitle>
				<CardDescription>
					Введите вашу информацию ниже, чтобы создать аккаунт
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit}>
					<FieldGroup className="gap-5">
						<Field>
							<FieldLabel htmlFor="name">Имя пользователя</FieldLabel>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Иван Иванов"
								required
								value={form.name}
								onChange={handleChange}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Электронная почта</FieldLabel>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="example@mail.com"
								required
								value={form.email}
								onChange={handleChange}
							/>
							<FieldDescription>
								Мы используем это для связи с вами. Мы не будем делиться вашей
								электронной почтой с кем-либо.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="phone">Номер телефона</FieldLabel>
							<Input
								id="phone"
								name="phone"
								type="tel"
								placeholder="+7 (999) 000-00-00"
								required
								value={form.phone}
								onChange={handleChange}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Пароль</FieldLabel>
							<Input
								id="password"
								name="password"
								type="password"
								required
								value={form.password}
								onChange={handleChange}
							/>
							<FieldDescription>Должен быть не менее 8 символов.</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="confirmPassword">
								Подтвердите пароль
							</FieldLabel>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
								value={form.confirmPassword}
								onChange={handleChange}
							/>
							<FieldDescription>Пожалуйста, подтвердите ваш пароль.</FieldDescription>
						</Field>
						{error && (
							<Field>
								<FieldError>{error}</FieldError>
							</Field>
						)}
						<FieldGroup>
							<Field>
								<Button type="submit" disabled={loading}>
									{loading ? "Создание..." : "Создать аккаунт"}
								</Button>
								<FieldDescription className="px-6 text-center">
									Уже есть аккаунт?{" "}
									<Link
										to="/login"
										className="underline-offset-4 hover:underline"
									>
										Войти
									</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
