import type React from "react";
import { useState } from "react";
import { Link, Plus, AlertCircle } from "lucide-react";

interface LinkInputProps {
  onSubmit: (url: string) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  error?: string;
  validateUrl?: boolean;
}

const LinkInput: React.FC<LinkInputProps> = ({
  onSubmit,
  placeholder = "Enter manga website URL...",
  disabled = false,
  loading = false,
  className = "",
  error,
  validateUrl = true,
}) => {
  const [url, setUrl] = useState("");
  const [localError, setLocalError] = useState("");

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setLocalError("Please enter a URL");
      return;
    }

    if (validateUrl && !isValidUrl(url.trim())) {
      setLocalError("Please enter a valid URL");
      return;
    }

    setLocalError("");

    try {
      await onSubmit(url.trim());
      setUrl(""); // Clear input on successful submit
    } catch (err) {
      setLocalError("Failed to add manga. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (localError || error) {
      setLocalError("");
    }
  };

  const displayError = error || localError;

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Input Container */}
        <div className="relative flex items-center">
          {/* URL Icon */}
          <div className="absolute left-4 z-10 flex items-center pointer-events-none">
            <Link className="w-5 h-5 text-gray-400" />
          </div>

          {/* Input Field */}
          <input
            type="url"
            value={url}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            className={`
              w-full pl-12 pr-32 py-4 
              bg-white/80 backdrop-blur-xl 
              border rounded-2xl
              focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
              transition-all duration-200 
              placeholder-gray-500 text-gray-800
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                displayError
                  ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                  : "border-white/30 hover:border-white/50"
              }
            `}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={disabled || loading || !url.trim()}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              flex items-center space-x-2 
              px-6 py-2.5
              bg-gradient-to-r from-blue-500 to-purple-600 
              text-white font-semibold 
              rounded-xl shadow-lg 
              hover:shadow-xl hover:scale-[1.02]
              focus:ring-2 focus:ring-blue-500/50 focus:outline-none
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed 
              disabled:hover:scale-100 disabled:hover:shadow-lg
            "
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Submit</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {displayError && (
          <div className="flex items-center space-x-2 mt-3 px-4 py-2 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{displayError}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LinkInput;
