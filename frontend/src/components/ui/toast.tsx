"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

export interface ToastProps {
  id?: string
  title: string
  description?: string
  variant?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose?: () => void
}

const variantStyles = {
  success: {
    gradient: "from-emerald-400/90 via-green-500/90 to-emerald-600/90",
    border: "border-emerald-300/50",
    shadow: "shadow-emerald-500/25",
    icon: CheckCircle,
    iconColor: "text-emerald-100",
  },
  error: {
    gradient: "from-red-400/90 via-rose-500/90 to-red-600/90",
    border: "border-red-300/50",
    shadow: "shadow-red-500/25",
    icon: AlertCircle,
    iconColor: "text-red-100",
  },
  warning: {
    gradient: "from-amber-400/90 via-orange-500/90 to-amber-600/90",
    border: "border-amber-300/50",
    shadow: "shadow-amber-500/25",
    icon: AlertTriangle,
    iconColor: "text-amber-100",
  },
  info: {
    gradient: "from-blue-400/90 via-cyan-500/90 to-blue-600/90",
    border: "border-blue-300/50",
    shadow: "shadow-blue-500/25",
    icon: Info,
    iconColor: "text-blue-100",
  },
}

export function Toast({ title, description, variant = "info", onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const style = variantStyles[variant]
  const Icon = style.icon

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Add auto-close timer
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-md
        transition-all duration-300 ease-out transform
        ${style.border} ${style.shadow}
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}
        shadow-2xl
      `}
      style={{
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.25) 0%, 
          rgba(255, 255, 255, 0.1) 50%, 
          rgba(255, 255, 255, 0.05) 100%
        )`,
      }}
    >
      {/* Aero glass overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`}
        style={{
          mixBlendMode: "multiply",
        }}
      />

      {/* Glossy highlight */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent"
        style={{
          borderRadius: "inherit",
        }}
      />

      {/* Content */}
      <div className="relative p-4 flex items-start gap-3">
        <div className={`flex-shrink-0 ${style.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm leading-tight drop-shadow-sm">{title}</h4>
          {description && <p className="mt-1 text-white/90 text-xs leading-relaxed drop-shadow-sm">{description}</p>}
        </div>

        <button
          onClick={handleClose}
          className="
            flex-shrink-0 p-1 rounded-full transition-all duration-200
            hover:bg-white/20 active:bg-white/30 active:scale-95
            text-white/80 hover:text-white
            backdrop-blur-sm
          "
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar for timed toasts */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full bg-white/40 transition-all ease-linear"
            style={{
              width: "100%",
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  )
}