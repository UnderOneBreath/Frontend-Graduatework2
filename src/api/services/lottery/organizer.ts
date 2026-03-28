import type {
    CompanyResponse,
    CompanyCreateRequest,
    CompanyUpdateRequest,
} from "@/api/types/company.types";

import type { BackendResponse } from "@/api/types/common.types";
import { apiClient } from "@/api/client";
import { API_ROUTES } from "@/../api.config";

// import { MOCK_COMPANIES } from "./company.mock";

export async function getCompanies(): Promise<CompanyResponse[]> {
    const res = await apiClient.get<BackendResponse<CompanyResponse[]>>(API_ROUTES.organizer.list);
    return res.data.data;

    // return Promise.resolve([...MOCK_COMPANIES]);
}

export async function getCompanyById(id: string): Promise<CompanyResponse> {
    const res = await apiClient.get<BackendResponse<CompanyResponse>>(API_ROUTES.organizer.get(id));
    return res.data.data;

    // const company = MOCK_COMPANIES.find((c) => c.id === id);
    // if (!company) return Promise.reject(new Error(`Company ${id} not found`));
    // return Promise.resolve({ ...company });
}

export async function createCompany(
    data: CompanyCreateRequest,
): Promise<CompanyResponse> {
    const res = await apiClient.post<BackendResponse<CompanyResponse>>(API_ROUTES.organizer.list, data);
    return res.data.data;

    // const newCompany: CompanyResponse = {
    // 	id: String(Date.now()),
    // 	logo: 0,
    // 	...data,
    // };
    // MOCK_COMPANIES.push(newCompany);
    // return Promise.resolve({ ...newCompany });
}

export async function updateCompany(
    id: string,
    data: CompanyUpdateRequest,
): Promise<CompanyResponse> {
    const res = await apiClient.patch<BackendResponse<CompanyResponse>>(API_ROUTES.organizer.get(id), data);
    return res.data.data;

    // const idx = MOCK_COMPANIES.findIndex((c) => c.id === id);
    // if (idx === -1) return Promise.reject(new Error(`Company ${id} not found`));
    // MOCK_COMPANIES[idx] = { ...MOCK_COMPANIES[idx], ...data };
    // return Promise.resolve({ ...MOCK_COMPANIES[idx] });
}

export async function deleteCompany(id: string): Promise<void> {
    await apiClient.delete(API_ROUTES.organizer.get(id));

    // const idx = MOCK_COMPANIES.findIndex((c) => c.id === id);
    // if (idx !== -1) MOCK_COMPANIES.splice(idx, 1);
}
