import { useState, FormEvent } from "react";

import { X, User, Lock, Eye, EyeOff, Mail } from "lucide-react";

export default function SignUpModal(props) {
  const { setIsSignUpOpen } = props;

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Sign up submitted");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsSignUpOpen(false)}
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
            onClick={() => setIsSignUpOpen(false)}
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
                Create an Account
              </h1>
              <p
                className="text-gray-600 font-medium"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Sign up
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">
              <div className="relative animate-in slide-in-from-top-2 duration-500">
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-purple-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-white/80 to-white/60 border-2 border-white/50 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 shadow-inner text-gray-800 placeholder-gray-500"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                    placeholder="Enter your email address"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none" />
                </div>
              </div>
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
