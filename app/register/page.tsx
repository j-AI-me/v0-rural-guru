import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthForm } from "@/components/auth/auth-form"

export default function RegisterPage() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Crear una cuenta</h1>
          <p className="text-sm text-muted-foreground">Ingresa tus datos para registrarte</p>
        </div>
        <AuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Al continuar, aceptas nuestros{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Términos de servicio
          </Link>{" "}
          y{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Política de privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
