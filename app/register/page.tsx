"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const isHostRegistration = searchParams?.get("type") === "host"

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">
              {isHostRegistration ? "Crear una cuenta de anfitrión" : "Crear una cuenta"}
            </CardTitle>
            <CardDescription>
              {isHostRegistration
                ? "Completa el formulario para registrarte como anfitrión en AsturiasRural"
                : "Completa el formulario para registrarte en AsturiasRural"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Nombre</Label>
                <Input id="first-name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Apellidos</Label>
                <Input id="last-name" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="nombre@ejemplo.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label>Tipo de cuenta</Label>
              <RadioGroup defaultValue={isHostRegistration ? "host" : "guest"}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="guest" id="guest" />
                  <Label htmlFor="guest">Huésped</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="host" id="host" />
                  <Label htmlFor="host">Anfitrión</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="h-4 w-4 rounded border-gray-300" />
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
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full">Registrarse</Button>
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="underline">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
