import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
	const navigate = useNavigate();
	const isLoggedIn = !!localStorage.getItem("userEmail");

	return (
		<>
			<div className="w-full h-16 border-b border-gray-200 justify-center items-center flex">
				<div className="h-12 flex items-center gap-2">
					<Link to="/">
						<Button variant="ghost">Главная</Button>
					</Link>
					{isLoggedIn ? (
						<Link to="/profile">
							<Button variant="default">Профиль</Button>
						</Link>
					) : (
						<Button variant="default" onClick={() => navigate("/login")}>
							Войти
						</Button>
					)}
				</div>
			</div>
		</>
	);
}
