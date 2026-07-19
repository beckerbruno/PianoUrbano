# Setup do Firebase (Firestore)

> Este arquivo é o passo a passo para colocar o Firestore no ar de verdade. O código já está pronto (`lib/firebase/`) — falta só um projeto Firebase real e as env vars.

## 1. Criar o projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e crie um projeto (ou use um existente).
2. No projeto, vá em **Compilação > Firestore Database** e crie o banco (modo produção — as regras de segurança abaixo cuidam do acesso).
3. Em **Configurações do projeto > Seus apps**, registre um app **Web** (ícone `</>`). O console vai gerar um objeto `firebaseConfig` com `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.

## 2. Configurar as env vars

Copie `.env.example` para `.env.local` e preencha com os valores do passo anterior:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

O prefixo `NEXT_PUBLIC_` é obrigatório — é o que faz o Next.js expor essas variáveis para o código que roda no navegador (onde o app de fato lê e escreve no Firestore). Essa configuração não é segredo: a segurança de verdade vem das Regras de Segurança do Firestore (próximo passo), não de esconder essas chaves.

`.env.local` já está no `.gitignore` — nunca vai ser commitado.

## 3. Regras de segurança do Firestore

O app lê/escreve direto do navegador (sem backend próprio), então quem protege os dados são as **Regras de Segurança**, configuráveis em **Firestore Database > Regras** no Console. Recomendação para o modelo atual (coleção única `pianos`, sugestões entram com `status: 'pendente'`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pianos/{pianoId} {
      // Leitura pública de qualquer piano (o filtro por status "disponivel"/"manutencao"
      // acontece na query do app — ver lib/firebase/pianos.ts).
      allow read: if true;

      // Qualquer visitante pode sugerir um piano novo, mas só como "pendente"
      // e só com o formato de dado esperado — nunca sobrescrevendo um piano existente.
      allow create: if request.resource.data.status == 'pendente'
                    && request.resource.data.name is string
                    && request.resource.data.location is string
                    && request.resource.data.lat is number
                    && request.resource.data.lng is number;

      // Aprovar (mudar status de "pendente" para "disponivel"/"manutencao") e editar
      // pianos existentes fica de fora daqui de propósito — sem autenticação/admin
      // implementado ainda, isso é feito manualmente pelo Console do Firebase.
      allow update, delete: if false;
    }
  }
}
```

Sem autenticação de usuários implementada, não dá para restringir "só admins aprovam" via regras — por isso `update`/`delete` ficam bloqueados para todo mundo por enquanto, e a aprovação de sugestões é manual (editar o campo `status` direto no Console). Ver `contexto/status-e-proximos-passos.md` para os próximos passos dessa área (autenticação/admin).

## 4. Popular dados iniciais (opcional)

Os 6 pianos de exemplo que existiam hardcoded em `lib/pianos.ts` antes da migração para Firestore estão em `scripts/seed-pianos.mjs`. Para criá-los na sua coleção `pianos`:

```bash
pnpm seed
```

(Usa `node --env-file=.env.local`, sem dependência extra — precisa do `.env.local` já preenchido.)

## 5. Rodar o projeto

```bash
pnpm install
pnpm dev
```

A landing page (`/`) busca os pianos com `status` em `disponivel`/`manutencao` via `getPianos()` (`lib/firebase/pianos.ts`). O cadastro (`/cadastro`) grava um novo documento com `status: 'pendente'` via `submitPianoSuggestion()` — ele não aparece no mapa até alguém trocar o `status` manualmente no Console.
