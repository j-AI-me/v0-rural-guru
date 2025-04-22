"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface FormContextProps {
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  handleError: (error: any, defaultMessage?: string) => void
  showSuccess: (message: string) => void
}

const FormContext = createContext<FormContextProps | undefined>(undefined)

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleError = (error: any, defaultMessage = "Ha ocurrido un error. Por favor, inténtalo de nuevo.") => {
    console.error("Error:", error)
    toast({
      title: "Error",
      description: error?.message || defaultMessage,
      variant: "destructive",
    })
  }

  const showSuccess = (message: string) => {
    toast({
      title: "Éxito",
      description: message,
    })
  }

  return (
    <FormContext.Provider value={{ isSubmitting, setIsSubmitting, handleError, showSuccess }}>
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useForm debe usarse dentro de un FormProvider")
  }
  return context
}
