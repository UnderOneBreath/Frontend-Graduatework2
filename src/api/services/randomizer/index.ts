import { RandomizerProvider, RANDOMIZER_REGISTRY } from "@/api/types/randomizer.types";
import type { RandomizerResult } from "@/api/types/randomizer.types";
import { drawWithRandomOrg } from "./randomOrg";

export async function drawWinners(
	provider: RandomizerProvider,
	prizesCount: number,
	ticketsCount: number,
): Promise<RandomizerResult> {
	const requestedAt = new Date().toISOString();
	const meta = RANDOMIZER_REGISTRY[provider];

	switch (provider) {
		case RandomizerProvider.RandomOrg: {
			const { winningSerials, rawResponse } = await drawWithRandomOrg(
				prizesCount,
				ticketsCount,
			);
			return {
				provider,
				requestedAt,
				winningSerials,
				rawResponse,
				verifyUrl: meta.verifyUrl,
			};
		}
		case RandomizerProvider.RandomPicker:
		case RandomizerProvider.ChainlinkVrf:
			throw new Error(`${meta.name}: интеграция пока не реализована`);
		default: {
			const _exhaustive: never = provider;
			throw new Error(`Unknown randomizer provider: ${_exhaustive}`);
		}
	}
}

export { drawWithRandomOrg } from "./randomOrg";
