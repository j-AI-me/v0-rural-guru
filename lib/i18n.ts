import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // Common
        "app.name": "AsturiasRural",
        "app.tagline": "Discover the rural charm of Asturias",

        // Navigation
        "nav.properties": "Properties",
        "nav.about": "About Us",
        "nav.contact": "Contact",
        "nav.login": "Log In",
        "nav.register": "Sign Up",
        "nav.host": "Become a Host",

        // Home page
        "home.hero.title": "Discover the rural charm of Asturias",
        "home.hero.subtitle":
          "Find and book the best rural houses in the natural paradise of Asturias. Enjoy tranquility, nature and authentic Asturian cuisine.",
        "home.search.destination": "Where do you want to go?",
        "home.search.checkin": "Check-in",
        "home.search.checkout": "Check-out",
        "home.search.guests": "Guests",
        "home.search.button": "Search",

        // Properties
        "properties.title": "Properties in Asturias",
        "properties.filters": "Filters",
        "properties.sort": "Sort by",
        "properties.showing": "Showing {{count}} properties",

        // Footer
        "footer.rights": "All rights reserved",

        // Legal
        "legal.terms": "Terms and Conditions",
        "legal.privacy": "Privacy Policy",
        "legal.cookies": "Cookie Policy",
      },
    },
    es: {
      translation: {
        // Común
        "app.name": "AsturiasRural",
        "app.tagline": "Descubre el encanto rural de Asturias",

        // Navegación
        "nav.properties": "Propiedades",
        "nav.about": "Sobre Nosotros",
        "nav.contact": "Contacto",
        "nav.login": "Iniciar sesión",
        "nav.register": "Registrarse",
        "nav.host": "Anunciar propiedad",

        // Página de inicio
        "home.hero.title": "Descubre el encanto rural de Asturias",
        "home.hero.subtitle":
          "Encuentra y reserva las mejores casas rurales en el paraíso natural de Asturias. Disfruta de la tranquilidad, la naturaleza y la auténtica gastronomía asturiana.",
        "home.search.destination": "¿Dónde quieres ir?",
        "home.search.checkin": "Llegada",
        "home.search.checkout": "Salida",
        "home.search.guests": "Huéspedes",

        "home.search.button": "Buscar",

        // Propiedades
        "properties.title": "Propiedades en Asturias",
        "properties.filters": "Filtros",
        "properties.sort": "Ordenar por",
        "properties.showing": "Mostrando {{count}} propiedades",

        // Pie de página
        "footer.rights": "Todos los derechos reservados",

        // Legal
        "legal.terms": "Términos y Condiciones",
        "legal.privacy": "Política de Privacidad",
        "legal.cookies": "Política de Cookies",
      },
    },
  },
  lng: "es", // Default language
  fallbackLng: "es",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
})

export default i18n
