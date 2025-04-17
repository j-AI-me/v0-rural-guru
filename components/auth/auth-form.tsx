"use client"

import Link from "next/link"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Mail, Loader2 } from "lucide-react"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [verificationSent, setVerificationSent] = useState(false)
  const [userRole, setUserRole] = useState<"guest" | "host">("guest")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        // Obtener el rol del usuario
        const { data: userData, error } = await supabase.from("users").select("role").eq("id", data.user.id).single()

        if (!error && userData) {
          // Redirigir según el rol
          if (userData.role === "host") {
            router.push("/host-dashboard")
          } else if (userData.role === "admin") {
            router.push("/admin")
          } else {
            router.push("/guest-dashboard")
          }
        } else {
          router.push("/")
        }
      }
    }

    checkUser()
  }, [router])

  // Verificar si hay un parámetro de tipo en la URL (para registro de anfitrión)
  useEffect(() => {
    const type = searchParams?.get("type")
    if (type === "host") {
      setUserRole("host")
    }
  }, [searchParams])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Iniciar sesión con Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Verificar si el email está confirmado
      if (!data.user.email_confirmed_at) {
        toast({
          title: "Email no verificado",
          description: "Por favor, verifica tu email antes de iniciar sesión.",
          variant: "destructive",
        })

        // Reenviar email de verificación
        await supabase.auth.resend({
          type: "signup",
          email: email,
        })

        setLoading(false)
        setVerificationSent(true)
        return
      }

      // Verificar si el usuario existe en nuestra tabla personalizada
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (userError && userError.code !== "PGRST116") {
        // Si hay un error diferente a "no se encontró ningún registro"
        throw userError
      }

      // Si el usuario no existe en nuestra tabla personalizada, crearlo
      if (!userData) {
        try {
          // Usar el token de acceso del usuario autenticado
          const { error: insertError } = await supabase.from("users").insert({
            id: data.user.id,
            email: email,
            full_name: data.user.user_metadata.full_name || email.split("@")[0],
            role: "guest", // Rol predeterminado
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error al crear usuario en tabla personalizada:", insertError)
            // Continuar aunque haya error, ya que el usuario se autenticó correctamente
          }
        } catch (insertCatchError) {
          console.error("Error capturado al insertar usuario:", insertCatchError)
        }
      }

      // Obtener el rol del usuario
      const { data: roleData } = await supabase.from("users").select("role").eq("id", data.user.id).single()

      // Redirigir según el rol
      if (roleData?.role === "host") {
        router.push("/host-dashboard")
      } else if (roleData?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/guest-dashboard")
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente",
      })
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Registrar usuario con Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
      })

      if (error) throw error

      // Crear usuario en nuestra tabla personalizada
      if (data.user) {
        try {
          const { error: insertError } = await supabase.from("users").insert({
            id: data.user.id,
            email: email,
            full_name: fullName || email.split("@")[0],
            role: userRole, // Usar el rol seleccionado
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error al crear usuario en tabla personalizada:", insertError)
            toast({
              title: "Registro parcialmente completado",
              description: "Tu cuenta se creó pero hubo un problema con tu perfil. Por favor contacta a soporte.",
              variant: "destructive",
            })
          } else {
            setVerificationSent(true)
            toast({
              title: "Registro exitoso",
              description:
                "Hemos enviado un enlace de verificación a tu email. Por favor, verifica tu cuenta para continuar.",
            })
          }
        } catch (insertCatchError) {
          console.error("Error capturado al insertar usuario:", insertCatchError)
          toast({
            title: "Registro parcialmente completado",
            description: "Tu cuenta se creó pero hubo un problema con tu perfil. Por favor contacta a soporte.",
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "facebook" | "apple") => {
    setSocialLoading(provider)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      })
      setSocialLoading(null)
    }
  }

  const handleResendVerification = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (error) throw error

      toast({
        title: "Email reenviado",
        description: "Hemos enviado un nuevo enlace de verificación a tu email.",
      })
    } catch (error: any) {
      toast({
        title: "Error al reenviar email",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (verificationSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-center">Verifica tu email</CardTitle>
          <CardDescription className="text-center">
            Hemos enviado un enlace de verificación a <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
          </p>
          <p className="text-center text-muted-foreground">Si no encuentras el email, revisa tu carpeta de spam.</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="outline" className="w-full" onClick={handleResendVerification} disabled={loading}>
            {loading ? "Enviando..." : "Reenviar email de verificación"}
          </Button>
          <Button
            variant="link"
            className="w-full"
            onClick={() => {
              setVerificationSent(false)
              setEmail("")
              setPassword("")
            }}
          >
            Volver al inicio de sesión
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <Tabs defaultValue="sign-in" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Iniciar sesión</TabsTrigger>
          <TabsTrigger value="sign-up">Registrarse</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <form onSubmit={handleSignIn}>
            <CardHeader>
              <CardTitle>Iniciar sesión</CardTitle>
              <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/reset-password")
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("google")}
                  disabled={!!socialLoading}
                >
                  {socialLoading === "google" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={!!socialLoading}
                >
                  {socialLoading === "facebook" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
                        fill="#1877F2"
                      />
                    </svg>
                  )}
                  Facebook
                </Button>
              </div>
            </CardContent>
          </form>
        </TabsContent>
        <TabsContent value="sign-up">
          <form onSubmit={handleSignUp}>
            <CardHeader>
              <CardTitle>Crear cuenta</CardTitle>
              <CardDescription>Regístrate para comenzar a usar la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  placeholder="Tu nombre"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Contraseña</Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">La contraseña debe tener al menos 6 caracteres</p>
              </div>
              <div className="space-y-2">
                <Label>Tipo de cuenta</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="guest"
                      name="userRole"
                      value="guest"
                      checked={userRole === "guest"}
                      onChange={() => setUserRole("guest")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="guest">Huésped</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="host"
                      name="userRole"
                      value="host"
                      checked={userRole === "host"}
                      onChange={() => setUserRole("host")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="host">Anfitrión</Label>
                  </div>
                </div>
              </div>
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Verificación requerida</AlertTitle>
                <AlertDescription>
                  Después de registrarte, recibirás un email de verificación. Debes verificar tu cuenta antes de poder
                  iniciar sesión.
                </AlertDescription>
              </Alert>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="h-4 w-4 rounded border-gray-300" required />
                <Label htmlFor="terms" className="text-sm">
                  Acepto los{" "}
                  <Link href="/terms" className="underline">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacy" className="underline">
                    política de privacidad
                  </Link>
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">O regístrate con</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("google")}
                  disabled={!!socialLoading}
                >
                  {socialLoading === "google" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={!!socialLoading}
                >
                  {socialLoading === "facebook" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"
                        fill="#1877F2"
                      />
                    </svg>
                  )}
                  Facebook
                </Button>
              </div>
            </CardContent>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
