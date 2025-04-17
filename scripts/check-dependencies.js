const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Función para ejecutar comandos
function runCommand(command) {
  try {
    return execSync(command, { encoding: "utf8" })
  } catch (error) {
    console.error(`Error ejecutando comando: ${command}`)
    console.error(error.message)
    return ""
  }
}

// Verificar vulnerabilidades con npm audit
function checkVulnerabilities() {
  console.log("Verificando vulnerabilidades...")

  try {
    const auditResult = runCommand("npm audit --json")
    const audit = JSON.parse(auditResult)

    if (audit.vulnerabilities) {
      const { low, moderate, high, critical } = audit.vulnerabilities

      console.log("\nResumen de vulnerabilidades:")
      console.log(`- Críticas: ${critical || 0}`)
      console.log(`- Altas: ${high || 0}`)
      console.log(`- Moderadas: ${moderate || 0}`)
      console.log(`- Bajas: ${low || 0}`)

      if (high > 0 || critical > 0) {
        console.log(
          '\n⚠️ Se encontraron vulnerabilidades críticas o altas. Ejecuta "npm audit fix" para intentar resolverlas.',
        )
      }
    }
  } catch (error) {
    console.error("Error al verificar vulnerabilidades:", error)
  }
}

// Verificar actualizaciones disponibles
function checkUpdates() {
  console.log("\nVerificando actualizaciones disponibles...")

  try {
    const outdatedResult = runCommand("npm outdated --json")

    if (outdatedResult) {
      const outdated = JSON.parse(outdatedResult)
      const packages = Object.keys(outdated)

      if (packages.length > 0) {
        console.log(`\nSe encontraron ${packages.length} paquetes desactualizados:`)

        packages.forEach((pkg) => {
          const { current, wanted, latest } = outdated[pkg]
          console.log(`- ${pkg}: ${current} → ${wanted} (última: ${latest})`)
        })

        console.log('\nPara actualizar, ejecuta "npm update" o "npm install <paquete>@latest"')
      } else {
        console.log("Todos los paquetes están actualizados.")
      }
    }
  } catch (error) {
    console.error("Error al verificar actualizaciones:", error)
  }
}

// Verificar dependencias no utilizadas
function checkUnusedDependencies() {
  console.log("\nVerificando dependencias no utilizadas...")

  try {
    // Instalar depcheck si no está instalado
    try {
      require.resolve("depcheck")
    } catch (e) {
      console.log("Instalando depcheck...")
      runCommand("npm install -g depcheck")
    }

    const depcheckResult = runCommand("depcheck --json")
    const unused = JSON.parse(depcheckResult).dependencies

    if (unused && unused.length > 0) {
      console.log(`\nSe encontraron ${unused.length} dependencias no utilizadas:`)
      unused.forEach((pkg) => console.log(`- ${pkg}`))
      console.log('\nPara eliminarlas, ejecuta "npm uninstall <paquete>"')
    } else {
      console.log("No se encontraron dependencias no utilizadas.")
    }
  } catch (error) {
    console.error("Error al verificar dependencias no utilizadas:", error)
  }
}

// Función principal
function main() {
  console.log("=== Verificación de Dependencias ===\n")

  checkVulnerabilities()
  checkUpdates()
  checkUnusedDependencies()

  console.log("\n=== Verificación completada ===")
}

main()
