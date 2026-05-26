import { useMemo } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useUserCompanies } from "@/hooks/useUserCompanies";
import OrganizerLayout from "@/components/organizer/OrganizerLayout";
import CompanySwitcher from "@/components/organizer/CompanySwitcher";
import { LotteryList } from "@/components/lottery-list";
import OrganizerBookingsTab from "@/components/organizer/OrganizerBookingsTab";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";

export default function PageOrganizer() {
	const isAuthenticated = useRequireAuth();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { companies, loading, error } = useUserCompanies();

	const queryCompanyId = searchParams.get("company");
	const activeCompany = useMemo(() => {
		if (companies.length === 0) return null;
		return (
			companies.find((c) => c.id === queryCompanyId) ?? companies[0]
		);
	}, [companies, queryCompanyId]);

	if (!isAuthenticated) return null;

	if (loading) {
		return (
			<div className="flex min-h-svh w-full items-center justify-center">
				<p className="text-muted-foreground text-sm">Загрузка...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-svh w-full items-center justify-center flex-col gap-3">
				<p className="text-foreground text-sm">{error}</p>
				<Button variant="outline" onClick={() => navigate("/profile")}>
					Вернуться в профиль
				</Button>
			</div>
		);
	}

	if (companies.length === 0) {
		return <Navigate to="/organizer/apply" replace />;
	}

	function handleSelect(id: string) {
		setSearchParams({ company: id }, { replace: true });
	}

	const c = activeCompany!;
	return (
		<OrganizerLayout
			sidebar={
				<div className="py-4">
					<div className="px-4 pb-3">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">
							Панель организатора
						</p>
					</div>
					<CompanySwitcher
						companies={companies}
						activeId={c.id}
						onSelect={handleSelect}
					/>
				</div>
			}
		>
			<header className="flex flex-col gap-2 pb-6">
				<p className="text-xs uppercase tracking-wide text-muted-foreground">
					Компания
				</p>
				<h1 className="text-2xl text-foreground">{c.name}</h1>
				<p className="text-sm text-muted-foreground">{c.address}</p>
			</header>

			<Separator />

			<section className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
				<Detail label="Email" value={c.email} />
				<Detail label="Телефон" value={c.phone} />
				<Detail label="ИНН" value={String(c.inn)} mono />
				<Detail label="ОГРН" value={String(c.ogrn)} mono />
			</section>

			<Separator />

			<Tabs defaultValue="lotteries" className="py-6">
				<TabsList>
					<TabsTrigger value="lotteries">Розыгрыши</TabsTrigger>
					<TabsTrigger value="bookings">Бронирования</TabsTrigger>
				</TabsList>

				<TabsContent value="lotteries" className="flex flex-col gap-4 pt-4">
					<div className="flex items-center justify-between gap-4">
						<p className="text-sm text-muted-foreground">
							Управление розыгрышами компании.
						</p>
						<Button onClick={() => navigate("/lotteries/create")}>
							Создать розыгрыш
						</Button>
					</div>
					<LotteryList
						orgId={c.id}
						emptyText="У этой компании пока нет розыгрышей."
						onLotteryDetails={(id) => navigate(`/lotteries/${id}`)}
					/>
				</TabsContent>

				<TabsContent value="bookings" className="pt-4">
					<OrganizerBookingsTab companyId={c.id} />
				</TabsContent>
			</Tabs>
		</OrganizerLayout>
	);
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-xs uppercase tracking-wide text-muted-foreground">
				{label}
			</span>
			<span className={`text-sm text-foreground ${mono ? "font-mono tracking-tight" : ""}`}>
				{value}
			</span>
		</div>
	);
}
