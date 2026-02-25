import { apiClient } from '../../client';
import { API_ROUTES } from '../../../../api.config';
import type { ServerRefreshTokenRequest, TokenResponse } from '../../types';

export const refreshToken = async (refreshToken: string): Promise<TokenResponse> => {
    try {
        const requestData: ServerRefreshTokenRequest = {
            refresh_token: refreshToken,
        };

        const response = await apiClient.post<TokenResponse>(
            API_ROUTES.auth.refresh,
            requestData
        );

        console.log('Token refreshed:', response.data);

        if (response.data.token) {
            localStorage.setItem('accessToken', response.data.token);
        }
        if (response.data.refresh_token) {
            localStorage.setItem('refreshToken', response.data.refresh_token);
        }

        return response.data;
    } catch (error) {
        console.error('Refresh token error:', error);
        throw new Error('Ошибка обновления токена');
    }
};
