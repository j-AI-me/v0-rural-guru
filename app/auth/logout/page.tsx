"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
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
