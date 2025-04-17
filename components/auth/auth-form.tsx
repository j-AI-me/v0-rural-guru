"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
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
            router.push("/admin-dashboard")
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
        router.push("/admin-dashboard")
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
            role: "guest", // Rol predeterminado
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
            toast({
              title: "Registro exitoso",
              description: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
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

      // Redirigir a la página de inicio de sesión
      router.push("/login")
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

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
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
                    <a href="#" className="text-sm text-primary hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </CardFooter>
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
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
