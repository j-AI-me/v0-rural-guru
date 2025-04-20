import { LoginForm } from "@/components/auth/login-form"
import { requireGuest } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function LoginPage() {
  // Redirigir si el usuario ya está autenticado
  await requireGuest()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Iniciar sesión</h1>
        <LoginForm />
      </div>
    </div>
  )
}
