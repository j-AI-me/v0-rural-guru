import { getServerSupabase } from "./auth"

// Tipos de parámetros para consultas
type QueryParams = Record<string, any>

// Función para ejecutar consultas parametrizadas
export async function executeQuery(query: string, params: QueryParams = {}, table: string) {
  try {
    const supabase = getServerSupabase()

    // Usar el constructor de consultas de Supabase en lugar de SQL directo
    let queryBuilder = supabase.from(table)

    // Aplicar filtros según los parámetros
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          queryBuilder = queryBuilder.in(key, value)
        } else if (typeof value === "object" && value !== null) {
          // Manejar operadores especiales como gt, lt, etc.
          Object.entries(value).forEach(([op, opValue]) => {
            switch (op) {
              case "gt":
                queryBuilder = queryBuilder.gt(key, opValue)
                break
              case "gte":
                queryBuilder = queryBuilder.gte(key, opValue)
                break
              case "lt":
                queryBuilder = queryBuilder.lt(key, opValue)
                break
              case "lte":
                queryBuilder = queryBuilder.lte(key, opValue)
                break
              case "like":
                queryBuilder = queryBuilder.like(key, `%${opValue}%`)
                break
              case "ilike":
                queryBuilder = queryBuilder.ilike(key, `%${opValue}%`)
                break
              default:
                break
            }
          })
        } else {
          queryBuilder = queryBuilder.eq(key, value)
        }
      }
    })

    // Ejecutar la consulta
    const { data, error } = await queryBuilder

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Error en executeQuery:", error)
    return { data: null, error: error.message || "Error en la consulta" }
  }
}

// Función para insertar datos de forma segura
export async function insertData(table: string, data: Record<string, any>) {
  try {
    const supabase = getServerSupabase()

    const { data: result, error } = await supabase.from(table).insert(data).select()

    if (error) {
      throw error
    }

    return { data: result, error: null }
  } catch (error: any) {
    console.error(`Error en insertData (${table}):`, error)
    return { data: null, error: error.message || "Error al insertar datos" }
  }
}

// Función para actualizar datos de forma segura
export async function updateData(table: string, id: string, data: Record<string, any>) {
  try {
    const supabase = getServerSupabase()

    const { data: result, error } = await supabase.from(table).update(data).eq("id", id).select()

    if (error) {
      throw error
    }

    return { data: result, error: null }
  } catch (error: any) {
    console.error(`Error en updateData (${table}):`, error)
    return { data: null, error: error.message || "Error al actualizar datos" }
  }
}

// Función para eliminar datos de forma segura
export async function deleteData(table: string, id: string) {
  try {
    const supabase = getServerSupabase()

    const { error } = await supabase.from(table).delete().eq("id", id)

    if (error) {
      throw error
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error(`Error en deleteData (${table}):`, error)
    return { success: false, error: error.message || "Error al eliminar datos" }
  }
}
