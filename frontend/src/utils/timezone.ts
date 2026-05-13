// Mapping ville FIFA → fuseau IANA pour les stades CM 2026
const CITY_TZ: Record<string, string> = {
  // Mexique
  'México':              'America/Mexico_City',
  'Mexico':              'America/Mexico_City',
  'Ciudad de México':    'America/Mexico_City',
  'Mexico City':         'America/Mexico_City',
  'Guadalajara':         'America/Mexico_City',
  'Monterrey':           'America/Monterrey',
  // USA Est — Côte Est (Paris -6h en été)
  'New York':            'America/New_York',
  'New Jersey':          'America/New_York',
  'East Rutherford':     'America/New_York',
  'Miami':               'America/New_York',
  'Miami Gardens':       'America/New_York',
  'Philadelphia':        'America/New_York',
  'Philadelphie':        'America/New_York',
  'Boston':              'America/New_York',
  'Foxborough':          'America/New_York',
  'Atlanta':             'America/New_York',
  // USA Centre / Mexique — zone centrale (Paris -7h en été)
  'Dallas':              'America/Chicago',
  'Arlington':           'America/Chicago',
  'Kansas City':         'America/Chicago',
  'Houston':             'America/Chicago',
  // USA Pacifique — Côte Ouest (Paris -9h en été)
  'Los Angeles':         'America/Los_Angeles',
  'Inglewood':           'America/Los_Angeles',
  'Seattle':             'America/Los_Angeles',
  'San Francisco':       'America/Los_Angeles',
  'Santa Clara':         'America/Los_Angeles',
  // Canada
  'Vancouver':           'America/Vancouver',  // PT (Paris -9h)
  'Toronto':             'America/Toronto',     // ET (Paris -6h)
}

// Étiquette courte du fuseau pour les supporters français
const TZ_LABEL: Record<string, string> = {
  'America/New_York':    'ET',   // Côte Est — Paris -6h
  'America/Toronto':     'ET',
  'America/Chicago':     'CT',   // Centre — Paris -7h
  'America/Mexico_City': 'CT',
  'America/Monterrey':   'CT',
  'America/Denver':      'MT',   // Rocheuses — Paris -8h
  'America/Los_Angeles': 'PT',   // Côte Ouest — Paris -9h
  'America/Vancouver':   'PT',
}

export interface MatchTime {
  day:         string   // ex: "jeu. 11 juin"
  localTime:   string   // ex: "15:00"
  parisTime:   string   // ex: "21:00"
  localTz:     string   // ex: "America/Chicago"
  zoneLabel:   string   // ex: "CT"  (ET / CT / MT / PT)
  sameAsLocal: boolean  // true si l'utilisateur est déjà à Paris
}

export function formatMatchTime(isoDate: string, city: string): MatchTime {
  // Force interprétation UTC si la date n'a pas de suffixe Z ni offset
  const normalized = /[Z+]/.test(isoDate) ? isoDate : isoDate + 'Z'
  const d = new Date(normalized)

  if (isNaN(d.getTime())) {
    return { day: isoDate, localTime: '', parisTime: '', localTz: '', sameAsLocal: false }
  }

  const cityKey = Object.keys(CITY_TZ).find(k => city?.toLowerCase().includes(k.toLowerCase()))
  const localTz = cityKey ? CITY_TZ[cityKey] : 'UTC'

  const fmt = (tz: string, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleString('fr-FR', { timeZone: tz, ...opts })

  const day = fmt('Europe/Paris', { weekday: 'short', day: 'numeric', month: 'short' })
  const localTime = fmt(localTz, { hour: '2-digit', minute: '2-digit' })
  const parisTime = fmt('Europe/Paris', { hour: '2-digit', minute: '2-digit' })

  const zoneLabel = TZ_LABEL[localTz] ?? ''
  return { day, localTime, parisTime, localTz, zoneLabel, sameAsLocal: localTz === 'Europe/Paris' }
}
