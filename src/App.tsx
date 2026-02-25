import "tailwindcss";
import "@/index.css";
import Header from "@/components/header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as Pages from "@/pages";

function App() {
	return (
		<>
			<Router>
				<Header></Header>
				<Routes>
					<Route path="/" element={<Pages.PageMain />} />
					<Route path="/login" element={<Pages.Login />} />
					<Route path="/signup" element={<Pages.SignUp />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
