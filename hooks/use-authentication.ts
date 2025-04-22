"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface UseAuthenticationOptions {
  redirectTo?: string
  onSuccess?: () => void
}

interface AuthResult {
  success: boolean
  error?: string
}

export function useAuthentication(options: UseAuthenticationOptions = {}) {
  const { redirectTo = "/dashboard", onSuccess } = options
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (onSuccess) {
        onSuccess()
      } else {
        // Redirigir al dashboard después de iniciar sesión
        router.push(redirectTo)
        router.refresh()
      }

      return { success: true }
    } catch (error: any) {
      const errorMessage = error.message || "Error al iniciar sesión. Por favor, inténtalo de nuevo."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, userData?: Record<string, any>): Promise<AuthResult> => {
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) {
        throw error
      }

      if (onSuccess) {
        onSuccess()
      } else {
        // Redirigir a la página de verificación
        router.push("/auth/verificar-email")
      }

      return { success: true }
    } catch (error: any) {
      const errorMessage = error.message || "Error al registrarse. Por favor, inténtalo de nuevo."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<AuthResult> => {
    setIsLoading(true)

    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
      return { success: true }
    } catch (error: any) {
      console.error("Error during logout:", error)
      // Incluso si hay un error, intentar redirigir al usuario
      router.push("/")
      router.refresh()
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<AuthResult> => {
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/actualizar-password`,
      })

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error: any) {
      const errorMessage = error.message || "Error al enviar el correo de recuperación. Por favor, inténtalo de nuevo."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (password: string): Promise<AuthResult> => {
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      router.push("/dashboard")
      router.refresh()
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.message || "Error al actualizar la contraseña. Por favor, inténtalo de nuevo."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    setError,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
  }
}
