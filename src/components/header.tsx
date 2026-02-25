import { Button } from "@/components/ui/button";

export default function Header() {
	return (
		<>
			<div className="w-full h-16 border-b border-gray-200 justify-center items-center flex">
				<div className="h-12 w-36 justify-center items-center flex">
					<Button variant="ghost">Войти</Button>
				</div>
			</div>
		</>
	);
}
