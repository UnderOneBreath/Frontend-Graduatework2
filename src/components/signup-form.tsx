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
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Создать аккаунт</CardTitle>
				<CardDescription>
					Введите вашу информацию ниже, чтобы создать аккаунт
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Имя пользователя</FieldLabel>
							<Input id="name" type="text" placeholder="Иван Иванов" required />
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Электронная почта</FieldLabel>
							<Input
								id="email"
								type="email"
								placeholder="example@mail.com"
								required
							/>
							<FieldDescription className="">
								Мы используем это для связи с вами. Мы не будем делиться вашей
								электронной почтой с кем-либо.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Пароль</FieldLabel>
							<Input id="password" type="password" required />
							<FieldDescription>
								Должен быть не менее 8 символов.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="confirm-password">
								Подтвердите пароль
							</FieldLabel>
							<Input id="confirm-password" type="password" required />
							<FieldDescription>
								Пожалуйста, подтвердите ваш пароль.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="phone">Номер телефона</FieldLabel>
							<Input
								id="phone"
								type="tel"
								placeholder="+7 (999) 000-00-00"
							/>
						</Field>
						<FieldGroup>
							<Field>
								<Button type="submit">Создать аккаунт</Button>
								{/* <Button variant="outline" type="button">
									Зарегистрироваться через Google
								</Button> */}
								<FieldDescription className="px-6 text-center">
									Уже есть аккаунт?{" "}
									<Link
										to="/Login"
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
