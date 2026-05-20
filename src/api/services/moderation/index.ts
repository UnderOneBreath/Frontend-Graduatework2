import { apiClient } from "@/api/client";
import { API_ROUTES } from "@/../api.config";
import type { BackendResponse } from "@/api/types";
import type {
	ApplicationUpdateRequest,
	OrganizerApplication,
	RequestStatus,
} from "@/api/types/moderation.types";

const USE_MOCK = import.meta.env.VITE_USE_MODERATION_MOCK === "true";

let mockSeed: OrganizerApplication[] | null = null;

function seedMock(): OrganizerApplication[] {
	if (mockSeed) return mockSeed;
	const now = Date.now();
	mockSeed = [
		{
			id: "mock-app-1",
			user_id: "mock-user-1",
			company_data: {
				name: "ООО «Розыгрыш-Сервис»",
				inn: 7701234567,
				ogrn: 1147746123456,
				phone: "+7 (495) 111-22-33",
				address: "г. Москва, ул. Пушкина, д. 1",
				email: "contact@rs.example",
			},
			status: "pending",
			rejection_reason: null,
			created_at: new Date(now - 1000 * 60 * 60 * 4).toISOString(),
		},
		{
			id: "mock-app-2",
			user_id: "mock-user-2",
			company_data: {
				name: "ИП Петров А.А.",
				inn: 503812345678,
				ogrn: 304503812345678,
				phone: "+7 (915) 555-44-33",
				address: "Московская обл., г. Химки, ул. Ленина, д. 5",
				email: "petrov@ip.example",
			},
			status: "pending",
			rejection_reason: null,
			created_at: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
		},
		{
			id: "mock-app-3",
			user_id: "mock-user-3",
			company_data: {
				name: "ООО «Призы и Бонусы»",
				inn: 7809876543,
				ogrn: 1147809876543,
				phone: "+7 (812) 444-55-66",
				address: "г. Санкт-Петербург, Невский пр., д. 100",
				email: "info@prizes.example",
			},
			status: "accepted",
			rejection_reason: null,
			created_at: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
		},
		{
			id: "mock-app-4",
			user_id: "mock-user-4",
			company_data: {
				name: "ООО «Сомнительные Лотереи»",
				inn: 7712345678,
				ogrn: 1147712345678,
				phone: "+7 (495) 000-00-00",
				address: "—",
				email: "noreply@suspect.example",
			},
			status: "rejected",
			rejection_reason: "Несоответствие реквизитов открытым данным ФНС.",
			created_at: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
		},
	];
	return mockSeed;
}

function unwrap<T>(res: { data: BackendResponse<T> }): T {
	if (!res.data.success || res.data.data == null) {
		throw new Error(res.data.message || "Ошибка запроса");
	}
	return res.data.data;
}

export async function listApplications(
	status?: RequestStatus,
): Promise<OrganizerApplication[]> {
	if (USE_MOCK) {
		const items = seedMock();
		return status ? items.filter((i) => i.status === status) : [...items];
	}
	const res = await apiClient.get<BackendResponse<OrganizerApplication[]>>(
		API_ROUTES.requests.list,
	);
	const items = unwrap(res);
	return status ? items.filter((i) => i.status === status) : items;
}

export async function getApplication(id: string): Promise<OrganizerApplication> {
	if (USE_MOCK) {
		const item = seedMock().find((i) => i.id === id);
		if (!item) throw new Error("Заявка не найдена");
		return item;
	}
	const res = await apiClient.get<BackendResponse<OrganizerApplication>>(
		API_ROUTES.requests.get(id),
	);
	return unwrap(res);
}

export async function approveApplication(id: string): Promise<OrganizerApplication> {
	if (USE_MOCK) {
		const item = seedMock().find((i) => i.id === id);
		if (!item) throw new Error("Заявка не найдена");
		item.status = "accepted";
		item.rejection_reason = null;
		return item;
	}
	const body: ApplicationUpdateRequest = { status: "accepted" };
	const res = await apiClient.patch<BackendResponse<OrganizerApplication>>(
		API_ROUTES.requests.get(id),
		body,
	);
	return unwrap(res);
}

export async function rejectApplication(
	id: string,
	reason: string,
): Promise<OrganizerApplication> {
	if (USE_MOCK) {
		const item = seedMock().find((i) => i.id === id);
		if (!item) throw new Error("Заявка не найдена");
		item.status = "rejected";
		item.rejection_reason = reason;
		return item;
	}
	const body: ApplicationUpdateRequest = {
		status: "rejected",
		rejection_reason: reason,
	};
	const res = await apiClient.patch<BackendResponse<OrganizerApplication>>(
		API_ROUTES.requests.get(id),
		body,
	);
	return unwrap(res);
}
