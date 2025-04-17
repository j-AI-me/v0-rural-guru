export interface Coordinates {
  latitude: number
  longitude: number
}

export interface MapMarker {
  id: string
  coordinates: Coordinates
  title: string
  price?: number
  image?: string
}

export interface MapViewport {
  center: Coordinates
  zoom: number
}

export interface MapBounds {
  northEast: Coordinates
  southWest: Coordinates
}
