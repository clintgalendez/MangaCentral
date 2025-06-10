import { BookOpen, LogIn, UserPlus } from "lucide-react";

interface NavigationProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onLoginClick,
  onSignUpClick,
}) => {
  return (
    <nav className="relative">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/70 to-white/80 backdrop-blur-md border-b border-white/20 shadow-lg"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Manga Central
            </span>
          </div>

          {/* Desktop Navigation */}
          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-white/50 rounded-lg"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button
              onClick={onSignUpClick}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
