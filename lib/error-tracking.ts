import * as Sentry from "@sentry/nextjs"

// Inicializar Sentry solo en producción
export function initErrorTracking() {
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.2,
      environment: process.env.VERCEL_ENV || "production",
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Ajustar el muestreo de sesiones
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
  }
}

// Función para reportar errores manualmente
export function reportError(error: Error, context?: Record<string, any>) {
  console.error("Error capturado:", error)

  if (process.env.NODE_ENV === "production") {
    Sentry.captureException(error, {
      extra: context,
    })
  }
}

// Función para establecer el contexto del usuario
export function setUserContext(user: { id: string; email?: string; name?: string }) {
  if (process.env.NODE_ENV === "production") {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    })
  }
}

// Función para limpiar el contexto del usuario
export function clearUserContext() {
  if (process.env.NODE_ENV === "production") {
    Sentry.setUser(null)
  }
}
