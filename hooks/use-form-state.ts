"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "@/contexts/form-context"
import { getSupabaseBrowserClient } from "@/lib/supabase"

interface UseFormStateOptions<T> {
  initialState: T
  onSuccess?: (data: any) => void
  successMessage?: string
  errorMessage?: string
}

export function useFormState<T extends Record<string, any>>({
  initialState,
  onSuccess,
  successMessage = "Operación completada con éxito",
  errorMessage = "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
}: UseFormStateOptions<T>) {
  const [formData, setFormData] = useState<T>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { isSubmitting, setIsSubmitting, handleError, showSuccess } = useForm()
  const supabase = getSupabaseBrowserClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData(initialState)
    setError(null)
    setSuccess(null)
  }

  const processSubmit = async (submitFn: () => Promise<any>) => {
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const result = await submitFn()

      if (onSuccess) {
        onSuccess(result)
      }

      setSuccess(successMessage)
      showSuccess(successMessage)
      return result
    } catch (err: any) {
      setError(err?.message || errorMessage)
      handleError(err, errorMessage)
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    error,
    setError,
    success,
    setSuccess,
    isSubmitting,
    handleChange,
    handleSelectChange,
    resetForm,
    processSubmit,
    supabase,
  }
}
