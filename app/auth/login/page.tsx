import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Iniciar sesión</h1>

        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Contraseña
                </label>
                <Link href="/auth/recuperar-password" className="text-sm text-gray-500 hover:text-black">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input id="password" type="password" className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800">
              Iniciar sesión
            </button>
          </div>

          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/registro" className="text-black hover:underline font-medium">
              Regístrate
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-black">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
