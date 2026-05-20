import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LotteryShareButton() {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		const url = window.location.href;
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(url);
			} else {
				const ta = document.createElement("textarea");
				ta.value = url;
				ta.style.position = "fixed";
				ta.style.opacity = "0";
				document.body.appendChild(ta);
				ta.select();
				document.execCommand("copy");
				document.body.removeChild(ta);
			}
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch (e) {
			console.warn("[LotteryShareButton] copy failed:", e);
		}
	};

	return (
		<Button type="button" variant="outline" onClick={copy} aria-label="Поделиться">
			{copied ? <Check className="size-4 text-green-500" /> : <Share2 className="size-4" />}
			{copied ? "Скопировано" : "Поделиться"}
		</Button>
	);
}
