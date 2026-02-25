import { apiClient } from "../../client";
import { API_ROUTES } from "../../../../api.config";
import type { UserCreateRequest, UserResponse } from "../../types";
// import type { RegisterData, RegisterResponse } from '../../types';

/**
 * Регистрация нового пользователя
 * @param data - Данные для регистрации
 * @returns Promise с данными зарегистрированного пользователя
 */
export const register = async (data: UserCreateRequest): Promise<UserResponse> => {
	try {
		console.log("Sending registration data:", data);
		const response = await apiClient.post<UserResponse>(API_ROUTES.auth.register, data);

		console.log("Registration successful:", response.data);

		return response.data;
	} catch (error: any) {
		console.error("Registration error:", error);
		console.error("Error response:", error.response?.data);

		// Подробный вывод ошибки
		if (error.response?.data?.detail) {
			console.error("Error detail:", JSON.stringify(error.response.data.detail, null, 2));
		}

		// Выводим детальную информацию об ошибке
		let errorMessage = "Ошибка регистрации";

		if (error.response?.data?.detail) {
			if (Array.isArray(error.response.data.detail)) {
				// FastAPI validation errors
				errorMessage = error.response.data.detail.map((err: any) =>
					`${err.loc?.join('.') || 'field'}: ${err.msg}`
				).join(', ');
			} else if (typeof error.response.data.detail === 'string') {
				errorMessage = error.response.data.detail;
			}
		} else if (error.response?.data?.message) {
			errorMessage = error.response.data.message;
		} else if (error.message) {
			errorMessage = error.message;
		}

		throw new Error(errorMessage);
	}
};

// export const register = async (data: RegisterData): Promise<RegisterResponse> => {
//     try {
//         const response = await fetch(API_ROUTES.auth.register, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data),
//         });
//
//         if (!response.ok) {
//             throw new Error('Ошибка регистрации');
//         }
//
//         const result = await response.json();
//         console.log('Registration successful:', result);
//
//         return result;
//     } catch (error) {
//         console.error('Registration error:', error);
//         throw new Error('Ошибка регистрации');
//     }
// };
