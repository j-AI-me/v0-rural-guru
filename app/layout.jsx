import "./globals.css"

export const metadata = {
  title: "RuralGuru",
  description: "Alojamientos rurales en Asturias",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
