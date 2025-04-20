"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const logout = async () => {
      setIsLoggingOut(true)
      try {
        const supabase = createBrowserClient()
        await supabase.auth.signOut()

        // Asegurarse de que la redirección funcione correctamente
        router.push("/")
        router.refresh()
      } catch (error) {
        console.error("Error during logout:", error)
        // Incluso si hay un error, intentar redirigir al usuario
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1000)
      }
    }

    logout()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p>Cerrando sesión...</p>
    </div>
  )
}
