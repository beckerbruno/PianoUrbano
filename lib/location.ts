export interface GeocodeResult {
  lat: number
  lng: number
  label: string
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

function isNominatimSearchEntry(
  entry: unknown,
): entry is { lat: string; lon: string; display_name: string } {
  if (typeof entry !== 'object' || entry === null) return false
  const record = entry as Record<string, unknown>
  return (
    typeof record.lat === 'string' &&
    typeof record.lon === 'string' &&
    typeof record.display_name === 'string'
  )
}

// Busca só deve ser disparada por ação explícita do usuário (nunca a cada tecla) —
// política de uso do Nominatim proíbe padrões de autocomplete.
export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const url = new URL(`${NOMINATIM_BASE}/search`)
  url.searchParams.set('format', 'json')
  url.searchParams.set('q', trimmed)
  url.searchParams.set('limit', '5')
  url.searchParams.set('countrycodes', 'br')

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Não foi possível buscar o endereço agora.')
  }

  const data: unknown = await response.json()
  if (!Array.isArray(data)) return []

  return data.filter(isNominatimSearchEntry).map((entry) => ({
    lat: Number.parseFloat(entry.lat),
    lng: Number.parseFloat(entry.lon),
    label: entry.display_name,
  }))
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const url = new URL(`${NOMINATIM_BASE}/reverse`)
  url.searchParams.set('format', 'json')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) return null

  const data: unknown = await response.json()
  if (typeof data !== 'object' || data === null) return null
  const record = data as Record<string, unknown>
  return typeof record.display_name === 'string' ? record.display_name : null
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocalização não é suportada neste navegador.'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    })
  })
}
