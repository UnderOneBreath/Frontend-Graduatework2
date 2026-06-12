import { useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";

interface LogoUploadProps {
	value: string;
	onChange: (v: string) => void;
	onClear: () => void;
}

export default function LogoUpload({ value, onChange, onClear }: LogoUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	function handleFile(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") onChange(reader.result);
		};
		reader.readAsDataURL(file);
	}

	if (value) {
		return (
			<div className="flex items-center gap-4">
				<img
					src={value}
					alt="Логотип"
					className="size-16 rounded-md object-contain border bg-muted"
				/>
				<Button type="button" variant="outline" size="sm" onClick={onClear}>
					<X className="size-4 mr-1" />
					Удалить
				</Button>
			</div>
		);
	}

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleFile}
			/>
			<Button
				type="button"
				variant="outline"
				onClick={() => inputRef.current?.click()}
			>
				<Upload className="size-4 mr-2" />
				Загрузить логотип
			</Button>
		</>
	);
}
