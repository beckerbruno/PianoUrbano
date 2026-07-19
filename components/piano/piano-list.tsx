'use client'

import { Clock, MapPin, Navigation, Wrench } from 'lucide-react'
import type { Piano } from '@/lib/pianos'
import { googleMapsUrl, wazeUrl } from '@/lib/pianos'
import { cn } from '@/lib/utils'

export function PianoList({
  pianos,
  selectedId,
  onSelect,
}: {
  pianos: Piano[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <ul className="flex flex-col gap-3">
      {pianos.map((piano) => {
        const active = selectedId === piano.id
        const emManutencao = piano.status === 'manutencao'
        return (
          <li key={piano.id}>
            <article
              className={cn(
                'rounded-xl bg-card p-4 shadow-[0px_0px_.5px_0px_rgba(0,0,0,0.14),0px_1px_1px_0px_rgba(0,0,0,0.24)] transition-all',
                active && 'ring-2 ring-primary',
              )}
            >
              <button
                type="button"
                onClick={() => onSelect(piano.id)}
                className="w-full text-left"
                aria-pressed={active}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-brand text-balance">
                    {piano.name}
                  </h3>
                  {emManutencao ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">
                      <Wrench className="size-3" aria-hidden="true" />
                      Manutenção
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                      Disponível
                    </span>
                  )}
                </div>

                <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {piano.location}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                  {piano.description}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                  {piano.hours}
                </p>
              </button>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={googleMapsUrl(piano)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
                >
                  <Navigation className="size-4" aria-hidden="true" />
                  Google Maps
                </a>
                <a
                  href={wazeUrl(piano)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-transform active:scale-95"
                >
                  <Navigation className="size-4" aria-hidden="true" />
                  Waze
                </a>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
