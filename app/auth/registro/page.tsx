import { RegisterForm } from "@/components/auth/register-form"
import { requireGuest } from "@/lib/auth"

export default async function RegisterPage() {
  // Redirigir si el usuario ya está autenticado
  await requireGuest()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Crear una cuenta</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
