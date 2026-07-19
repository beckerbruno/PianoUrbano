// Popula a coleção "pianos" do Firestore com os pianos de exemplo usados durante
// o desenvolvimento (antes da migração para Firestore, esses dados viviam hardcoded
// em lib/pianos.ts). Rode com: pnpm seed
// Requer as mesmas env vars de .env.local (usa `node --env-file`, sem dependência extra).

import { initializeApp } from 'firebase/app'
import { addDoc, collection, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const pianosIniciais = [
  {
    name: 'Piano do Ibirapuera',
    location: 'Parque Ibirapuera — Portão 3',
    description:
      'Piano de cauda instalado próximo ao Auditório. Ambiente arborizado, ideal para tardes de sol.',
    lat: -23.5874,
    lng: -46.6576,
    status: 'disponivel',
    hours: 'Todos os dias, 6h às 22h',
  },
  {
    name: 'Piano da Paulista',
    location: 'Avenida Paulista, em frente ao MASP',
    description:
      'Piano vertical colorido no calçadão da Paulista. Muito movimentado aos domingos, quando a avenida é fechada.',
    lat: -23.5614,
    lng: -46.6559,
    status: 'disponivel',
    hours: 'Todos os dias, 8h às 20h',
  },
  {
    name: 'Piano da Estação da Luz',
    location: 'Estação da Luz — Saída Jardim da Luz',
    description:
      'Piano histórico abrigado sob a marquise da estação. Acústica marcante entre os arcos de ferro.',
    lat: -23.5347,
    lng: -46.6357,
    status: 'manutencao',
    hours: 'Seg a sáb, 9h às 18h',
  },
  {
    name: 'Piano do Largo da Batata',
    location: 'Largo da Batata — Pinheiros',
    description:
      'Piano comunitário próximo à estação de metrô. Palco de saraus espontâneos no fim da tarde.',
    lat: -23.5665,
    lng: -46.6929,
    status: 'disponivel',
    hours: 'Todos os dias, 7h às 21h',
  },
  {
    name: 'Piano da República',
    location: 'Praça da República — Centro',
    description: 'Piano de parede sob as árvores da praça, perto da feira de arte de domingo.',
    lat: -23.5431,
    lng: -46.6425,
    status: 'disponivel',
    hours: 'Todos os dias, 8h às 19h',
  },
  {
    name: 'Piano do Beco do Batman',
    location: 'Beco do Batman — Vila Madalena',
    description: 'Piano cercado de grafites coloridos. Ponto de encontro de músicos independentes.',
    lat: -23.5546,
    lng: -46.6899,
    status: 'disponivel',
    hours: 'Todos os dias, 10h às 22h',
  },
]

async function seed() {
  const missing = Object.entries(firebaseConfig).filter(([, value]) => !value)
  if (missing.length > 0) {
    throw new Error(
      `Faltam variáveis de ambiente do Firebase: ${missing.map(([key]) => key).join(', ')}. Configure .env.local (veja .env.example) e rode: pnpm seed`,
    )
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  for (const piano of pianosIniciais) {
    const ref = await addDoc(collection(db, 'pianos'), piano)
    console.log(`Criado: ${piano.name} (${ref.id})`)
  }
}

seed()
  .then(() => {
    console.log(`\n${pianosIniciais.length} pianos criados com sucesso.`)
    process.exit(0)
  })
  .catch((error) => {
    console.error(error.message ?? error)
    process.exit(1)
  })
