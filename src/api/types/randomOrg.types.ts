export interface JsonRpcResponse {
	jsonrpc: "2.0";
	result?: {
		random: {
			data: number[];
			completionTime: string;
		};
		bitsUsed: number;
		bitsLeft: number;
		requestsLeft: number;
		advisoryDelay: number;
	};
	id: number;
	error?: { code: number; message: string };
}

export interface RandomOrgUserData {
	lotteryId: string;
	participantsHash: string;
}

export interface SignedRandomBlock {
	method: string;
	hashedApiKey: string;
	n: number;
	min: number;
	max: number;
	replacement: boolean;
	base: number;
	data: number[];
	completionTime: string;
	serialNumber: number;
	userData: RandomOrgUserData;
}

export interface SignedJsonRpcResponse {
	jsonrpc: "2.0";
	result?: {
		random: SignedRandomBlock;
		signature: string;
		bitsUsed: number;
		bitsLeft: number;
		requestsLeft: number;
		advisoryDelay: number;
	};
	id: number;
	error?: { code: number; message: string };
}

export interface RandomOrgDrawResult {
	winningSerials: number[];
	rawResponse: unknown;
	signature: string;
	signedRandom: SignedRandomBlock;
}
