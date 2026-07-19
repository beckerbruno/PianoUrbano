'use client'

import { type FormEvent, useState } from 'react'
import dynamic from 'next/dynamic'
import { LocateFixed, Loader2, MapPin, Search } from 'lucide-react'
import {
  type GeocodeResult,
  getCurrentPosition,
  reverseGeocode,
  searchAddress,
} from '@/lib/location'
import { cn } from '@/lib/utils'

const PianoLocationMapPicker = dynamic(
  () => import('@/components/piano/piano-location-map-picker'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#dfe7e4]">
        <span className="text-sm text-muted-foreground">Carregando mapa…</span>
      </div>
    ),
  },
)

export interface PianoLocationValue {
  location: string
  lat: number | null
  lng: number | null
}

type Mode = 'endereco' | 'atual' | 'mapa'

const modes: { value: Mode; label: string; icon: typeof Search }[] = [
  { value: 'endereco', label: 'Escrever endereço', icon: Search },
  { value: 'atual', label: 'Minha localização atual', icon: LocateFixed },
  { value: 'mapa', label: 'Selecionar no mapa', icon: MapPin },
]

const fieldClass =
  'w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/25'

export function PianoLocationPicker({
  value,
  onChange,
}: {
  value: PianoLocationValue
  onChange: (value: PianoLocationValue) => void
}) {
  const [mode, setMode] = useState<Mode>('endereco')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const hasCoords = value.lat !== null && value.lng !== null

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setStatus('loading')
    setErrorMessage('')
    try {
      const found = await searchAddress(query)
      setResults(found)
      setErrorMessage(found.length === 0 ? 'Nenhum endereço encontrado. Tente ser mais específico.' : '')
      setStatus('idle')
    } catch {
      setStatus('error')
      setErrorMessage('Não foi possível buscar o endereço agora. Tente novamente.')
    }
  }

  function selectResult(result: GeocodeResult) {
    onChange({ location: result.label, lat: result.lat, lng: result.lng })
    setResults([])
    setQuery(result.label)
  }

  async function handleUseCurrentLocation() {
    setStatus('loading')
    setErrorMessage('')
    try {
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords
      const label =
        (await reverseGeocode(latitude, longitude)) ??
        `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      onChange({ location: label, lat: latitude, lng: longitude })
      setStatus('idle')
    } catch {
      setStatus('error')
      setErrorMessage('Não foi possível acessar sua localização. Verifique a permissão do navegador.')
    }
  }

  async function handleMapPick(lat: number, lng: number) {
    onChange({ location: value.location, lat, lng })
    const label = await reverseGeocode(lat, lng)
    if (label) {
      onChange({ location: label, lat, lng })
    }
  }

  return (
    <div className="grid gap-3">
      <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <MapPin className="size-4 text-brand" aria-hidden="true" />
        Onde está localizado
      </span>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Como informar a localização">
        {modes.map((m) => {
          const Icon = m.icon
          const active = mode === m.value
          return (
            <button
              key={m.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setMode(m.value)
                setErrorMessage('')
              }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-transform active:scale-95',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-card text-foreground',
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {m.label}
            </button>
          )
        })}
      </div>

      {mode === 'endereco' && (
        <div className="grid gap-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: Parque Ibirapuera, São Paulo"
              className={fieldClass}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95 disabled:opacity-60"
            >
              {status === 'loading' ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Search className="size-4" aria-hidden="true" />
              )}
              Buscar
            </button>
          </form>
          {results.length > 0 && (
            <ul className="grid gap-1.5 rounded-lg border border-border bg-card p-2">
              {results.map((result, i) => (
                <li key={`${result.lat}-${result.lng}-${i}`}>
                  <button
                    type="button"
                    onClick={() => selectResult(result)}
                    className="w-full rounded-md px-2.5 py-2 text-left text-sm text-foreground hover:bg-secondary"
                  >
                    {result.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {mode === 'atual' && (
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={status === 'loading'}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95 disabled:opacity-60"
        >
          {status === 'loading' ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <LocateFixed className="size-4" aria-hidden="true" />
          )}
          Usar minha localização atual
        </button>
      )}

      {mode === 'mapa' && (
        <div className="grid gap-1.5">
          <p className="text-xs text-muted-foreground">
            Clique no mapa para marcar o local do piano. Você pode arrastar o marcador para ajustar.
          </p>
          <div className="h-64 overflow-hidden rounded-xl border border-border">
            <PianoLocationMapPicker
              position={hasCoords ? { lat: value.lat as number, lng: value.lng as number } : null}
              onPick={handleMapPick}
            />
          </div>
        </div>
      )}

      {errorMessage && <p className="text-xs font-medium text-destructive">{errorMessage}</p>}

      {hasCoords && (
        <div className="rounded-lg bg-secondary px-3.5 py-2.5 text-xs text-muted-foreground">
          <span className="block font-semibold text-foreground">{value.location}</span>
          {value.lat?.toFixed(5)}, {value.lng?.toFixed(5)}
        </div>
      )}
    </div>
  )
}
