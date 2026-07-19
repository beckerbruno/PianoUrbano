# Status atual e próximos passos

> Este arquivo existe para não perder de vista o que já foi feito e, principalmente, o que ainda é **mock/placeholder** — coisas que parecem funcionar na UI mas não têm efeito real nenhum por trás.

## O que já funciona de verdade

- Landing page (`app/page.tsx`) com hero, seção "como funciona" e footer.
- Mapa interativo (`components/piano/piano-map.tsx`) via Leaflet/react-leaflet, com marcadores customizados (SVG inline) que mudam de cor por status (`disponivel` vs `manutencao`) e dão zoom/fly-to ao selecionar um piano.
- Lista de pianos (`components/piano/piano-list.tsx`) sincronizada por estado com o mapa (`components/piano/piano-explorer.tsx` guarda o `selectedId`).
- Botões de rota para Google Maps e Waze com deep links calculados a partir de lat/lng (`lib/pianos.ts`).
- Página `/cadastro` (`app/cadastro/page.tsx` + `components/piano/piano-form.tsx`) com formulário completo: nome, modelo, localização, tipo de ambiente, duas avaliações por estrelas (estado do piano / ambiente).
- **Localização no cadastro resolve lat/lng de verdade**, via `components/piano/piano-location-picker.tsx`, com três formas de informar o local (`lib/location.ts` faz a geocodificação/reverse geocoding via Nominatim/OpenStreetMap): escrever endereço, usar GPS do navegador, ou selecionar no mini-mapa.
- **Persistência real via Firebase/Firestore** (`lib/firebase/`):
  - `getPianos()` (`lib/firebase/pianos.ts`) busca a coleção `pianos` no Firestore e alimenta o mapa/lista — substitui os 6 pianos que antes eram hardcoded em `lib/pianos.ts`.
  - `submitPianoSuggestion()` grava um novo documento em `pianos` com `status: 'pendente'` — ele fica de fora do mapa público (que só mostra `disponivel`/`manutencao`) até alguém aprovar manualmente pelo Console do Firebase. Isso finalmente torna verdadeira a mensagem "passará por revisão da comunidade" que já existia na tela de sucesso do formulário.
  - Ver `contexto/firebase-setup.md` para o passo a passo de configurar um projeto Firebase real (o código já está pronto, falta só isso).

## O que é mock/placeholder (importante saber antes de "adicionar mais uma feature em cima")

- **O Firebase ainda não está conectado a um projeto real.** O código (`lib/firebase/`) está pronto e validado (`tsc`/`next build` passam), mas sem `.env.local` preenchido com credenciais reais (ver `contexto/firebase-setup.md`), qualquer leitura/escrita falha em runtime — a UI mostra mensagem de erro amigável em vez de quebrar, mas não há dado nenhum até isso ser configurado.
- **Não existe autenticação nem painel de admin.** Aprovar uma sugestão pendente (mudar `status` de `'pendente'` para `'disponivel'`) hoje é manual, direto no Console do Firebase. As Regras de Segurança recomendadas em `contexto/firebase-setup.md` bloqueiam `update`/`delete` para qualquer visitante justamente por não haver como distinguir "admin" de "visitante" ainda.
- **Geocodificação depende da API pública do Nominatim**, sem chave e com uso educado (busca só dispara por ação explícita do usuário, nunca a cada tecla, para respeitar a política de uso deles). Em produção com tráfego real, vale considerar self-host do Nominatim ou um provedor com SLA.
- **`next.config.mjs` tem `typescript.ignoreBuildErrors: true`.** O build passa mesmo com erros de tipo. Bom lembrar disso antes de assumir que "o build passou" significa "os tipos estão corretos" — vale revisar/remover antes de um deploy real.
- **Sem testes.** Não há nenhum teste unitário, de integração ou E2E configurado no projeto.
- **Sem internacionalização.** Todo o texto está hardcoded em pt-BR diretamente nos componentes — não há camada de i18n.

## Possíveis próximos passos (não solicitados ainda, só mapeados)

1. Criar o projeto Firebase real e preencher `.env.local` (passo a passo em `contexto/firebase-setup.md`) — sem isso, o app roda mas não mostra/salva pianos de verdade.
2. Rodar `pnpm seed` para popular a coleção `pianos` com os 6 pianos de exemplo, assim que o projeto Firebase estiver configurado.
3. Autenticação + painel de admin simples para aprovar/rejeitar sugestões pendentes sem precisar editar direto no Console do Firebase.
4. Remover `ignoreBuildErrors` e corrigir os erros de tipo que aparecerem.
5. Adicionar testes básicos (ao menos E2E do fluxo "selecionar piano → abrir rota", e do fluxo de localização + cadastro no Firestore).
