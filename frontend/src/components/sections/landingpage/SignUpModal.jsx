import { useState } from "react";
import { X, User, Lock, Eye, EyeOff, Mail, UserPlus, Loader2 } from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useToastContext } from "@/contexts/ToastContext"; // Changed this line
import { validationRules } from "@/lib/validations";
import { userService } from "@/lib/api";

const signUpValidationRules = {
  username: [validationRules.required, validationRules.username],
  email: [validationRules.required, validationRules.email],
  password: [validationRules.required, validationRules.minLength(8)],
  confirmPassword: [validationRules.required, validationRules.passwordMatch],
};

export default function SignUpModal(props) {
  const { setIsSignUpOpen, setIsLoginOpen } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { success, error } = useToastContext(); // Changed this line

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset
  } = useFormValidation(
    {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    signUpValidationRules
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      error('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        password2: values.confirmPassword
      };

      const response = await userService.register(userData);
      
      success('Account created successfully! Welcome to Manga Central!');
      
      // Store token if needed
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userInfo', JSON.stringify(response.user_info));
      }

      // Reset form and close modal
      reset();
      setTimeout(() => {
        setIsSignUpOpen(false);
      }, 1000);

    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.status === 400 && err.errors) {
        // Handle field-specific errors
        if (err.errors.username) {
          error(`Username: ${err.errors.username[0]}`);
        }
        if (err.errors.email) {
          error(`Email: ${err.errors.email[0]}`);
        }
        if (err.errors.password) {
          error(`Password: ${err.errors.password[0]}`);
        }
        if (err.errors.password2) {
          error(`Confirm Password: ${err.errors.password2[0]}`);
        }
        if (err.errors.non_field_errors) {
          error(err.errors.non_field_errors[0]);
        }
      } else {
        error(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
  };

  return (
    <>
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
              disabled={isSubmitting}
              className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-red-300/50 disabled:opacity-50"
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      <User size={18} className="text-purple-500" />
                    </div>
                    <input
                      type="text"
                      value={values.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      onBlur={() => handleBlur('username')}
                      className={`w-full pl-12 pr-4 py-4 bg-gradient-to-br from-white/80 to-white/60 border-2 rounded-2xl focus:outline-none transition-all duration-300 shadow-inner text-gray-800 placeholder-gray-500 ${
                        getFieldError('username') 
                          ? 'border-red-400 focus:border-red-400' 
                          : 'border-white/50 focus:border-purple-400'
                      }`}
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                      placeholder="Enter your username"
                      disabled={isSubmitting}
                      required
                    />
                    <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none" />
                  </div>
                  {getFieldError('username') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError('username')}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="relative">
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
                      value={values.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`w-full pl-12 pr-4 py-4 bg-gradient-to-br from-white/80 to-white/60 border-2 rounded-2xl focus:outline-none transition-all duration-300 shadow-inner text-gray-800 placeholder-gray-500 ${
                        getFieldError('email') 
                          ? 'border-red-400 focus:border-red-400' 
                          : 'border-white/50 focus:border-purple-400'
                      }`}
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                      placeholder="Enter your email address"
                      disabled={isSubmitting}
                      required
                    />
                    <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none" />
                  </div>
                  {getFieldError('email') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError('email')}</p>
                  )}
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
                      <Lock size={18} className="text-purple-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      className={`w-full pl-12 pr-12 py-4 bg-gradient-to-br from-white/80 to-white/60 border-2 rounded-2xl focus:outline-none transition-all duration-300 shadow-inner text-gray-800 placeholder-gray-500 ${
                        getFieldError('password') 
                          ? 'border-red-400 focus:border-red-400' 
                          : 'border-white/50 focus:border-purple-400'
                      }`}
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                      placeholder="Enter your password"
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors text-purple-500 hover:text-purple-600"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none" />
                  </div>
                  {getFieldError('password') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError('password')}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-purple-500" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={values.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`w-full pl-12 pr-12 py-4 bg-gradient-to-br from-white/80 to-white/60 border-2 rounded-2xl focus:outline-none transition-all duration-300 shadow-inner text-gray-800 placeholder-gray-500 ${
                        getFieldError('confirmPassword') 
                          ? 'border-red-400 focus:border-red-400' 
                          : 'border-white/50 focus:border-purple-400'
                      }`}
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                      placeholder="Confirm your password"
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-500 hover:text-purple-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none" />
                  </div>
                  {getFieldError('confirmPassword') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError('confirmPassword')}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border relative overflow-hidden bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus size={20} />
                        Create Account
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Log In Link */}
              <p
                className="text-center mt-6 text-gray-600"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setIsSignUpOpen(false);
                    setIsLoginOpen(true);
                  }}
                  disabled={isSubmitting}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors disabled:opacity-50"
                >
                  Log in
                </button>
              </p>
            </div>

            {/* Bottom Highlight */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>

          {/* Outer Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl -z-10 scale-110" />
        </div>
      </div>
    </>
  );
}