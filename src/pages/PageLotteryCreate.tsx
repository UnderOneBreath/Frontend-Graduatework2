import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Label } from "@/components/ui/";
import { LotteryStatus } from "@/api/types/lottery.types";
import type { LotteryCreateRequest } from "@/api/types/lottery.types";

export default function PageLotteryCreate() {
	const navigate = useNavigate();

	const [form, setForm] = useState<LotteryCreateRequest>({
		name: "",
		start_date: "",
		end_date: "",
		max_entries: 100,
		status: LotteryStatus.Active,
		company_id: "",
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: name === "max_entries" ? Number(value) : value,
		}));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		console.log("Создание розыгрыша:", form);
		// TODO: вызов API
		navigate("/lotteries");
	}

	return (
		<div className="max-w-xl mx-auto px-4 py-8">
			<div className="flex items-center gap-4 mb-6">
				<Button variant="ghost" onClick={() => navigate("/lotteries")}>
					← Назад
				</Button>
				<h1 className="text-2xl font-bold">Создать розыгрыш</h1>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="name">Название</Label>
					<Input
						id="name"
						name="name"
						placeholder="Введите название розыгрыша"
						value={form.name}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="company_id">ID компании</Label>
					<Input
						id="company_id"
						name="company_id"
						placeholder="Введите ID компании"
						value={form.company_id}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="start_date">Дата начала</Label>
						<Input
							id="start_date"
							name="start_date"
							type="datetime-local"
							value={form.start_date}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="end_date">Дата окончания</Label>
						<Input
							id="end_date"
							name="end_date"
							type="datetime-local"
							value={form.end_date}
							onChange={handleChange}
							required
						/>
					</div>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="max_entries">Максимум участников</Label>
					<Input
						id="max_entries"
						name="max_entries"
						type="number"
						min={1}
						value={form.max_entries}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="status">Статус</Label>
					<select
						id="status"
						name="status"
						value={form.status}
						onChange={handleChange}
						className="border-input bg-transparent h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none"
					>
						<option value={LotteryStatus.Active}>Активный</option>
						<option value={LotteryStatus.Completed}>Завершён</option>
					</select>
				</div>

				<div className="flex justify-end gap-3 mt-2">
					<Button type="button" variant="outline" onClick={() => navigate("/lotteries")}>
						Отмена
					</Button>
					<Button type="submit">Создать</Button>
				</div>
			</form>
		</div>
	);
}
