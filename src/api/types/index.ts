// Auth types
export type {
	// LoginCredentials,
	// LoginResponse,
	// RegisterData,
	// RegisterResponse,
	// RefreshTokenRequest,
	// RefreshTokenResponse,
	// CurrentUserResponse,
	LoginRequest,
	TokenResponse,
	ServerRefreshTokenRequest,
	SetPasswordRequest,
} from "./auth.types";

// User types
export type { UserResponse, UserCreateRequest, UserUpdateRequest } from "./user.types";

export { UserRole } from "./user.types";

// Common types
export type { ApiError, ApiResponse, AsyncApiResponse, BackendResponse } from "./common.types";

// Lottery types
export type {
	LotteryResponse,
	LotteryCreateRequest,
	LotteryUpdateRequest,
	PrizeResponse,
	PrizeCreateRequest,
	PrizeUpdateRequest,
	TicketResponse,
	TicketCreateRequest,
	NotificationResponse,
	NotificationCreateRequest,
} from "./lottery.types";

export { LotteryStatus } from "./lottery.types";

// Company types
export type {
	CompanyResponse,
	CompanyCreateRequest,
	CompanyUpdateRequest,
} from "./company.types";
