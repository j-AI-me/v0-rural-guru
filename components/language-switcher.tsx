"use client"

import { useState, useEffect } from "react"
import { Check, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<"es" | "en">("es")

  useEffect(() => {
    // Inicializar con el idioma guardado o el predeterminado
    const savedLanguage = (localStorage.getItem("language") as "es" | "en") || "es"
    setLanguage(savedLanguage)
  }, [])

  const changeLanguage = (lang: "es" | "en") => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    // En una aplicación real, aquí cambiaríamos el idioma de la aplicación
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Cambiar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("es")}>
          <span>Español</span>
          {language === "es" && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          <span>English</span>
          {language === "en" && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
