import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Mail className="h-8 w-8" />
              </div>
            </div>
            <CardTitle>Verifica tu correo electrónico</CardTitle>
            <CardDescription>Hemos enviado un enlace de verificación a tu correo electrónico</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
            </p>
            <p className="text-sm text-gray-600">
              Si no has recibido el correo, revisa tu carpeta de spam o solicita un nuevo enlace.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                Volver a iniciar sesión
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
