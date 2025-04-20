import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { requireGuest } from "@/lib/auth"

export default async function ResetPasswordPage() {
  // Redirigir si el usuario ya está autenticado
  await requireGuest()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Recuperar contraseña</h1>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
