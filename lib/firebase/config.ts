import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { type Firestore, getFirestore } from 'firebase/firestore'

// Valores vêm de env vars em vez de hardcoded para permitir projetos Firebase
// diferentes por ambiente (dev/preview/produção) sem editar código.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// initializeApp não valida conectividade — falhar aqui exigiria as env vars
// mesmo durante o build estático do Next.js (SSR de componentes client).
// Erros de configuração ausente só aparecem de verdade ao tentar ler/escrever
// no Firestore, tratados em lib/firebase/pianos.ts.
export const firebaseApp: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const db: Firestore = getFirestore(firebaseApp)
