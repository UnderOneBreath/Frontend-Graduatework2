import axios from "axios";
import type{ JsonRpcResponse, RandomOrgDrawResult } from "@/api/types";
import { RANDOMIZER_SERVICE_RANOM_ORG } from "@/../api.config";

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

	const res = await axios.post<JsonRpcResponse>(RANDOMIZER_SERVICE_RANOM_ORG, body, {
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
