// Общие типы для API ответов и ошибок

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export type AsyncApiResponse<T> = Promise<T>;
