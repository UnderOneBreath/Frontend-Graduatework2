import { apiClient } from '../../client';

/**
 * Функция выхода из системы
 * Очищает токены и выполняет запрос на сервер для инвалидации сессии
 */
export const logout = async (): Promise<void> => {
    try {
        // Отправляем запрос на сервер для инвалидации токена
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
        // Даже если запрос на сервер не прошёл, всё равно очищаем локальные токены
    } finally {
        // Очищаем токены из localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};
