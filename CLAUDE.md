# Piano Urbano

Site que exibe um mapa interativo com pianos públicos espalhados por São Paulo, permitindo ao usuário ver detalhes de cada instrumento e traçar rota até ele pelo Google Maps ou Waze. Inclui também uma página de cadastro para a comunidade sugerir novos pianos.

Todo o texto de UI é em **pt-BR** — mantenha esse idioma em qualquer copy novo.

## Marca

- **Nome do produto:** Piano Urbano (o nome interno do repositório/pacote, `piano-urbano`, é o mesmo — não há mais o nome legado "Mapa de Pianos" em nenhuma copy).
- **Logo:** `public/logo-sem-fundo.png` (fundo transparente — usar em header/footer sobre qualquer cor de fundo) e `public/logo.png` (mesma arte com fundo sólido). O ícone de aba do navegador (favicon) é gerado a partir de `app/icon.png` (cópia da versão sem fundo), conforme a convenção de app icon do Next.js App Router.
- Ao adicionar a marca em uma nova tela, use `next/image` com a logo em vez de recriar o símbolo com ícones do lucide-react — o `Music` do lucide continua reservado para badges/decoração secundária (ex.: selo "Música livre pela cidade"), não para representar a marca em si.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (configuração CSS-first em `app/globals.css`, sem `tailwind.config`)
- **shadcn/ui** (`components.json`, style `base-nova`) + **lucide-react** para ícones
- **Leaflet** + **react-leaflet** para o mapa
- **Firebase (Firestore)** como banco de dados — coleção única `pianos`, lida/escrita direto do navegador via SDK client (sem backend próprio). Ver `contexto/firebase-setup.md` para configurar um projeto real.
- Gerenciador de pacotes: **pnpm**
- Alias de import: `@/*` aponta para a raiz do projeto (ver `tsconfig.json`)

## Estrutura

```
app/
  page.tsx            # landing page (hero + mapa/lista + "como funciona")
  cadastro/page.tsx    # formulário de cadastro de novo piano
  layout.tsx           # fontes (Inter + Lora), metadata, Vercel Analytics
  globals.css          # tokens de design (CSS vars) + imports Tailwind/Leaflet
components/
  piano/
    piano-explorer.tsx          # orquestra mapa + lista, guarda o piano selecionado
    piano-map.tsx               # mapa Leaflet, marcadores custom, fly-to no piano selecionado
    piano-list.tsx              # lista lateral, botões de rota (Google Maps / Waze)
    piano-form.tsx              # formulário de cadastro (client-side, ver limitações abaixo)
    piano-location-picker.tsx   # escolha de localização no cadastro: endereço / GPS / mapa
    piano-location-map-picker.tsx # mini-mapa Leaflet com marcador arrastável (usado pelo picker acima)
  ui/                    # componentes shadcn/ui
lib/
  pianos.ts             # tipo Piano (domínio) + helpers de deep link de rota — sem dados hardcoded
  location.ts           # geocodificação/reverse geocoding (Nominatim) + wrapper de navigator.geolocation
  firebase/
    config.ts            # inicialização do Firebase app + Firestore a partir de env vars
    pianos.ts             # acesso a dados: getPianos() (leitura) e submitPianoSuggestion() (escrita)
  utils.ts               # cn() etc.
scripts/
  seed-pianos.mjs        # popula a coleção `pianos` do Firestore com dados de exemplo (pnpm seed)
public/                  # assets estáticos (ícones, logo)
contexto/                # documentação de apoio (ver seção abaixo)
```

Componentes são organizados por domínio (`components/piano/`), não por tipo — ao adicionar um novo domínio (ex.: usuários, avaliações), crie uma nova subpasta em `components/` em vez de misturar tudo solto no topo.

## Design system

Os tokens de cor (`--brand`, `--house`, `--gold`, `--primary`, etc.) estão definidos em `app/globals.css` e documentados com o racional completo em `contexto/design-system.md`. Ao criar/ajustar UI, use os tokens já existentes em vez de inventar cores novas — consulte esse arquivo antes de propor um novo componente visual.

Pontos-chave já convencionados no código:
- Canvas cream (`--background: #f2f0eb`), nunca branco puro.
- Botões sempre em pill (`rounded-full`) com `active:scale-95`.
- Sombras em duas camadas suaves (`0px 0px .5px rgba(0,0,0,0.14), 0px 1px 1px rgba(0,0,0,0.24)`), nunca uma sombra única pesada.
- `font-serif` (Lora) só em títulos de destaque (hero, headings de card); corpo de texto usa `font-sans` (Inter).

## Banco de dados: Firebase (Firestore)

Os dados dos pianos vivem no Firestore, numa única coleção `pianos`. Não há backend próprio — o app lê e escreve direto do navegador com o SDK client do Firebase, então a segurança de verdade fica nas **Regras de Segurança do Firestore** (documentadas em `contexto/firebase-setup.md`), não em esconder a config.

- **Leitura** (`getPianos()` em `lib/firebase/pianos.ts`): busca documentos com `status` em `disponivel`/`manutencao`. Usado por `components/piano/piano-explorer.tsx` num `useEffect` (fetch client-side, nunca durante o build/SSR).
- **Escrita** (`submitPianoSuggestion()` em `lib/firebase/pianos.ts`): o formulário de cadastro (`components/piano/piano-form.tsx`) grava um novo documento com `status: 'pendente'` — fica de fora do mapa público até alguém trocar o status manualmente pelo Console do Firebase (ainda não há autenticação/admin).
- Config em `lib/firebase/config.ts`, lida de env vars `NEXT_PUBLIC_FIREBASE_*` (ver `.env.example`). A inicialização nunca lança erro por env var ausente — só falha (com mensagem amigável na UI) ao tentar de fato ler/escrever, para não quebrar o build sem credenciais configuradas.
- Setup completo de um projeto Firebase real (criar projeto, Firestore, regras de segurança, seed de dados): `contexto/firebase-setup.md`.

## Estado atual da implementação

O mapa, a lista e os deep links de rota funcionam de ponta a ponta, lendo do Firestore. No cadastro, a localização já resolve lat/lng de verdade (endereço via Nominatim, GPS do navegador ou clique no mapa — ver `components/piano/piano-location-picker.tsx`) e o envio grava mesmo no Firestore. **O que falta é conectar a um projeto Firebase real** — sem `.env.local` preenchido (ver `contexto/firebase-setup.md`), não há dado nenhum para mostrar. Antes de estender qualquer fluxo de "cadastrar/editar piano", leia `contexto/status-e-proximos-passos.md` — ele lista exatamente o que ainda é mock/pendente.

## Comandos

```
pnpm dev      # desenvolvimento
pnpm build    # build de produção
pnpm start    # servir build de produção
pnpm lint     # eslint
pnpm seed     # popula a coleção `pianos` do Firestore com dados de exemplo (precisa de .env.local)
```

## Pasta contexto/

- `contexto/design-system.md` — sistema de design completo (cores, tipografia, componentes, espaçamento) que fundamenta os tokens em `app/globals.css`.
- `contexto/pesquisa-apis-mapa.md` — pesquisa original que embasou a escolha de Leaflet + OpenStreetMap/CARTO sobre Google Maps/Mapbox, e o mecanismo de deep links de rota.
- `contexto/firebase-setup.md` — passo a passo para configurar um projeto Firebase real (Firestore, env vars, regras de segurança, seed de dados).
- `contexto/status-e-proximos-passos.md` — o que está implementado de verdade vs. o que é mock/placeholder, e possíveis próximos passos.
