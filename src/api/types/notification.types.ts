export const NotificationType = {
	Win: "win",
	EndOfLottery: "endOfLottery",
	LotteryStartsSoon: "lotteryStartsSoon",
	TicketBuyApproval: "ticketBuyApproval",
	OrgRegReqApproval: "orgRegReqApproval",
	TicketBuyRejection: "ticketBuyRejection",
	OrgRegReqRejection: "orgRegReqRejection",
	AccountBan: "accountBan",
	LotteryCancellation: "lotteryCancellation",
	PostByOrg: "postByOrg",
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface NotificationResponse {
	id: string;
	type: NotificationType;
	message: string;
	author: string | null;
	receiver: string;
	lottery_id: string;
	created_at: string;
	updated_at: string;
}

export interface NotificationCreateRequest {
	type: NotificationType;
	message: string;
	author: string | null;
	receiver: string;
	lottery_id: string;
}

export interface NotificationUpdateRequest {
	type?: NotificationType;
	message?: string;
	author?: string | null;
	receiver?: string;
	lottery_id?: string;
}
