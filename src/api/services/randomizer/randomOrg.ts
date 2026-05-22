import axios from "axios";

const ENDPOINT = "https://api.random.org/json-rpc/4/invoke";

interface JsonRpcResponse {
	jsonrpc: "2.0";
	id: number;
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
	error?: { code: number; message: string };
}

export interface RandomOrgDrawResult {
	winningSerials: number[];
	rawResponse: unknown;
}

export async function drawWithRandomOrg(
	prizesCount: number,
	ticketsCount: number,
): Promise<RandomOrgDrawResult> {
	const apiKey = import.meta.env.VITE_RANDOM_ORG_API_KEY;
	if (!apiKey) {
		throw new Error("VITE_RANDOM_ORG_API_KEY не задан в .env");
	}
	if (prizesCount < 1) throw new Error("prizesCount must be ≥ 1");
	if (ticketsCount < prizesCount) {
		throw new Error("Недостаточно тикетов для розыгрыша всех призов");
	}

	const body = {
		jsonrpc: "2.0" as const,
		method: "generateIntegers",
		params: {
			apiKey,
			n: prizesCount,
			min: 1,
			max: ticketsCount,
			replacement: false,
		},
		id: Date.now(),
	};

	const res = await axios.post<JsonRpcResponse>(ENDPOINT, body, {
		headers: { "Content-Type": "application/json" },
		timeout: 15000,
	});

	if (res.data.error) {
		throw new Error(`RANDOM.ORG: ${res.data.error.message}`);
	}
	if (!res.data.result) {
		throw new Error("RANDOM.ORG вернул пустой ответ");
	}

	return {
		winningSerials: res.data.result.random.data,
		rawResponse: res.data,
	};
}
