"use client"

import { useState, useEffect, useRef } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useMemoizedCallback, useMemoized } from "@/hooks/use-memoized"

interface UsePropertyDataOptions {
  propertyId?: string
  includeReviews?: boolean
  includeBookings?: boolean
  includeAvailability?: boolean
}

export function usePropertyData({
  propertyId,
  includeReviews = false,
  includeBookings = false,
  includeAvailability = false,
}: UsePropertyDataOptions = {}) {
  const [property, setProperty] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [availability, setAvailability] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  // Usar una ref para almacenar la última solicitud y evitar condiciones de carrera
  const latestRequestId = useRef<string>("")

  // Memoizar las opciones para evitar re-renderizados innecesarios
  const options = useMemoized(
    () => ({
      propertyId,
      includeReviews,
      includeBookings,
      includeAvailability,
    }),
    [propertyId, includeReviews, includeBookings, includeAvailability],
  )

  // Memoizar la función fetchData para evitar recreaciones innecesarias
  const fetchData = useMemoizedCallback(async () => {
    if (!propertyId) return

    // Generar un ID único para esta solicitud
    const requestId = Date.now().toString()
    latestRequestId.current = requestId

    setIsLoading(true)
    setError(null)

    try {
      // Verificar si esta solicitud sigue siendo la más reciente
      if (requestId !== latestRequestId.current) return

      // Fetch property data
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single()

      if (propertyError) throw propertyError

      // Verificar si esta solicitud sigue siendo la más reciente
      if (requestId !== latestRequestId.current) return

      setProperty(propertyData)

      // Fetch reviews if requested
      if (includeReviews) {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select(`
            id, 
            created_at, 
            rating, 
            comment, 
            response, 
            response_date,
            user_id,
            profiles:user_id (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq("property_id", propertyId)
          .eq("status", "published")
          .order("created_at", { ascending: false })

        if (reviewsError) throw reviewsError

        // Verificar si esta solicitud sigue siendo la más reciente
        if (requestId !== latestRequestId.current) return

        setReviews(reviewsData || [])
      }

      // Fetch bookings if requested
      if (includeBookings) {
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            id,
            check_in,
            check_out,
            guests,
            total_price,
            status,
            payment_status,
            created_at
          `)
          .eq("property_id", propertyId)
          .order("check_in", { ascending: true })

        if (bookingsError) throw bookingsError

        // Verificar si esta solicitud sigue siendo la más reciente
        if (requestId !== latestRequestId.current) return

        setBookings(bookingsData || [])
      }

      // Fetch availability if requested
      if (includeAvailability) {
        const { data: availabilityData, error: availabilityError } = await supabase
          .from("availability")
          .select("*")
          .eq("property_id", propertyId)

        if (availabilityError) throw availabilityError

        // Verificar si esta solicitud sigue siendo la más reciente
        if (requestId !== latestRequestId.current) return

        setAvailability(availabilityData || [])
      }
    } catch (err: any) {
      // Verificar si esta solicitud sigue siendo la más reciente
      if (requestId !== latestRequestId.current) return

      console.error("Error fetching property data:", err)
      setError(err.message || "Error al cargar los datos de la propiedad")
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de la propiedad",
        variant: "destructive",
      })
    } finally {
      // Verificar si esta solicitud sigue siendo la más reciente
      if (requestId !== latestRequestId.current) return

      setIsLoading(false)
    }
  }, [propertyId, includeReviews, includeBookings, includeAvailability, supabase, toast])

  // Efecto para cargar los datos cuando cambian las opciones
  useEffect(() => {
    fetchData()

    // Limpiar cuando el componente se desmonte
    return () => {
      latestRequestId.current = ""
    }
  }, [options, fetchData])

  // Memoizar las funciones de actualización para evitar recreaciones innecesarias
  const setPropertyMemoized = useMemoizedCallback((newProperty: any) => {
    setProperty(newProperty)
  }, [])

  const setReviewsMemoized = useMemoizedCallback((newReviews: any[]) => {
    setReviews(newReviews)
  }, [])

  const setBookingsMemoized = useMemoizedCallback((newBookings: any[]) => {
    setBookings(newBookings)
  }, [])

  const setAvailabilityMemoized = useMemoizedCallback((newAvailability: any[]) => {
    setAvailability(newAvailability)
  }, [])

  // Memoizar el resultado para evitar recreaciones innecesarias
  return useMemoized(
    () => ({
      property,
      reviews,
      bookings,
      availability,
      isLoading,
      error,
      setProperty: setPropertyMemoized,
      setReviews: setReviewsMemoized,
      setBookings: setBookingsMemoized,
      setAvailability: setAvailabilityMemoized,
      refetch: fetchData,
    }),
    [
      property,
      reviews,
      bookings,
      availability,
      isLoading,
      error,
      setPropertyMemoized,
      setReviewsMemoized,
      setBookingsMemoized,
      setAvailabilityMemoized,
      fetchData,
    ],
  )
}
