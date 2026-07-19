import {
  addDoc,
  collection,
  type DocumentData,
  getDocs,
  query,
  type QueryDocumentSnapshot,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Piano } from '@/lib/pianos'

const PIANOS_COLLECTION = 'pianos'

// Cadastros novos entram com este status e ficam de fora do mapa público
// (ver getPianos) até alguém aprovar manualmente pelo Console do Firebase —
// é o que cumpre a promessa de "revisão da comunidade" já existente na UI.
const STATUS_PENDENTE = 'pendente'

function parsePianoDoc(doc: QueryDocumentSnapshot<DocumentData>): Piano | null {
  const data = doc.data()
  if (
    typeof data.name !== 'string' ||
    typeof data.location !== 'string' ||
    typeof data.description !== 'string' ||
    typeof data.lat !== 'number' ||
    typeof data.lng !== 'number' ||
    typeof data.hours !== 'string' ||
    (data.status !== 'disponivel' && data.status !== 'manutencao')
  ) {
    return null
  }

  return {
    id: doc.id,
    name: data.name,
    location: data.location,
    description: data.description,
    lat: data.lat,
    lng: data.lng,
    status: data.status,
    hours: data.hours,
  }
}

export async function getPianos(): Promise<Piano[]> {
  const pianosQuery = query(
    collection(db, PIANOS_COLLECTION),
    where('status', 'in', ['disponivel', 'manutencao']),
  )
  const snapshot = await getDocs(pianosQuery)

  return snapshot.docs
    .map(parsePianoDoc)
    .filter((piano): piano is Piano => piano !== null)
}

export interface PianoSuggestionInput {
  nome: string
  modelo: string
  location: string
  lat: number
  lng: number
  ambienteLabel: string
  estado: number
  ambienteNota: number
  observacoes: string
}

export async function submitPianoSuggestion(input: PianoSuggestionInput): Promise<string> {
  const descriptionParts = [
    `Modelo: ${input.modelo}.`,
    `Ambiente: ${input.ambienteLabel}.`,
    `Avaliação do estado: ${input.estado}/5.`,
    `Avaliação do ambiente: ${input.ambienteNota}/5.`,
  ]
  if (input.observacoes.trim()) {
    descriptionParts.push(input.observacoes.trim())
  }

  const docRef = await addDoc(collection(db, PIANOS_COLLECTION), {
    name: input.nome,
    location: input.location,
    description: descriptionParts.join(' '),
    lat: input.lat,
    lng: input.lng,
    status: STATUS_PENDENTE,
    hours: 'A confirmar',
    createdAt: serverTimestamp(),
  })

  return docRef.id
}
