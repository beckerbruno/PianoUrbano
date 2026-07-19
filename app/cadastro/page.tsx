import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Music, ArrowLeft } from 'lucide-react'
import { PianoForm } from '@/components/piano/piano-form'

export const metadata: Metadata = {
  title: 'Cadastrar piano · Piano Urbano',
  description:
    'Cadastre um piano público informando modelo, localização e avaliando o estado do instrumento e o ambiente para tocar.',
}

export default function CadastroPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-[500] border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
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
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand transition-transform active:scale-95"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar ao mapa
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-house text-[var(--house-foreground)]">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold">
            <Music className="size-3.5" aria-hidden="true" />
            Contribua com o mapa
          </span>
          <h1 className="mt-4 font-serif text-3xl leading-tight text-balance md:text-4xl">
            Cadastre um piano público
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/70">
            Encontrou um piano de acesso livre? Informe o modelo e a
            localização, e avalie o estado do instrumento e o ambiente para
            tocar. Sua contribuição ajuda outros músicos a encontrarem novos
            lugares.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <PianoForm />
      </section>
    </main>
  )
}
