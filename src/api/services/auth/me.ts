import { apiClient } from '../../client';
import { API_ROUTES } from '../../../../api.config';
import type { UserResponse } from '../../types';

export const getCurrentUser = async (accessToken?: string): Promise<UserResponse> => {
    try {
        const headers: Record<string, string> = {};

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        const response = await apiClient.get<UserResponse>(
            API_ROUTES.auth.me,
            { headers }
        );

        console.log('User data retrieved:', response.data);

        return response.data;
    } catch (error) {
        console.error('Get current user error:', error);
        throw new Error('Ошибка получения данных пользователя');
    }
};
