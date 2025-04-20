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
        router.push("/")
        router.refresh()
      } catch (error) {
        console.error("Error during logout:", error)
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
