"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface CancelBookingButtonProps {
  bookingId: string
}

export function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Actualizar el estado de la reserva a "cancelled"
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId)

      if (error) throw error

      // Enviar notificaciones de cancelación
      const response = await fetch("/api/notifications/cancel-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
        }),
      })

      if (!response.ok) {
        console.error("Error al enviar notificaciones de cancelación:", await response.text())
      }

      // Cerrar el diálogo
      setIsOpen(false)

      // Mostrar mensaje de éxito
      toast({
        title: "Reserva cancelada",
        description: "Tu reserva ha sido cancelada correctamente.",
      })

      // Recargar la página para mostrar los cambios
      router.refresh()
    } catch (error) {
      console.error("Error al cancelar la reserva:", error)
      toast({
        title: "Error",
        description: "No se pudo cancelar la reserva. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
          Cancelar reserva
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro de que quieres cancelar esta reserva?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. La reserva será cancelada y se notificará al propietario.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Volver
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Sí, cancelar reserva"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
