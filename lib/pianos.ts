export type Piano = {
  id: string
  name: string
  location: string
  description: string
  lat: number
  lng: number
  status: 'disponivel' | 'manutencao'
  hours: string
}

export function googleMapsUrl(piano: Piano) {
  return `https://www.google.com/maps/dir/?api=1&destination=${piano.lat},${piano.lng}&travelmode=walking`
}

export function wazeUrl(piano: Piano) {
  return `https://waze.com/ul?ll=${piano.lat}%2C${piano.lng}&navigate=yes`
}
