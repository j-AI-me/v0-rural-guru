"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Obtener el token y tipo de la URL
        const token_hash = searchParams?.get("token_hash")
        const type = searchParams?.get("type")

        if (token_hash && type) {
          // Verificar el token con Supabase
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          })

          if (error) {
            throw error
          }

          setVerificationStatus("success")
        } else {
          setVerificationStatus("error")
          setErrorMessage("Enlace de verificación inválido o expirado.")
        }
      } catch (error: any) {
        console.error("Error de verificación:", error)
        setVerificationStatus("error")
        setErrorMessage(error.message || "Error al verificar el email.")
      }
    }

    handleEmailVerification()
  }, [searchParams, router])

  const handleContinue = () => {
    router.push("/login")
  }

  const handleRetry = () => {
    router.push("/register")
  }

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {verificationStatus === "loading" ? (
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            ) : verificationStatus === "success" ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-center">
            {verificationStatus === "loading"
              ? "Verificando tu email..."
              : verificationStatus === "success"
                ? "¡Email verificado!"
                : "Error de verificación"}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "loading"
              ? "Estamos verificando tu dirección de email..."
              : verificationStatus === "success"
                ? "Tu dirección de email ha sido verificada correctamente."
                : errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStatus === "success" && (
            <p className="text-center text-muted-foreground">
              Ahora puedes iniciar sesión en tu cuenta y comenzar a usar todas las funcionalidades de RuralGuru.
            </p>
          )}
          {verificationStatus === "error" && (
            <p className="text-center text-muted-foreground">
              El enlace de verificación puede haber expirado o ser inválido. Por favor, intenta registrarte nuevamente o
              solicita un nuevo enlace de verificación.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {verificationStatus === "success" ? (
            <Button onClick={handleContinue}>Iniciar sesión</Button>
          ) : verificationStatus === "error" ? (
            <Button onClick={handleRetry}>Volver al registro</Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  )
}
