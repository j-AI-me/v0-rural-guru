"use client"

// Componente simplificado para evitar errores
export function PropertiesMapWrapper({ height = "70vh" }) {
  return (
    <div className="relative">
      <div className="w-full rounded-lg bg-muted flex items-center justify-center" style={{ height }}>
        <p className="text-muted-foreground">Mapa no disponible</p>
      </div>
    </div>
  )
}
