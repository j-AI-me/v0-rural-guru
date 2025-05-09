"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"

// Definición del contexto
interface AppContextProps {
  favorites: string[]
  addFavorite: (propertyId: string) => Promise<void>
  removeFavorite: (propertyId: string) => Promise<void>
  isFavorite: (propertyId: string) => boolean
  recentlyViewed: string[]
  addRecentlyViewed: (propertyId: string) => void
  notifications: any[]
  unreadNotificationsCount: number
  markNotificationAsRead: (notificationId: string) => Promise<void>
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

// Versión simplificada y optimizada del provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const { user } = useAuth()

  // Memoizar el cliente de Supabase para evitar recreaciones
  const supabaseClient = useMemo(() => getSupabaseBrowserClient(), [])

  // Cargar favoritos del usuario
  useEffect(() => {
    let isMounted = true

    async function loadFavorites() {
      if (!user) {
        if (isMounted) setFavorites([])
        return
      }

      try {
        const { data, error } = await supabaseClient.from("favorites").select("property_id").eq("user_id", user.id)

        if (error) throw error

        if (isMounted) {
          setFavorites(data.map((item) => item.property_id))
        }
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }

    loadFavorites()

    return () => {
      isMounted = false
    }
  }, [user, supabaseClient])

  // Cargar notificaciones del usuario
  useEffect(() => {
    let isMounted = true

    async function loadNotifications() {
      if (!user) {
        if (isMounted) setNotifications([])
        return
      }

      try {
        const { data, error } = await supabaseClient
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        if (isMounted) {
          setNotifications(data || [])
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    }

    loadNotifications()

    return () => {
      isMounted = false
    }
  }, [user, supabaseClient])

  // Funciones simplificadas
  const addFavorite = async (propertyId: string) => {
    if (!user) return

    try {
      const { error } = await supabaseClient.from("favorites").insert({ user_id: user.id, property_id: propertyId })

      if (error) throw error

      setFavorites((prev) => [...prev, propertyId])
    } catch (error) {
      console.error("Error adding favorite:", error)
    }
  }

  const removeFavorite = async (propertyId: string) => {
    if (!user) return

    try {
      const { error } = await supabaseClient
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId)

      if (error) throw error

      setFavorites((prev) => prev.filter((id) => id !== propertyId))
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId)
  }

  const addRecentlyViewed = (propertyId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== propertyId)
      return [propertyId, ...filtered].slice(0, 5)
    })
  }

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) return

    try {
      const { error } = await supabaseClient.from("notifications").update({ read: true }).eq("id", notificationId)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Contar notificaciones no leídas
  const unreadNotificationsCount = notifications.filter((notification) => !notification.read).length

  // Valor del contexto
  const contextValue = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    recentlyViewed,
    addRecentlyViewed,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp debe usarse dentro de un AppProvider")
  }
  return context
}
