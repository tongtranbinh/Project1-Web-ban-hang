import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/homePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

export default function AppRouter() {
  return (
    <Routes>
        {/* home page */}
        <Route path="/" element={<Home />} />
        {/* Auth Page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

    </Routes>
  );
}
