# Pesquisa de APIs de Mapa (documento histórico)

> **Nota de contexto:** este é o documento de pesquisa original que embasou a escolha de tecnologia do projeto, antes da implementação. A decisão foi tomada e já está implementada: **Leaflet + react-leaflet**, com tiles do **CARTO Voyager** (ver `components/piano-map.tsx` e `package.json`). Mantido aqui como referência do racional por trás da escolha, não como tarefa em aberto.

## 1. Requisitos do Projeto

O objetivo deste projeto é desenvolver um site simples que exiba um mapa interativo com a localização de pianos em uma determinada região. As funcionalidades essenciais incluem:

*   **Exibição de Mapa:** Um mapa interativo que permita aos usuários visualizar a área e os marcadores de localização dos pianos.
*   **Marcadores de Pianos:** Pontos no mapa indicando a posição exata de cada piano.
*   **Botão de Rota:** Para cada piano, um botão que, ao ser clicado, direcione o usuário para um aplicativo de navegação (Google Maps ou Waze) com a rota pré-definida até o local do piano.
*   **Interface Simples:** Uma interface de usuário limpa e intuitiva, focada na funcionalidade principal.

## 2. Recomendações de APIs de Mapas Gratuitas

Para a implementação do mapa, foram pesquisadas diversas opções de APIs, considerando a gratuidade e os limites de uso. As principais alternativas ao Google Maps Platform, que possui um modelo de precificação mais complexo e pode exigir cartão de crédito para o nível gratuito, são:

| API de Mapa | Vantagens | Desvantagens | Limites do Nível Gratuito |
| :---------- | :-------- | :----------- | :------------------------ |
| **Leaflet** | Biblioteca JavaScript de código aberto, leve e flexível. Não possui custos diretos de uso, pois é uma biblioteca. | Requer um provedor de tiles separado. | Não há limites de uso para a biblioteca em si [1]. |
| **OpenStreetMap (via provedores de tiles)** | Dados de mapa abertos e gratuitos. Diversos provedores de tiles gratuitos compatíveis com Leaflet. | A qualidade e a atualização dos dados podem variar. | Depende do provedor de tiles; muitos oferecem uso gratuito com atribuição [2]. |
| **Mapbox** | Oferece mapas personalizáveis e SDKs robustos. | Nível gratuito com limites de uso que podem ser atingidos rapidamente em projetos populares. | 50.000 carregamentos de mapa por mês para mapas web [3]. |
| **Google Maps Platform** | Dados de mapa abrangentes e recursos avançados (geocodificação, rotas). | Modelo de precificação baseado em uso, pode ser caro se os limites do nível gratuito forem excedidos. Geralmente exige cartão de crédito para ativação. | 50.000 carregamentos de mapa dinâmicos por mês para mapas web (podem variar) [4]. |

**Recomendação (adotada):** A combinação de **Leaflet** com tiles do **OpenStreetMap** (ou outro provedor de tiles gratuito como CARTO, se os termos de uso forem adequados) foi escolhida devido à sua natureza de código aberto, gratuidade e flexibilidade. O projeto usa hoje tiles do CARTO Voyager (`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`), com atribuição ao OpenStreetMap mantida no rodapé.

## 3. Implementação do Botão de Rota

Esquemas de URL (Deep Links) que abrem diretamente os aplicativos de navegação Google Maps ou Waze com o destino pré-configurado. Implementado em `lib/pianos.ts` (`googleMapsUrl` e `wazeUrl`).

*   **Google Maps:** URL com as coordenadas de destino (`travelmode=walking`).
*   **Waze:** `https://waze.com/ul?ll={lat}%2C{lng}&navigate=yes`.

## 4. Tecnologias consideradas

*   **Front-end:** HTML, CSS e JavaScript — implementado como Next.js (App Router) + TypeScript + Tailwind CSS.
*   **Biblioteca de Mapas:** Leaflet.js via `react-leaflet`.
*   **Provedor de Tiles:** CARTO Voyager (compatível com atribuição OpenStreetMap).
*   **Geocodificação: implementada via Nominatim** (`lib/location.ts`). Opções cotadas na época: Geocodio (2.500 consultas/dia para EUA/Canadá, não cobre Brasil) e Nominatim (OpenStreetMap, cobertura global, uso justo sem chave) — Nominatim venceu por cobrir o Brasil sem custo. Usado tanto para busca de endereço quanto para reverse geocoding (GPS/clique no mapa → descrição textual) no formulário de cadastro.

## Referências

[1] [Leaflet - a JavaScript library for interactive maps](https://leafletjs.com/)
[2] [leaflet-extras/leaflet-providers](https://github.com/leaflet-extras/leaflet-providers)
[3] [Mapbox pricing](https://www.mapbox.com/pricing)
[4] [Google Maps vs Mapbox vs OpenStreetMap](https://brocoders.com/blog/mapbox-vs-google-maps-vs-openstreetmap/)
[5] [How to use Waze Deep Links](https://developers.google.com/waze/deeplinks)
[6] [Free Geocoding for US and Canadian Addresses](https://www.geocod.io/free-geocoding)
