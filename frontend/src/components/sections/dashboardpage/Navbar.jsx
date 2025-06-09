import { Button } from "@/components/ui/button";
import { BookOpen, LogOut } from "lucide-react"; // Added LogOut icon
import { useNavigate } from "react-router-dom";
import { userService } from "@/lib/api";
import { useToastContext } from "@/contexts/ToastContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { success, error: showErrorToast } = useToastContext();

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    // Optimistically clear local storage.
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");

    if (token) {
      // Only attempt API logout if a token existed.
      try {
        await userService.logout();
        success("Logged out successfully! Redirecting...");
      } catch (err) {
        console.error("Logout API call failed:", err);
        if (err.status === 401) {
          showErrorToast(
            "Session expired or invalid. You have been logged out."
          );
        } else {
          showErrorToast(
            err.message ||
              "Logout failed on server, but you are logged out locally."
          );
        }
      }
    } else {
      // No token was found, user was already effectively logged out locally.
      success("You are now logged out. Redirecting...");
    }

    // Redirect to landing page after a short delay for the toast.
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <nav className="backdrop-blur-md bg-white/20 border-b border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-white mr-3" />
            <span
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "Frutiger, Arial, sans-serif" }}
            >
              Manga Central
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/30 flex items-center"
              style={{ fontFamily: "Frutiger, Arial, sans-serif" }}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
