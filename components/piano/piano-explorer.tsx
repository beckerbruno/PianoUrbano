'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2, Music } from 'lucide-react'
import type { Piano } from '@/lib/pianos'
import { getPianos } from '@/lib/firebase/pianos'
import { PianoList } from '@/components/piano/piano-list'

const PianoMap = dynamic(() => import('@/components/piano/piano-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#dfe7e4]">
      <span className="text-sm text-muted-foreground">Carregando mapa…</span>
    </div>
  ),
})

type LoadState = 'loading' | 'ready' | 'error'

export function PianoExplorer() {
  const [pianos, setPianos] = useState<Piano[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getPianos()
      .then((data) => {
        if (!active) return
        setPianos(data)
        setLoadState('ready')
      })
      .catch(() => {
        if (!active) return
        setLoadState('error')
      })

    return () => {
      active = false
    }
  }, [])

  const disponiveis = useMemo(
    () => pianos.filter((p) => p.status === 'disponivel').length,
    [pianos],
  )

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Map */}
        <div className="order-2 h-[420px] overflow-hidden rounded-2xl border border-border shadow-[0px_0px_.5px_0px_rgba(0,0,0,0.14),0px_1px_1px_0px_rgba(0,0,0,0.24)] lg:order-1 lg:h-[640px]">
          <PianoMap
            pianos={pianos}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* List */}
        <div className="order-1 lg:order-2">
          <div className="mb-4 flex items-center gap-2">
            <Music className="size-5 text-brand" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-brand">
              {loadState === 'loading' ? 'Carregando pianos…' : `${pianos.length} pianos no mapa`}
            </h2>
          </div>

          {loadState === 'loading' && (
            <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Buscando pianos cadastrados…
            </p>
          )}

          {loadState === 'error' && (
            <p className="mb-4 text-sm text-destructive">
              Não foi possível carregar os pianos agora. Tente recarregar a página.
            </p>
          )}

          {loadState === 'ready' && (
            <p className="mb-4 text-sm text-muted-foreground">
              {disponiveis} disponíveis agora. Toque em um piano para centralizá-lo
              no mapa e traçar sua rota.
            </p>
          )}

          <div className="lg:max-h-[560px] lg:overflow-y-auto lg:pr-1">
            <PianoList
              pianos={pianos}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
