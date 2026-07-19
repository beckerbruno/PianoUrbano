'use client'

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L, { type LeafletMouseEvent, type LeafletEvent } from 'leaflet'

const SAO_PAULO_CENTER: [number, number] = [-23.5558, -46.6596]

const pickerIcon = L.divIcon({
  className: 'piano-picker-marker',
  html: `
    <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.4 0 16.6 0 28.9 17 44 17 44s17-15.1 17-27.4C34 7.4 26.4 0 17 0z" fill="#00754a"/>
      <circle cx="17" cy="16.5" r="7" fill="#ffffff"/>
    </svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
})

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function PianoLocationMapPicker({
  position,
  onPick,
}: {
  position: { lat: number; lng: number } | null
  onPick: (lat: number, lng: number) => void
}) {
  const center: [number, number] = position ? [position.lat, position.lng] : SAO_PAULO_CENTER

  return (
    <MapContainer center={center} zoom={position ? 15 : 12} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <ClickHandler onPick={onPick} />
      {position && (
        <Marker
          position={[position.lat, position.lng]}
          icon={pickerIcon}
          draggable
          eventHandlers={{
            dragend: (e: LeafletEvent) => {
              const latLng = (e.target as L.Marker).getLatLng()
              onPick(latLng.lat, latLng.lng)
            },
          }}
        />
      )}
    </MapContainer>
  )
}
