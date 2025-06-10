import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          bgGradient: "from-green-500/20 to-emerald-500/20",
          borderColor: "border-green-500/30",
          iconColor: "text-green-600",
          titleColor: "text-green-800",
          progressColor: "bg-green-500",
        };
      case "error":
        return {
          icon: AlertCircle,
          bgGradient: "from-red-500/20 to-pink-500/20",
          borderColor: "border-red-500/30",
          iconColor: "text-red-600",
          titleColor: "text-red-800",
          progressColor: "bg-red-500",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          bgGradient: "from-yellow-500/20 to-orange-500/20",
          borderColor: "border-yellow-500/30",
          iconColor: "text-yellow-600",
          titleColor: "text-yellow-800",
          progressColor: "bg-yellow-500",
        };
      case "info":
      default:
        return {
          icon: Info,
          bgGradient: "from-blue-500/20 to-purple-500/20",
          borderColor: "border-blue-500/30",
          iconColor: "text-blue-600",
          titleColor: "text-blue-800",
          progressColor: "bg-blue-500",
        };
    }
  };

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`
        relative w-full max-w-sm bg-white/90 backdrop-blur-xl border ${
          config.borderColor
        } rounded-2xl shadow-2xl overflow-hidden
        transform transition-all duration-300 ease-out
        ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }
        ${isExiting ? "translate-x-full opacity-0 scale-95" : ""}
      `}
    >
      {/* Glass morphism overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} rounded-2xl`}
      />

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
          <div
            className={`h-full ${config.progressColor} animate-progress-bar`}
            style={{
              animation: `progress-bar ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <div className="relative z-10 p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div
            className={`flex-shrink-0 p-2 bg-white/50 backdrop-blur-sm rounded-xl ${config.iconColor}`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${config.titleColor} mb-1`}>
              {title}
            </h4>
            {message && (
              <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-all duration-200 hover:scale-110 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    </div>
  );
};

export default Toast;
