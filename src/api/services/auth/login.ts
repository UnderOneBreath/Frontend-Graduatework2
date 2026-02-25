import { apiClient } from '../../client';
import { API_ROUTES } from '../../../../api.config';
import type { LoginRequest, TokenResponse } from '../../types';

export const login = async (credentials: LoginRequest): Promise<TokenResponse> => {
    try {
        const response = await apiClient.post<TokenResponse>(API_ROUTES.auth.login, credentials);

        console.log('Login successful:', response.data);

        if (response.data.token) {
            localStorage.setItem('accessToken', response.data.token);
        }
        if (response.data.refresh_token) {
            localStorage.setItem('refreshToken', response.data.refresh_token);
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Ошибка авторизации');
    }
};
