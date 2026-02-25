import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
	return (
		<>
			<div className="w-full h-16 border-b border-gray-200 justify-center items-center flex">
				<div className="h-12 w-36 justify-center items-center flex">
					<Link to="/">
						<Button variant="ghost">Главная</Button>
					</Link>
					<Link to="/profile">
						<Button variant="ghost">Профиль</Button>
					</Link>
					<Link to="/login">
						<Button variant="default">Войти</Button>
					</Link>
				</div>
			</div>
		</>
	);
}
