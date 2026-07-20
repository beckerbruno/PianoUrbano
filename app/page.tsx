import Image from 'next/image'
import Link from 'next/link'
import { Music, Navigation, Plus } from 'lucide-react'
import { PianoExplorer } from '@/components/piano/piano-explorer'
import { PianoStats } from '@/components/piano/piano-stats'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-[500] border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-sem-fundo.png"
              alt="Piano Urbano"
              width={36}
              height={36}
              className="size-9"
              priority
            />
            <span className="text-lg font-semibold tracking-tight text-brand">
              Piano Urbano
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand transition-transform active:scale-95"
            >
              <Plus className="size-4" aria-hidden="true" />
              Cadastrar piano
            </Link>
            <a
              href="#mapa"
              className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform active:scale-95 sm:inline-flex"
            >
              <Navigation className="size-4" aria-hidden="true" />
              Ver o mapa
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-house text-[var(--house-foreground)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-6 md:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold">
              <Music className="size-3.5" aria-hidden="true" />
              Música livre pela cidade
            </span>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-balance md:text-5xl">
              Encontre um piano público perto de você
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
              Descubra onde tocar ao ar livre em São Paulo. Veja cada piano no
              mapa e trace sua rota em um toque pelo Google Maps ou Waze.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#mapa"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-transform active:scale-95"
              >
                <Navigation className="size-4" aria-hidden="true" />
                Explorar o mapa
              </a>
              <a
                href="#sobre"
                className="inline-flex items-center rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95"
              >
                Como funciona
              </a>
            </div>
          </div>
          <PianoStats />
        </div>
      </section>

      {/* Map + list */}
      <div id="mapa" className="pt-10 md:pt-14">
        <PianoExplorer />
      </div>

      {/* About / how it works */}
      <section id="sobre" className="bg-secondary">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 md:grid-cols-3 md:px-6">
          {[
            {
              title: 'Escolha um piano',
              body: 'Navegue pela lista ou toque em um marcador no mapa para ver detalhes, horários e a situação do instrumento.',
            },
            {
              title: 'Trace sua rota',
              body: 'Com um toque, abra o Google Maps ou o Waze já com o destino configurado até o piano escolhido.',
            },
            {
              title: 'Toque e compartilhe',
              body: 'Chegue ao local, sente-se e toque. Todos os pianos são públicos e de acesso livre à comunidade.',
            },
          ].map((step, i) => (
            <article
              key={step.title}
              className="rounded-xl bg-card p-6 shadow-[0px_0px_.5px_0px_rgba(0,0,0,0.14),0px_1px_1px_0px_rgba(0,0,0,0.24)]"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-accent font-serif text-lg font-semibold text-accent-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-brand">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-house text-[var(--house-foreground)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center md:flex-row md:px-6 md:text-left">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-sem-fundo.png"
              alt="Piano Urbano"
              width={32}
              height={32}
              className="size-8"
            />
            <span className="font-semibold">Piano Urbano</span>
          </div>
          <p className="text-sm text-white/70">
            Dados de mapa &copy; OpenStreetMap · Tiles CARTO · Feito para a
            comunidade musical
          </p>
        </div>
      </footer>
    </main>
  )
}
