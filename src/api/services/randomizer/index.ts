import { RandomizerProvider, RANDOMIZER_REGISTRY } from "@/api/types/randomizer.types";
import type { RandomizerResult } from "@/api/types/randomizer.types";
import type { RandomOrgUserData } from "@/api/types";
import { drawWithRandomOrg } from "./randomOrg";

export async function drawWinners(
	provider: RandomizerProvider,
	prizesCount: number,
	ticketsCount: number,
	userData: RandomOrgUserData,
): Promise<RandomizerResult> {
	const requestedAt = new Date().toISOString();
	const meta = RANDOMIZER_REGISTRY[provider];

	// Вырожденный случай: один участник. Победитель определяется без рандомайзера —
	// выбор случайного числа из диапазона в одно значение не нужен и невозможен
	// (RANDOM.ORG отклоняет запрос с min === max). Не зависит от провайдера.
	if (ticketsCount === 1) {
		if (ticketsCount < prizesCount) {
			throw new Error("Недостаточно тикетов для розыгрыша всех призов");
		}
		return {
			provider,
			requestedAt,
			winningSerials: Array.from({ length: prizesCount }, () => 1),
			rawResponse: {
				note: "single-participant draw: winner assigned without randomizer",
			},
			verifyUrl: meta.verifyUrl,
		};
	}

	switch (provider) {
		case RandomizerProvider.RandomOrg: {
			const { winningSerials, signature, signedRandom, rawResponse } =
				await drawWithRandomOrg(prizesCount, ticketsCount, userData);
			return {
				provider,
				requestedAt,
				winningSerials,
				rawResponse,
				verifyUrl: meta.verifyUrl,
				signature,
				signedRandom,
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
