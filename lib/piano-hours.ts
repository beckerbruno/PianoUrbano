// O campo `hours` do piano é texto livre digitado no cadastro (ex.: "Todos os
// dias, 8h às 20h" ou "Seg a sáb, 9h às 18h"). Este parser é heurístico: cobre
// os padrões usados no seed e no placeholder do formulário, e sempre que não
// consegue reconhecer dias/horário assume "disponível" em vez de esconder o
// piano por um parsing incompleto.

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

const DAY_TOKEN_TO_WEEKDAY: Record<string, Weekday> = {
  domingo: 0,
  dom: 0,
  segunda: 1,
  seg: 1,
  terca: 2,
  ter: 2,
  quarta: 3,
  qua: 3,
  quinta: 4,
  qui: 4,
  sexta: 5,
  sex: 5,
  sabado: 6,
  sab: 6,
}

const DAY_TOKEN_PATTERN =
  /\b(domingo|segunda|terca|quarta|quinta|sexta|sabado|dom|seg|ter|qua|qui|sex|sab)\b/g

const TIME_TOKEN_PATTERN = /\b(\d{1,2})(?:h(\d{2})?|:(\d{2}))\b/gi

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

function expandDayRange(start: Weekday, end: Weekday): Weekday[] {
  const days: Weekday[] = []
  let current = start
  while (true) {
    days.push(current)
    if (current === end) break
    current = ((current + 1) % 7) as Weekday
  }
  return days
}

function parseDays(normalizedHours: string): Weekday[] | null {
  if (
    normalizedHours.includes('todos os dias') ||
    normalizedHours.includes('todo dia') ||
    normalizedHours.includes('diariamente')
  ) {
    return null
  }

  const matches = [...normalizedHours.matchAll(DAY_TOKEN_PATTERN)]
  if (matches.length === 0) return null

  const weekdays = matches.map((match) => DAY_TOKEN_TO_WEEKDAY[match[0]])

  if (matches.length === 2) {
    const firstMatch = matches[0]
    const secondMatch = matches[1]
    const between = normalizedHours
      .slice(firstMatch.index! + firstMatch[0].length, secondMatch.index!)
      .trim()
    if (between === 'a' || between === '-' || between === 'ate' || between === 'até') {
      return expandDayRange(weekdays[0], weekdays[1])
    }
  }

  return Array.from(new Set(weekdays))
}

interface TimeRange {
  startMinutes: number
  endMinutes: number
}

function parseTimeRange(hoursText: string): TimeRange | null {
  const matches = [...hoursText.matchAll(TIME_TOKEN_PATTERN)]
  if (matches.length < 2) return null

  const toMinutes = (match: RegExpMatchArray): number | null => {
    const hours = Number(match[1])
    const minutes = Number(match[2] ?? match[3] ?? 0)
    if (hours > 23 || minutes > 59) return null
    return hours * 60 + minutes
  }

  const startMinutes = toMinutes(matches[0])
  const endMinutes = toMinutes(matches[1])
  if (startMinutes === null || endMinutes === null) return null

  return { startMinutes, endMinutes }
}

export function isPianoAvailableNow(hoursText: string, referenceDate: Date = new Date()): boolean {
  const days = parseDays(normalize(hoursText))
  if (days && !days.includes(referenceDate.getDay() as Weekday)) {
    return false
  }

  const timeRange = parseTimeRange(hoursText)
  if (!timeRange) return true

  const nowMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes()
  const { startMinutes, endMinutes } = timeRange

  if (startMinutes <= endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes
  }
  // Janela que atravessa a meia-noite (ex.: 22h às 6h)
  return nowMinutes >= startMinutes || nowMinutes <= endMinutes
}
