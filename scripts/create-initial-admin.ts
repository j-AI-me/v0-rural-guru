import { createClient } from "@supabase/supabase-js"

// Configuración
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ruralguru.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!"
const ADMIN_NAME = process.env.ADMIN_NAME || "Administrador Principal"

async function createInitialAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  // Crear cliente de Supabase con la clave de servicio
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    console.log(`Creando administrador inicial: ${ADMIN_EMAIL}`)

    // 1. Verificar si el usuario ya existe
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", ADMIN_EMAIL).maybeSingle()

    if (existingUser) {
      console.log(`El usuario ${ADMIN_EMAIL} ya existe. Actualizando a rol de administrador...`)

      // Actualizar rol a admin
      await supabase
        .from("users")
        .update({ role: "admin", updated_at: new Date().toISOString() })
        .eq("id", existingUser.id)

      console.log("Usuario actualizado a administrador exitosamente")
      return
    }

    // 2. Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: ADMIN_NAME,
      },
    })

    if (authError) {
      throw new Error(`Error al crear usuario en Auth: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error("No se pudo crear el usuario en Auth")
    }

    // 3. Crear usuario en la tabla personalizada
    const { error: dbError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: ADMIN_EMAIL,
      full_name: ADMIN_NAME,
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (dbError) {
      throw new Error(`Error al crear usuario en DB: ${dbError.message}`)
    }

    console.log(`Administrador inicial creado exitosamente: ${ADMIN_EMAIL}`)
    console.log("Credenciales:")
    console.log(`- Email: ${ADMIN_EMAIL}`)
    console.log(`- Contraseña: ${ADMIN_PASSWORD}`)
  } catch (error) {
    console.error("Error al crear administrador inicial:", error)
    process.exit(1)
  }
}

// Ejecutar script
createInitialAdmin()
