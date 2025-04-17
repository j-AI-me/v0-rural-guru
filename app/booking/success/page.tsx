import Link from "next/link"
import { CheckCircle, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const bookingId = searchParams.id || "12345"

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">¡Reserva confirmada!</CardTitle>
          <CardDescription>Tu reserva se ha completado con éxito</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 bg-muted/50">
            <p className="text-center font-medium">Código de reserva</p>
            <p className="text-center text-2xl font-bold mt-1">{bookingId}</p>
          </div>
          <p className="text-center text-muted-foreground">
            Hemos enviado un correo electrónico con todos los detalles de tu reserva. Por favor, revisa tu bandeja de
            entrada.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link href="/" className="w-full">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
          <Link href="/bookings" className="w-full">
            <Button variant="outline" className="w-full">
              Ver mis reservas
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
