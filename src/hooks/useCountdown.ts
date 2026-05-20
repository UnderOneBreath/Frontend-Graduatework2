import { useEffect, useState } from "react";

export interface Countdown {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	totalMs: number;
	isFinished: boolean;
}

function compute(target: number): Countdown {
	const diff = target - Date.now();
	if (diff <= 0) {
		return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isFinished: true };
	}
	const totalSec = Math.floor(diff / 1000);
	return {
		days: Math.floor(totalSec / 86400),
		hours: Math.floor((totalSec % 86400) / 3600),
		minutes: Math.floor((totalSec % 3600) / 60),
		seconds: totalSec % 60,
		totalMs: diff,
		isFinished: false,
	};
}

export function useCountdown(endDate: string | null | undefined): Countdown {
	const target = endDate ? new Date(endDate).getTime() : 0;
	const [, forceTick] = useState(0);

	useEffect(() => {
		if (!endDate) return;
		const id = window.setInterval(() => {
			forceTick((t) => t + 1);
		}, 1000);
		return () => window.clearInterval(id);
	}, [endDate]);

	return compute(target);
}
