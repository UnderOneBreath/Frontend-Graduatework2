import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, X } from "lucide-react";

interface ImageUploadProps {
	value: string;
	onChange: (base64: string) => void;
	onClear: () => void;
	hint?: string;
	height?: "sm" | "md";
}

export function ImageUpload({
	value,
	onChange,
	onClear,
	hint = "PNG, JPG, WebP до 5 МБ",
	height = "md",
}: ImageUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragOver, setDragOver] = useState(false);
	const heightClass = height === "sm" ? "h-28" : "h-40";

	function processFile(file: File) {
		if (!file.type.startsWith("image/")) return;
		const reader = new FileReader();
		reader.onload = (e) => onChange(e.target?.result as string);
		reader.readAsDataURL(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		setDragOver(false);
		const file = e.dataTransfer.files[0];
		if (file) processFile(file);
	}

	if (value) {
		return (
			<div className={`relative rounded-xl overflow-hidden border border-border ${heightClass} bg-muted`}>
				<img src={value} alt="Превью" className="w-full h-full object-cover" />
				<button
					type="button"
					onClick={onClear}
					className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full p-1 transition-colors"
					aria-label="Удалить изображение"
				>
					<X className="w-4 h-4" />
				</button>
			</div>
		);
	}

	return (
		<div
			className={`border-2 border-dashed rounded-xl ${heightClass} flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
				dragOver
					? "border-primary bg-primary/5"
					: "border-border hover:border-primary/60 hover:bg-muted/50"
			}`}
			onClick={() => inputRef.current?.click()}
			onDragOver={(e) => {
				e.preventDefault();
				setDragOver(true);
			}}
			onDragLeave={() => setDragOver(false)}
			onDrop={handleDrop}
		>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					const f = e.target.files?.[0];
					if (f) processFile(f);
				}}
			/>
			<UploadCloud className={`w-8 h-8 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
			<p className="text-sm text-muted-foreground text-center px-4">
				<span className="text-primary font-medium">Нажмите для загрузки</span> или перетащите файл
			</p>
			<p className="text-xs text-muted-foreground">{hint}</p>
		</div>
	);
}
