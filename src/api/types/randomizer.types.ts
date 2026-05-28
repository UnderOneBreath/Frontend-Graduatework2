import type { SignedRandomBlock } from "./randomOrg.types";

export const RandomizerProvider = {
	RandomOrg: "random_org",
	RandomPicker: "random_picker",
	ChainlinkVrf: "chainlink_vrf",
} as const;

export type RandomizerProvider = typeof RandomizerProvider[keyof typeof RandomizerProvider];

export interface RandomizerMetadata {
	id: RandomizerProvider;
	name: string;
	description: string;
	docsUrl: string;
	verifyUrl?: string;
	supported: boolean;
}

export interface ParticipantSnapshotEntry {
	index: number;
	serial: string;
	ticketId: string;
}

export interface RandomizerResult {
	provider: RandomizerProvider;
	requestedAt: string;
	winningSerials: number[];
	rawResponse: unknown;
	verifyUrl?: string;
	signature?: string;
	signedRandom?: SignedRandomBlock;
	participantsSnapshot?: ParticipantSnapshotEntry[];
}

export const RANDOMIZER_REGISTRY: Record<RandomizerProvider, RandomizerMetadata> = {
	[RandomizerProvider.RandomOrg]: {
		id: RandomizerProvider.RandomOrg,
		name: "RANDOM.ORG",
		description: "Атмосферный шум как источник энтропии. Подписанный JSON-RPC API с публичной формой верификации.",
		docsUrl: "https://api.random.org/json-rpc/4/signing",
		verifyUrl: "https://api.random.org/signatures/form",
		supported: true,
	},
	[RandomizerProvider.RandomPicker]: {
		id: RandomizerProvider.RandomPicker,
		name: "RandomPicker.com",
		description: "Сервис проведения розыгрышей с публичной страницей результата.",
		docsUrl: "https://randompicker.com/Help/API",
		supported: false,
	},
	[RandomizerProvider.ChainlinkVrf]: {
		id: RandomizerProvider.ChainlinkVrf,
		name: "Chainlink VRF",
		description: "Проверяемый случайный сигнал из блокчейна. Требует кошелька и газа.",
		docsUrl: "https://docs.chain.link/vrf",
		supported: false,
	},
};
