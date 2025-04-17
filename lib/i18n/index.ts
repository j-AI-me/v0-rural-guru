import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"

// Importar traducciones
import translationES from "./locales/es/common.json"
import translationEN from "./locales/en/common.json"

// Recursos de traducción
const resources = {
  es: {
    common: translationES,
  },
  en: {
    common: translationEN,
  },
}

i18n
  // Cargar traducciones desde servidor (opcional)
  .use(Backend)
  // Detectar idioma del navegador
  .use(LanguageDetector)
  // Integración con React
  .use(initReactI18next)
  // Inicializar i18next
  .init({
    resources,
    fallbackLng: "es",
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // React ya escapa los valores
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })

export default i18n
