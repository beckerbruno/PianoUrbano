'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Piano } from '@/lib/pianos'
import { googleMapsUrl, wazeUrl } from '@/lib/pianos'

function makeIcon(active: boolean, muted: boolean) {
  const fill = muted ? '#cba258' : active ? '#006241' : '#00754a'
  const scale = active ? 1.15 : 1
  return L.divIcon({
    className: 'piano-marker',
    html: `
      <div style="transform: scale(${scale}); transform-origin: bottom center; transition: transform .2s ease;">
        <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.6 0 0 7.4 0 16.6 0 28.9 17 44 17 44s17-15.1 17-27.4C34 7.4 26.4 0 17 0z" fill="${fill}"/>
          <circle cx="17" cy="16.5" r="11" fill="#ffffff"/>
          <path d="M20.5 9.2v9.1a3 3 0 1 1-1.6-2.66V11l-5.3 1.2v6.6a3 3 0 1 1-1.6-2.66V11.2c0-.5.34-.94.83-1.05l6.3-1.43c.6-.14 1.17.31 1.17.93z" fill="${fill}"/>
        </svg>
      </div>`,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -40],
  })
}

function MapController({
  selected,
  pianos,
}: {
  selected: string | null
  pianos: Piano[]
}) {
  const map = useMap()
  useEffect(() => {
    if (!selected) return
    const piano = pianos.find((p) => p.id === selected)
    if (piano) {
      map.flyTo([piano.lat, piano.lng], 15, { duration: 0.8 })
    }
  }, [selected, pianos, map])
  return null
}

export default function PianoMap({
  pianos,
  selectedId,
  onSelect,
}: {
  pianos: Piano[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const center: [number, number] = [-23.5558, -46.6596]

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MapController selected={selectedId} pianos={pianos} />
      {pianos.map((piano) => (
        <Marker
          key={piano.id}
          position={[piano.lat, piano.lng]}
          icon={makeIcon(
            selectedId === piano.id,
            piano.status === 'manutencao',
          )}
          eventHandlers={{ click: () => onSelect(piano.id) }}
        >
          <Popup>
            <div className="min-w-52 font-sans">
              <p className="text-base font-semibold text-[#006241]">
                {piano.name}
              </p>
              <p className="mt-0.5 text-sm text-[rgba(0,0,0,0.58)]">
                {piano.location}
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href={googleMapsUrl(piano)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#00754a] px-3 py-1.5 text-xs font-semibold text-white transition-transform active:scale-95"
                >
                  Google Maps
                </a>
                <a
                  href={wazeUrl(piano)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#00754a] px-3 py-1.5 text-xs font-semibold text-[#00754a] transition-transform active:scale-95"
                >
                  Waze
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
