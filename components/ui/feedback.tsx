"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const feedbackVariants = cva(
  "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        success: "bg-green-100 text-green-800 border border-green-200",
        error: "bg-red-100 text-red-800 border border-red-200",
        warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        info: "bg-blue-100 text-blue-800 border border-blue-200",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
)

interface FeedbackProps extends VariantProps<typeof feedbackVariants> {
  message: string
  duration?: number
  onClose?: () => void
}

export function Feedback({ message, variant, duration = 5000, onClose }: FeedbackProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "error":
        return <XCircle className="h-5 w-5" />
      case "warning":
        return <AlertCircle className="h-5 w-5" />
      case "info":
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className={cn(feedbackVariants({ variant }))}>
      {getIcon()}
      <span>{message}</span>
      <button onClick={handleClose} className="ml-2 rounded-full p-1 hover:bg-black/10" aria-label="Cerrar">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Hook para usar el componente de feedback
export function useFeedback() {
  const [feedback, setFeedback] = useState<{
    message: string
    variant: "success" | "error" | "warning" | "info"
    isVisible: boolean
  } | null>(null)

  const showFeedback = (message: string, variant: "success" | "error" | "warning" | "info") => {
    setFeedback({ message, variant, isVisible: true })
  }

  const hideFeedback = () => {
    setFeedback(null)
  }

  const success = (message: string) => showFeedback(message, "success")
  const error = (message: string) => showFeedback(message, "error")
  const warning = (message: string) => showFeedback(message, "warning")
  const info = (message: string) => showFeedback(message, "info")

  return {
    Feedback:
      feedback && feedback.isVisible ? (
        <Feedback message={feedback.message} variant={feedback.variant} onClose={hideFeedback} />
      ) : null,
    success,
    error,
    warning,
    info,
    hideFeedback,
  }
}
