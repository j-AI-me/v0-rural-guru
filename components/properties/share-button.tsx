"use client"

import { useState } from "react"
import { Share2, Copy, Facebook, Twitter, PhoneIcon as WhatsApp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useFeedback } from "@/components/ui/feedback"

interface ShareButtonProps {
  propertyId: string
  propertyName: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ShareButton({
  propertyId,
  propertyName,
  variant = "outline",
  size = "icon",
  className,
}: ShareButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { success } = useFeedback()

  const propertyUrl =
    typeof window !== "undefined" ? `${window.location.origin}/properties/${propertyId}` : `/properties/${propertyId}`

  const shareText = `Mira esta propiedad en RuralGuru: ${propertyName}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(propertyUrl)
    success("Enlace copiado al portapapeles")
  }

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`, "_blank")
  }

  const shareViaTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(propertyUrl)}`,
      "_blank",
    )
  }

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${propertyUrl}`)}`, "_blank")
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant={variant} size={size} className={className} aria-label="Compartir propiedad">
            <Share2 className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartir propiedad</DialogTitle>
            <DialogDescription>Comparte esta propiedad con amigos y familiares</DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 mt-4">
            <Input value={propertyUrl} readOnly />
            <Button size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={shareViaFacebook}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Facebook className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={shareViaTwitter}
              className="bg-sky-500 text-white hover:bg-sky-600"
            >
              <Twitter className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={shareViaWhatsApp}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              <WhatsApp className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
