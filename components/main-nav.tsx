"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSelector } from "@/components/language-selector"
import { UserNav } from "@/components/user-nav"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const [userRole, setUserRole] = React.useState<string | null>(null)

  React.useEffect(() => {
    const checkUser = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        setUser(data.user)

        // Obtener el rol del usuario
        const { data: userData } = await supabase.from("users").select("role").eq("id", data.user.id).single()

        if (userData) {
          setUserRole(userData.role)
        }
      }
    }

    checkUser()
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileLink href="/" className="flex items-center" onOpenChange={setIsOpen}>
              <span className="font-bold">RuralGuru</span>
            </MobileLink>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <MobileLink href="/" onOpenChange={setIsOpen}>
                  Inicio
                </MobileLink>
                <MobileLink href="/properties" onOpenChange={setIsOpen}>
                  Propiedades
                </MobileLink>
                <MobileLink href="/about" onOpenChange={setIsOpen}>
                  Sobre nosotros
                </MobileLink>
                <MobileLink href="/contact" onOpenChange={setIsOpen}>
                  Contacto
                </MobileLink>
                {userRole === "host" && (
                  <MobileLink href="/host/dashboard" onOpenChange={setIsOpen}>
                    Panel de anfitrión
                  </MobileLink>
                )}
                {userRole === "guest" && (
                  <MobileLink href="/guest/dashboard" onOpenChange={setIsOpen}>
                    Mis reservas
                  </MobileLink>
                )}
                {userRole === "admin" && (
                  <MobileLink href="/admin/dashboard" onOpenChange={setIsOpen}>
                    Panel de administración
                  </MobileLink>
                )}
                {!user && (
                  <>
                    <MobileLink href="/login" onOpenChange={setIsOpen}>
                      Iniciar sesión
                    </MobileLink>
                    <MobileLink href="/register" onOpenChange={setIsOpen}>
                      Registrarse
                    </MobileLink>
                  </>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">RuralGuru</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              "hidden transition-colors hover:text-foreground/80 md:block",
              pathname === "/" ? "text-foreground" : "text-foreground/60",
            )}
          >
            Inicio
          </Link>
          <Link
            href="/properties"
            className={cn(
              "hidden transition-colors hover:text-foreground/80 md:block",
              pathname?.startsWith("/properties") ? "text-foreground" : "text-foreground/60",
            )}
          >
            Propiedades
          </Link>
          <Link
            href="/about"
            className={cn(
              "hidden transition-colors hover:text-foreground/80 md:block",
              pathname?.startsWith("/about") ? "text-foreground" : "text-foreground/60",
            )}
          >
            Sobre nosotros
          </Link>
          <Link
            href="/contact"
            className={cn(
              "hidden transition-colors hover:text-foreground/80 md:block",
              pathname?.startsWith("/contact") ? "text-foreground" : "text-foreground/60",
            )}
          >
            Contacto
          </Link>
          {userRole === "host" && (
            <Link
              href="/host/dashboard"
              className={cn(
                "hidden transition-colors hover:text-foreground/80 md:block",
                pathname?.startsWith("/host") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Panel de anfitrión
            </Link>
          )}
          {userRole === "guest" && (
            <Link
              href="/guest/dashboard"
              className={cn(
                "hidden transition-colors hover:text-foreground/80 md:block",
                pathname?.startsWith("/guest") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Mis reservas
            </Link>
          )}
          {userRole === "admin" && (
            <Link
              href="/admin/dashboard"
              className={cn(
                "hidden transition-colors hover:text-foreground/80 md:block",
                pathname?.startsWith("/admin") ? "text-foreground" : "text-foreground/60",
              )}
            >
              Panel de administración
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <LanguageSelector />
          {user ? (
            <UserNav user={user} role={userRole} />
          ) : (
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Registrarse</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

interface MobileLinkProps {
  href: string
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        isActive && "text-foreground",
        className,
      )}
      onClick={() => {
        onOpenChange?.(false)
      }}
      {...props}
    >
      {children}
    </Link>
  )
}
