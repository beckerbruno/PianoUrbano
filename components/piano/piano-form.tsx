'use client'

import { useState } from 'react'
import {
  Music,
  Star,
  Check,
  Piano,
  Trees,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import {
  PianoLocationPicker,
  type PianoLocationValue,
} from '@/components/piano/piano-location-picker'
import { submitPianoSuggestion } from '@/lib/firebase/pianos'

type Rating = 0 | 1 | 2 | 3 | 4 | 5

const modelos = [
  'Piano vertical',
  'Piano de cauda',
  'Piano de meia-cauda',
  'Piano de armário',
  'Piano digital',
  'Outro',
]

const ambientes = [
  { value: 'ar-livre', label: 'Ao ar livre' },
  { value: 'coberto', label: 'Coberto / abrigado' },
  { value: 'interno', label: 'Ambiente interno' },
  { value: 'estacao', label: 'Estação / transporte' },
]

function StarRating({
  value,
  onChange,
  label,
}: {
  value: Rating
  onChange: (v: Rating) => void
  label: string
}) {
  const [hover, setHover] = useState<Rating>(0)
  return (
    <div>
      <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
        {([1, 2, 3, 4, 5] as Rating[]).map((n) => {
          const active = n <= (hover || value)
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} de 5`}
              onClick={() => onChange(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="rounded-md p-0.5 transition-transform active:scale-90"
            >
              <Star
                className={
                  active
                    ? 'size-7 fill-gold text-gold'
                    : 'size-7 text-muted-foreground/40'
                }
                aria-hidden="true"
              />
            </button>
          )
        })}
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {value > 0 ? `${value}/5` : 'Sem nota'}
        </span>
      </div>
    </div>
  )
}

const fieldClass =
  'w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/25'

export function PianoForm() {
  const [nome, setNome] = useState('')
  const [modelo, setModelo] = useState('')
  const [localizacao, setLocalizacao] = useState<PianoLocationValue>({
    location: '',
    lat: null,
    lng: null,
  })
  const [ambiente, setAmbiente] = useState('')
  const [estado, setEstado] = useState<Rating>(0)
  const [ambienteNota, setAmbienteNota] = useState<Rating>(0)
  const [observacoes, setObservacoes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const localizacaoValida = localizacao.lat !== null && localizacao.lng !== null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!localizacaoValida) return

    setSubmitting(true)
    setSubmitError('')
    try {
      await submitPianoSuggestion({
        nome,
        modelo,
        location: localizacao.location,
        lat: localizacao.lat as number,
        lng: localizacao.lng as number,
        ambienteLabel: ambientes.find((a) => a.value === ambiente)?.label ?? ambiente,
        estado,
        ambienteNota,
        observacoes,
      })
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError('Não foi possível enviar seu cadastro agora. Tente novamente em instantes.')
    } finally {
      setSubmitting(false)
    }
  }

  function resetForm() {
    setNome('')
    setModelo('')
    setLocalizacao({ location: '', lat: null, lng: null })
    setAmbiente('')
    setEstado(0)
    setAmbienteNota(0)
    setObservacoes('')
    setSubmitted(false)
    setSubmitError('')
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-card p-8 text-center shadow-[0px_0px_.5px_0px_rgba(0,0,0,0.14),0px_1px_1px_0px_rgba(0,0,0,0.24)]">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-serif text-2xl text-brand">
          Piano cadastrado!
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-foreground/70">
          Obrigado por contribuir com o mapa. As informações de{' '}
          <span className="font-semibold text-foreground">
            {nome || 'seu piano'}
          </span>{' '}
          foram registradas e passarão por revisão da comunidade.
        </p>
        <dl className="mx-auto mt-6 grid max-w-md gap-2 text-left text-sm">
          <div className="flex justify-between gap-4 rounded-lg bg-secondary px-4 py-2.5">
            <dt className="text-muted-foreground">Modelo</dt>
            <dd className="font-medium text-foreground">{modelo || '—'}</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-lg bg-secondary px-4 py-2.5">
            <dt className="text-muted-foreground">Localização</dt>
            <dd className="font-medium text-foreground text-right">
              {localizacao.location || '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-4 rounded-lg bg-secondary px-4 py-2.5">
            <dt className="text-muted-foreground">Estado do piano</dt>
            <dd className="font-medium text-foreground">{estado}/5</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-lg bg-secondary px-4 py-2.5">
            <dt className="text-muted-foreground">Ambiente</dt>
            <dd className="font-medium text-foreground">{ambienteNota}/5</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            <Music className="size-4" aria-hidden="true" />
            Cadastrar outro piano
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-brand transition-transform active:scale-95"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar ao mapa
          </a>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-card p-6 shadow-[0px_0px_.5px_0px_rgba(0,0,0,0.14),0px_1px_1px_0px_rgba(0,0,0,0.24)] md:p-8"
    >
      <div className="grid gap-6">
        {/* Nome */}
        <div className="grid gap-2">
          <label htmlFor="nome" className="text-sm font-semibold text-foreground">
            Nome do piano
          </label>
          <input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Piano do Ibirapuera"
            required
            className={fieldClass}
          />
        </div>

        {/* Modelo */}
        <div className="grid gap-2">
          <label
            htmlFor="modelo"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            <Piano className="size-4 text-brand" aria-hidden="true" />
            Modelo do piano
          </label>
          <select
            id="modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
            className={fieldClass}
          >
            <option value="" disabled>
              Selecione o modelo
            </option>
            {modelos.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Localização */}
        <PianoLocationPicker value={localizacao} onChange={setLocalizacao} />

        {/* Ambiente tipo */}
        <div className="grid gap-2">
          <label
            htmlFor="ambiente"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            <Trees className="size-4 text-brand" aria-hidden="true" />
            Tipo de ambiente
          </label>
          <select
            id="ambiente"
            value={ambiente}
            onChange={(e) => setAmbiente(e.target.value)}
            required
            className={fieldClass}
          >
            <option value="" disabled>
              Selecione o ambiente
            </option>
            {ambientes.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Avaliações */}
        <div className="grid gap-5 rounded-xl bg-secondary p-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">
              Estado do piano
            </span>
            <p className="text-xs text-muted-foreground">
              Afinação, teclas e conservação geral.
            </p>
            <StarRating
              value={estado}
              onChange={setEstado}
              label="Estado do piano"
            />
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">
              Ambiente para tocar
            </span>
            <p className="text-xs text-muted-foreground">
              Conforto, acústica e clima do local.
            </p>
            <StarRating
              value={ambienteNota}
              onChange={setAmbienteNota}
              label="Ambiente para tocar"
            />
          </div>
        </div>

        {/* Observações */}
        <div className="grid gap-2">
          <label
            htmlFor="obs"
            className="text-sm font-semibold text-foreground"
          >
            Observações{' '}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </label>
          <textarea
            id="obs"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={4}
            placeholder="Conte como é a experiência de tocar nesse piano..."
            className={`${fieldClass} resize-y`}
          />
        </div>

        <div className="grid gap-2">
          <button
            type="submit"
            disabled={!localizacaoValida || submitting}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Check className="size-4" aria-hidden="true" />
            )}
            {submitting ? 'Enviando…' : 'Cadastrar piano'}
          </button>
          {!localizacaoValida && (
            <p className="text-center text-xs text-muted-foreground">
              Escreva um endereço, use sua localização atual ou selecione o ponto no mapa para continuar.
            </p>
          )}
          {submitError && (
            <p className="text-center text-xs font-medium text-destructive">{submitError}</p>
          )}
        </div>
      </div>
    </form>
  )
}
