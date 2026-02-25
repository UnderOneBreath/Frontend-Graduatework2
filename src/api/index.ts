// Экспорт API client
export { apiClient } from './client';

// Экспорт всех типов
export * from './types';

// Экспорт endpoints из корневого конфига
export { API_ROUTES, BASE_API_URL } from '../../api.config';

// Экспорт auth сервиса
export * from './services/auth';

// Альтернативный способ импорта через namespace
import * as authService from './services/auth';

export { authService };
