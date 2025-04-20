import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Crear una cuenta</h1>

        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium">
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Tu nombre completo"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </label>
              <input id="password" type="password" className="w-full px-3 py-2 border rounded-md" />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirmar contraseña
              </label>
              <input id="confirmPassword" type="password" className="w-full px-3 py-2 border rounded-md" />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="rounded" />
              <label htmlFor="terms" className="text-sm">
                Acepto los{" "}
                <Link href="/terminos" className="text-black hover:underline">
                  términos y condiciones
                </Link>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800">Registrarse</button>
          </div>

          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="text-black hover:underline font-medium">
              Inicia sesión
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
