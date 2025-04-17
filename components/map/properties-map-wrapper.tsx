"use client"

import dynamic from "next/dynamic"

// Dynamically import the map component with no SSR
const DynamicPropertiesMap = dynamic(() => import("@/components/map/properties-map").then((mod) => mod.PropertiesMap), {
  ssr: false,
})

interface PropertiesMapWrapperProps {
  height?: string
}

export function PropertiesMapWrapper({ height = "70vh" }: PropertiesMapWrapperProps) {
  return <DynamicPropertiesMap height={height} />
}
