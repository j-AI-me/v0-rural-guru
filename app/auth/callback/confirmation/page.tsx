"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"

export default function VerificationPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) throw error

        if (data.session) {
          // Verificar si el email está verificado
          const { data: userData } = await supabase.auth.getUser()

          if (userData?.user?.email_confirmed_at) {
            setStatus("success")
          } else {
            setStatus("error")
            setError("Tu correo electrónico aún no ha sido verificado. Por favor, revisa tu bandeja de entrada.")
          }
        } else {
          setStatus("error")
          setError("No se pudo verificar tu correo electrónico. El enlace puede haber expirado.")
        }
      } catch (error: any) {
        setStatus("error")
        setError(error.message || "Ha ocurrido un error durante la verificación.")
      }
    }

    checkSession()
  }, [])

  const handleContinue = () => {
    router.push("/login")
  }

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === "loading" ? (
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            ) : status === "success" ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-center">
            {status === "loading"
              ? "Verificando tu email..."
              : status === "success"
                ? "¡Email verificado!"
                : "Error de verificación"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" ? (
            <p>Estamos verificando tu dirección de correo electrónico...</p>
          ) : status === "success" ? (
            <p>
              Tu dirección de correo electrónico ha sido verificada correctamente. Ya puedes iniciar sesión en tu
              cuenta.
            </p>
          ) : (
            <p className="text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status !== "loading" && (
            <Button onClick={handleContinue}>{status === "success" ? "Iniciar sesión" : "Volver al inicio"}</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
