import type { CompanyResponse } from "@/api/types/company.types";

export const MOCK_COMPANIES: CompanyResponse[] = [
	{
		id: "c1",
		name: "ООО «Удача»",
		brief_name: "Удача",
		inn: 7701234567,
		ogrn: 1027700000000,
		phone: "+7 (495) 123-45-67",
		address: "г. Москва, ул. Пушкина, д. 1",
		logo: 0,
		email: "info@udacha.ru",
		owner: "u1",
	},
	{
		id: "c2",
		name: "АО «СчастьеЛото»",
		brief_name: "СчастьеЛото",
		inn: 7709876543,
		ogrn: 1057700000001,
		phone: "+7 (812) 987-65-43",
		address: "г. Санкт-Петербург, пр. Невский, д. 10",
		logo: 0,
		email: "hello@schastieloto.ru",
		owner: "u2",
	},
];
