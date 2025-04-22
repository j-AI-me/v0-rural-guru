const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

// Configuración
const outputDir = path.join(__dirname, "../bundle-analysis")
const nextConfigPath = path.join(__dirname, "../next.config.js")
const nextConfigBackupPath = path.join(__dirname, "../next.config.backup.js")

// Crear directorio de salida si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Hacer backup del archivo next.config.js actual
if (fs.existsSync(nextConfigPath)) {
  fs.copyFileSync(nextConfigPath, nextConfigBackupPath)
}

// Modificar next.config.js para incluir el analizador de bundle
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: true,
  openAnalyzer: false,
  analyzerMode: "static",
  generateStatsFile: true,
  statsFilename: path.join(outputDir, "stats.json"),
  reportFilename: path.join(outputDir, "report.html"),
})

// Leer la configuración actual
let nextConfig = {}
if (fs.existsSync(nextConfigPath)) {
  const configContent = fs.readFileSync(nextConfigPath, "utf8")
  // Extraer la configuración del archivo
  const configMatch = configContent.match(/module\.exports\s*=\s*({[\s\S]*})/)
  if (configMatch && configMatch[1]) {
    try {
      // Evaluar la configuración (con precaución)
      nextConfig = eval(`(${configMatch[1]})`)
    } catch (e) {
      console.error("Error al analizar next.config.js:", e)
    }
  }
}

// Escribir la nueva configuración con el analizador
const newConfig = `
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
  openAnalyzer: false,
  analyzerMode: 'static',
  generateStatsFile: true,
  statsFilename: '${path.join(outputDir, "stats.json").replace(/\\/g, "\\\\")}',
  reportFilename: '${path.join(outputDir, "report.html").replace(/\\/g, "\\\\")}',
})

module.exports = withBundleAnalyzer(${JSON.stringify(nextConfig, null, 2)})
`

fs.writeFileSync(nextConfigPath, newConfig)

try {
  console.log("Construyendo la aplicación con análisis de bundle...")
  execSync("npm run build", { stdio: "inherit" })
  console.log(`Análisis de bundle completado. Informe disponible en: ${path.join(outputDir, "report.html")}`)
} catch (error) {
  console.error("Error al construir la aplicación:", error)
} finally {
  // Restaurar la configuración original
  if (fs.existsSync(nextConfigBackupPath)) {
    fs.copyFileSync(nextConfigBackupPath, nextConfigPath)
    fs.unlinkSync(nextConfigBackupPath)
  }
}
