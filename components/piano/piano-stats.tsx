'use client'

import { useEffect, useState } from 'react'
import type { Piano } from '@/lib/pianos'
import { getPianos } from '@/lib/firebase/pianos'
import { isPianoAvailableNow } from '@/lib/piano-hours'
import { haversineDistanceKm } from '@/lib/geo'
import { getCurrentPosition } from '@/lib/location'

const NEARBY_RADIUS_KM = 5

interface StatItem {
  n: string
  l: string
}

export function PianoStats() {
  const [pianos, setPianos] = useState<Piano[] | null>(null)
  const [nearbyCount, setNearbyCount] = useState<number | null>(null)

  useEffect(() => {
    let active = true

    getPianos()
      .then((data) => {
        if (active) setPianos(data)
      })
      .catch(() => {
        if (active) setPianos([])
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!pianos || pianos.length === 0) return
    if (!('permissions' in navigator)) return

    let active = true

    // Só usamos a localização se a permissão já foi concedida — nunca disparamos
    // o prompt do navegador sozinhos. Sem permissão, o card volta para "100% gratuito".
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        if (!active || status.state !== 'granted') return

        return getCurrentPosition().then((position) => {
          if (!active) return
          const origin = { lat: position.coords.latitude, lng: position.coords.longitude }
          const count = pianos.filter(
            (piano) =>
              haversineDistanceKm(origin, { lat: piano.lat, lng: piano.lng }) <= NEARBY_RADIUS_KM,
          ).length
          setNearbyCount(count)
        })
      })
      .catch(() => {
        // Geolocalização indisponível/negada — mantém o fallback "100% gratuito".
      })

    return () => {
      active = false
    }
  }, [pianos])

  const totalMapeados = pianos?.length ?? null
  const disponiveisAgora =
    pianos?.filter((piano) => piano.status === 'disponivel' && isPianoAvailableNow(piano.hours))
      .length ?? null

  const stats: StatItem[] = [
    { n: totalMapeados === null ? '—' : String(totalMapeados), l: 'pianos mapeados' },
    { n: disponiveisAgora === null ? '—' : String(disponiveisAgora), l: 'disponíveis agora' },
    nearbyCount === null
      ? { n: '100%', l: 'gratuito' }
      : { n: String(nearbyCount), l: 'perto de você' },
  ]

  return (
    <ul className="grid grid-cols-3 gap-3">
      {stats.map((item) => (
        <li
          key={item.l}
          className="rounded-xl bg-white/5 p-4 text-center ring-1 ring-white/10"
        >
          <p className="font-serif text-2xl text-gold md:text-3xl">{item.n}</p>
          <p className="mt-1 text-xs text-white/70 text-pretty">{item.l}</p>
        </li>
      ))}
    </ul>
  )
}
