import type {
	CompanyResponse,
	CompanyCreateRequest,
	CompanyUpdateRequest,
} from "@/api/types/company.types";

import type { BackendResponse } from "@/api/types/common.types";
import { apiClient } from "@/api/client";
import { API_ROUTES } from "@/../api.config";

export async function getCompanies(): Promise<CompanyResponse[]> {
	const res = await apiClient.get<BackendResponse<CompanyResponse[]>>(API_ROUTES.organizers.list);
	return res.data.data;
}

export async function getCompanyById(id: string): Promise<CompanyResponse> {
	const res = await apiClient.get<BackendResponse<CompanyResponse>>(API_ROUTES.organizers.get(id));
	return res.data.data;
}

export async function createCompany(data: CompanyCreateRequest): Promise<CompanyResponse> {
	const res = await apiClient.post<BackendResponse<CompanyResponse>>(API_ROUTES.organizers.list, data);
	return res.data.data;
}

export async function updateCompany(id: string, data: CompanyUpdateRequest): Promise<CompanyResponse> {
	const res = await apiClient.patch<BackendResponse<CompanyResponse>>(API_ROUTES.organizers.get(id), data);
	return res.data.data;
}

export async function deleteCompany(id: string): Promise<void> {
	await apiClient.delete(API_ROUTES.organizers.get(id));
}
