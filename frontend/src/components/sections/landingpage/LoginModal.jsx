import { useState } from "react";

import { X, User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginModal(props) {
  const { setIsLoginOpen } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsLoginOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md">
        {/* Main Container with Aero Glass Effect */}
        <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
          {/* Top Highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          {/* Side Highlights */}
          <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/60 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-white/60 via-transparent to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => setIsLoginOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-red-300/50"
          >
            <X size={16} />
          </button>

          {/* Content */}
          <div className="p-8 pt-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white/50">
                <User size={32} className="text-white" />
              </div>
              <h1
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Welcome Back
              </h1>
              <p
                className="text-gray-600 font-medium"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Sign in to your account
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">
              {/* Username Field */}
              <div className="relative">
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-blue-500" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-white/80 to-white/60 border-2 border-white/50 rounded-2xl focus:border-blue-400 focus:outline-none transition-all duration-300 shadow-inner text-gray-800 placeholder-gray-500"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                    placeholder="Enter your username"
                  />
                  {/* Inner shadow effect */}
                  <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none" />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-blue-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gradient-to-br from-white/80 to-white/60 border-2 border-white/50 rounded-2xl focus:border-blue-400 focus:outline-none transition-all duration-300 shadow-inner text-gray-800 placeholder-gray-500"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {/* Inner shadow effect */}
                  <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none" />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-white/80 border-2 border-white/50 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span
                    className="ml-2 text-sm text-gray-700 font-medium"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                  >
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-blue-400/50 relative overflow-hidden"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {/* Button highlight */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl" />
                <span className="relative z-10">Sign In</span>
              </button>
            </form>

            {/* Sign Up Link */}
            <p
              className="text-center mt-6 text-gray-600"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Don't have an account?{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>

          {/* Bottom Highlight */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>

        {/* Outer Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl -z-10 scale-110" />
      </div>
    </div>
  );
}
