import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "@/components/sections/global/Footer";
import { ToastProvider } from "@/contexts/ToastContext";
import "@/App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    // Redirect to dashboard if logged in and on the landing page
    if (token && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
    // Redirect to landing page if not logged in and trying to access dashboard
    if (!token && location.pathname === "/dashboard") {
      navigate("/", { replace: true });
    }
  }, [navigate, location.pathname]); // Rerun effect if navigate or pathname changes

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <Outlet />
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
