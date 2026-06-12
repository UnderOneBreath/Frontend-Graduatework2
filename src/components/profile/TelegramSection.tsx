import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { genTelegramCode, getTelegramId } from "@/api/services/user";
import ProfileSection from "./ProfileSection";

interface TelegramSectionProps {
	userId: string;
}

export default function TelegramSection({ userId }: TelegramSectionProps) {
	const [telegramId, setTelegramId] = useState<number | null>(null);
	const [code, setCode] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const pollRef = useRef<number | null>(null);

	useEffect(() => {
		let cancelled = false;
		getTelegramId(userId)
			.then((res) => {
				if (cancelled) return;
				setTelegramId(res.telegram_id ?? null);
			})
			.catch(() => {
				if (cancelled) return;
				setTelegramId(null);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [userId]);

	useEffect(() => {
		if (!code || telegramId) return;
		pollRef.current = window.setInterval(async () => {
			try {
				const res = await getTelegramId(userId);
				if (res.telegram_id) {
					setTelegramId(res.telegram_id);
					setCode(null);
				}
			} catch {
				// тихо игнорируем ошибку поллинга
			}
		}, 4000);
		return () => {
			if (pollRef.current !== null) {
				clearInterval(pollRef.current);
				pollRef.current = null;
			}
		};
	}, [code, telegramId, userId]);

	async function handleGenerate() {
		setGenerating(true);
		setError(null);
		try {
			const res = await genTelegramCode(userId);
			setCode(res.telegram_code);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Не удалось сгенерировать код");
		} finally {
			setGenerating(false);
		}
	}

	if (loading) {
		return (
			<ProfileSection title="Telegram" description="Получайте уведомления в Telegram.">
				<p className="text-sm text-muted-foreground">Загрузка...</p>
			</ProfileSection>
		);
	}

	if (telegramId) {
		return (
			<ProfileSection
				title="Telegram"
				description="Уведомления приходят в Telegram."
			>
				<p className="text-sm text-foreground">Telegram привязан (id {telegramId}).</p>
			</ProfileSection>
		);
	}

	return (
		<ProfileSection
			title="Telegram"
			description="Привяжите Telegram, чтобы получать уведомления о розыгрышах."
			action={
				!code && (
					<Button variant="outline" onClick={handleGenerate} disabled={generating}>
						{generating ? "..." : "Привязать Telegram"}
					</Button>
				)
			}
		>
			{code ? (
				<div className="flex flex-col gap-3">
					<p className="text-sm text-foreground">
						Отсканируйте QR-код, чтобы открыть бота:
					</p>
					<div className="p-3 bg-white rounded-md w-fit">
						<QRCodeSVG
							value={`https://t.me/GiveawayCourseWork_bot?start=${code}`}
							size={160}
							level="M"
						/>
					</div>
					<p className="text-xs text-muted-foreground">
						Ожидаем подтверждение от бота...
					</p>
				</div>
			) : (
				<p className="text-sm text-muted-foreground">
					После привязки сюда будут приходить уведомления о результатах.
				</p>
			)}
			{error && <p className="text-sm text-destructive mt-2">{error}</p>}
		</ProfileSection>
	);
}
