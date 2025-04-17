"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        if (error) {
          console.error("Error fetching user:", error)
        } else if (data) {
          setUser(data)
          setFullName(data.full_name || "")
        }
      }

      setLoading(false)
    }

    fetchUser()
  }, [])

  const updateProfile = async () => {
    if (!user) return

    setUpdating(true)

    try {
      const { error } = await supabase
        .from("users")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente.",
      })

      // Update local state
      setUser({ ...user, full_name: fullName })
    } catch (error: any) {
      toast({
        title: "Error al actualizar",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (loading) {
    return <div>Cargando perfil...</div>
  }

  if (!user) {
    return <div>No has iniciado sesión</div>
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Tu perfil</CardTitle>
        <CardDescription>Gestiona tu información personal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Rol</Label>
          <Input id="role" value={user.role} disabled />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleSignOut}>
          Cerrar sesión
        </Button>
        <Button onClick={updateProfile} disabled={updating}>
          {updating ? "Actualizando..." : "Guardar cambios"}
        </Button>
      </CardFooter>
    </Card>
  )
}
