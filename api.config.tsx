export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8000'     // users / auth
export const BASE_LOTTERY_URL = import.meta.env.VITE_BASE_LOTTERY_URL || 'http://localhost:8001' // lottery сервис
export const BASE_ORGANIZER_URL = import.meta.env.VITE_BASE_ORGANIZER_URL || 'http://localhost:8002' // organizer сервис
export const BASE_NOTIFICATIONS_URL = import.meta.env.VITE_BASE_NOTIFICATIONS_URL || 'http://localhost:8003' // notifications сервис

//External randomizer services
export const RANDOMIZER_SERVICE_RANOM_ORG = 'https://api.random.org/json-rpc/4/invoke';

export const API_ROUTES = {
    auth: {
        login: `${BASE_API_URL}/auth/login`,
        register: `${BASE_API_URL}/auth/register`,
        refresh: `${BASE_API_URL}/auth/refresh-token`,
    },
    users: {
        list: `${BASE_API_URL}/users/`,
        get: (id: string) => `${BASE_API_URL}/users/${id}`,
        genTelegramCode: (id: string) => `${BASE_API_URL}/users/${id}/gen-telegram-code`,
        telegramId: (id: string) => `${BASE_API_URL}/users/${id}/telegram-id`,
    },
    lotteries: {
        list: `${BASE_LOTTERY_URL}/lotteries/`,
        get: (id: string) => `${BASE_LOTTERY_URL}/lotteries/${id}`,
    },
    prizes: {
        byLottery: (lotteryId: string) => `${BASE_LOTTERY_URL}/prizes/lottery/${lotteryId}`,
    },
    tickets: {
        list: `${BASE_LOTTERY_URL}/tickets/`,
        byLottery: (lotteryId: string) => `${BASE_LOTTERY_URL}/tickets/lottery/${lotteryId}`,
        byUser: (userId: string) => `${BASE_LOTTERY_URL}/tickets/user/${userId}`,
        winners: (lotteryId: string) => `${BASE_LOTTERY_URL}/tickets/winners/${lotteryId}`,
        buy: (lotteryId: string) => `${BASE_LOTTERY_URL}/tickets/${lotteryId}/buy_tickets`,
        setWinner: (ticketId: string) => `${BASE_LOTTERY_URL}/tickets/${ticketId}/set-winner`,
        changeStatus: (ticketId: string) => `${BASE_LOTTERY_URL}/tickets/${ticketId}/change-status`,
        bulkCreate: `${BASE_LOTTERY_URL}/tickets/create-tickets`,
    },
    notifications: {
        list: `${BASE_NOTIFICATIONS_URL}/notifications/`,
        get: (id: string) => `${BASE_NOTIFICATIONS_URL}/notifications/${id}`,
    },
    organizers: {
        list: `${BASE_ORGANIZER_URL}/organizers/`,
        get: (organizer_id: string) => `${BASE_ORGANIZER_URL}/organizers/${organizer_id}`,

    },
    requests: {
        list: `${BASE_ORGANIZER_URL}/requests/`,
        get: (id: string) => `${BASE_ORGANIZER_URL}/requests/${id}`,
        byUser: (userId: string) => `${BASE_ORGANIZER_URL}/requests/by-user/${userId}`,
    },
}
