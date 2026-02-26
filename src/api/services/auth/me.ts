import { apiClient } from '../../client';
import { API_ROUTES } from '../../../../api.config';
import type { UserResponse, BackendResponse } from '../../types';

/**
 * Получить текущего пользователя через GET /users/ (фильтруем по email из localStorage).
 * /auth/me на бэкенде отсутствует; аутентификация идёт через httpOnly cookie.
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
        throw new Error('Пользователь не авторизован');
    }

    try {
        const response = await apiClient.get<BackendResponse<UserResponse[]>>(
            API_ROUTES.users.list
        );

        const users = response.data.data ?? [];
        const user = users.find((u) => u.email === email);

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        return user;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error instanceof Error ? error : new Error('Ошибка получения данных пользователя');
    }
};
