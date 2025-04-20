"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Building2, CalendarDays, Users, BarChart3, Settings, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Propiedades", href: "/dashboard/properties", icon: Building2 },
  { name: "Reservaciones", href: "/dashboard/bookings", icon: CalendarDays },
  { name: "Clientes", href: "/dashboard/customers", icon: Users },
  { name: "Informes", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Cerrar el sidebar cuando cambia la ruta en dispositivos móviles
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Cerrar el sidebar cuando se hace clic fuera de él en dispositivos móviles
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar")
      const toggleButton = document.getElementById("sidebar-toggle")

      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Variantes para animaciones de Framer Motion (optimizadas)
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 250, // Reducido para mejor rendimiento
        damping: 25, // Reducido para mejor rendimiento
        when: "beforeChildren",
        staggerChildren: 0.03, // Reducido para mejor rendimiento
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 250, // Reducido para mejor rendimiento
        damping: 25, // Reducido para mejor rendimiento
        when: "afterChildren",
        staggerChildren: 0.03, // Reducido para mejor rendimiento
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  return (
    <>
      {/* Botón de toggle para móviles con animación */}
      <motion.div initial={false} animate={{ rotate: isOpen ? 0 : 0 }} className="fixed top-4 left-4 z-40 md:hidden">
        <Button id="sidebar-toggle" variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Overlay con animación */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar con animaciones */}
      <motion.div
        id="sidebar"
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={cn(
          "fixed md:sticky top-0 left-0 z-40 h-full w-64 bg-white border-r shadow-sm md:shadow-none md:translate-x-0",
          "transition-all duration-300 ease-in-out",
        )}
      >
        <div className="flex flex-col h-full">
          <motion.div
            className="flex items-center justify-center h-16 border-b"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-xl font-bold">RuralGuru CRM</h1>
          </motion.div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <motion.li
                    key={item.name}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                        "transition-all duration-200 ease-in-out",
                        isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                      )}
                    >
                      <motion.div whileHover="hover" variants={iconVariants}>
                        <item.icon
                          className={cn(
                            "h-5 w-5",
                            "transition-colors duration-200",
                            isActive ? "text-black" : "text-gray-400",
                          )}
                        />
                      </motion.div>
                      <span className={cn("transition-all duration-200", isActive ? "font-medium" : "")}>
                        {item.name}
                      </span>

                      {isActive && (
                        <motion.div
                          className="absolute left-0 w-1 h-6 bg-black rounded-r-full"
                          layoutId="activeIndicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          </nav>

          <motion.div className="p-4 border-t" variants={itemVariants}>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 transition-all duration-200 hover:bg-gray-100"
              asChild
            >
              <Link href="/auth/logout">
                <motion.div whileHover="hover" variants={iconVariants}>
                  <LogOut className="h-4 w-4" />
                </motion.div>
                <span>Cerrar Sesión</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
