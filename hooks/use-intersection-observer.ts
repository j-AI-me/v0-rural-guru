"use client"

import { useEffect, useRef, useState } from "react"
import { useMemoizedCallback } from "@/hooks/use-memoized"

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
  skip?: boolean
  onEnter?: () => void
  onExit?: () => void
}

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  skip = false,
  onEnter,
  onExit,
}: UseIntersectionObserverOptions = {}) {
  const [ref, setRef] = useState<Element | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const frozen = useRef(false)
  const wasVisible = useRef(false)

  const handleIntersect = useMemoizedCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      const isIntersecting = entry.isIntersecting

      // Actualizar el estado solo si es necesario
      if (isIntersecting !== isVisible) {
        setIsVisible(isIntersecting)

        // Llamar a los callbacks si es necesario
        if (isIntersecting) {
          onEnter?.()
          wasVisible.current = true
        } else if (wasVisible.current) {
          onExit?.()
        }

        // Congelar el estado si es necesario
        if (freezeOnceVisible && isIntersecting) {
          frozen.current = true
        }
      }
    },
    [freezeOnceVisible, isVisible, onEnter, onExit],
  )

  useEffect(() => {
    // No hacer nada si no hay elemento o si se debe omitir
    if (!ref || skip || (freezeOnceVisible && frozen.current)) return

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      root,
      rootMargin,
    })

    observer.observe(ref)

    return () => {
      observer.disconnect()
    }
  }, [ref, threshold, root, rootMargin, freezeOnceVisible, skip, handleIntersect])

  return { ref: setRef, isVisible, wasVisible: wasVisible.current }
}
