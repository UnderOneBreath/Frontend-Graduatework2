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

export interface RandomOrgDrawResult {
	winningSerials: number[];
	rawResponse: unknown;
}