"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function BookingPage({ params }: { params: { id: string } }) {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "redsys">("stripe")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // En una aplicación real, obtendríamos estos datos de la API
  const booking = {
    id: params.id,
    propertyName: "Cabaña en Cangas de Onís",
    checkIn: "2023-04-10",
    checkOut: "2023-04-15",
    guests: 2,
    nights: 5,
    pricePerNight: 95,
    cleaningFee: 30,
    serviceFee: 25,
    totalPrice: 95 * 5 + 30 + 25,
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulamos el proceso de pago
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Pago procesado correctamente",
        description: "Tu reserva ha sido confirmada.",
      })

      router.push(`/booking/success?id=${params.id}`)
    } catch (error) {
      toast({
        title: "Error en el pago",
        description: "Ha ocurrido un error al procesar el pago. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Link href={`/properties/${params.id}`} className="inline-flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Volver a la propiedad
      </Link>

      <h1 className="text-3xl font-bold mb-8">Completar reserva</h1>

      <div className="grid md:grid-cols-[1fr_350px] gap-8">
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detalles de la reserva</CardTitle>
              <CardDescription>Revisa los detalles de tu reserva</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between">
                  <div className="font-medium">Propiedad:</div>
                  <div>{booking.propertyName}</div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Fechas:</div>
                  <div>
                    {booking.checkIn} - {booking.checkOut}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="font-medium">Huéspedes:</div>
                  <div>{booking.guests}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Método de pago</CardTitle>
              <CardDescription>Selecciona tu método de pago preferido</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment}>
                <Tabs defaultValue="card" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card" onClick={() => setPaymentMethod("stripe")}>
                      Tarjeta de crédito
                    </TabsTrigger>
                    <TabsTrigger value="redsys" onClick={() => setPaymentMethod("redsys")}>
                      Redsys
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="card-number">Número de tarjeta</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiry">Fecha de caducidad</Label>
                        <Input id="expiry" placeholder="MM/AA" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre en la tarjeta</Label>
                      <Input id="name" placeholder="Nombre completo" />
                    </div>
                  </TabsContent>
                  <TabsContent value="redsys" className="space-y-4">
                    <div className="text-center p-4">
                      <p>Serás redirigido a la plataforma de pago seguro de Redsys para completar tu pago.</p>
                      <CreditCard className="h-16 w-16 mx-auto my-4 text-muted-foreground" />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Procesando pago..." : "Pagar y reservar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Resumen de precio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {booking.pricePerNight}€ x {booking.nights} noches
                  </span>
                  <span>{booking.pricePerNight * booking.nights}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa de limpieza</span>
                  <span>{booking.cleaningFee}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa de servicio</span>
                  <span>{booking.serviceFee}€</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{booking.totalPrice}€</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <p>No se te cobrará nada hasta que confirmes la reserva.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
