import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Moon, MapPin } from 'lucide-react'
import { FlagImg } from '../utils/flags'
import { matchesApi } from '../services/api'
import type { GroupStanding, BracketEntry } from '../services/api'

// ── Noms français des équipes ────────────────────────────────────
const TEAM_NAMES: Record<string, string> = {
  MEX:'Mexique', KOR:'Corée du Sud', CZE:'Tchéquie', RSA:'Afrique du Sud',
  CAN:'Canada', BIH:'Bosnie-Herzégovine', QAT:'Qatar', SUI:'Suisse',
  BRA:'Brésil', MAR:'Maroc', HAI:'Haïti', SCO:'Écosse',
  USA:'États-Unis', AUS:'Australie', TUR:'Türkiye', PAR:'Paraguay',
  GER:'Allemagne', CIV:"Côte d'Ivoire", ECU:'Équateur', CUW:'Curaçao',
  NED:'Pays-Bas', SWE:'Suède', JPN:'Japon', TUN:'Tunisie',
  BEL:'Belgique', EGY:'Égypte', IRN:'Iran', NZL:'Nouvelle-Zélande',
  ESP:'Espagne', CPV:'Cap-Vert', KSA:'Arabie Saoudite', URU:'Uruguay',
  FRA:'France', SEN:'Sénégal', IRQ:'Irak', NOR:'Norvège',
  ARG:'Argentine', ALG:'Algérie', AUT:'Autriche', JOR:'Jordanie',
  POR:'Portugal', COD:'RD Congo', UZB:'Ouzbékistan', COL:'Colombie',
  ENG:'Angleterre', CRO:'Croatie', GHA:'Ghana', PAN:'Panama',
}

// ── Structures de données ────────────────────────────────────────
interface GroupMatch {
  id: string; group: string; home: string; away: string
  date: string; time: string; venue: string; city: string
}
interface KOMatch {
  id: string; round: string; homeLabel: string; awayLabel: string
  date: string; time: string; venue: string; city: string
}

// ── 72 matchs de poule (FIFA, heures Paris CEST = UTC+2) ─────────
const GROUP_MATCHES: GroupMatch[] = [
  // Groupe A
  { id:'GA1', group:'A', home:'MEX', away:'RSA', date:'2026-06-11', time:'21:00', venue:'Estadio Azteca',          city:'Mexico'        },
  { id:'GA2', group:'A', home:'KOR', away:'CZE', date:'2026-06-12', time:'04:00', venue:'Estadio Akron',           city:'Guadalajara'   },
  { id:'GA3', group:'A', home:'CZE', away:'RSA', date:'2026-06-18', time:'18:00', venue:'Estadio Akron',           city:'Guadalajara'   },
  { id:'GA4', group:'A', home:'MEX', away:'KOR', date:'2026-06-19', time:'03:00', venue:'Estadio Azteca',          city:'Mexico'        },
  { id:'GA5', group:'A', home:'CZE', away:'MEX', date:'2026-06-25', time:'03:00', venue:'Estadio Azteca',          city:'Mexico'        },
  { id:'GA6', group:'A', home:'RSA', away:'KOR', date:'2026-06-25', time:'03:00', venue:'Estadio Akron',           city:'Guadalajara'   },
  // Groupe B
  { id:'GB1', group:'B', home:'CAN', away:'BIH', date:'2026-06-12', time:'21:00', venue:'BMO Field',               city:'Toronto'       },
  { id:'GB2', group:'B', home:'QAT', away:'SUI', date:'2026-06-13', time:'21:00', venue:'BC Place',                city:'Vancouver'     },
  { id:'GB3', group:'B', home:'SUI', away:'BIH', date:'2026-06-18', time:'21:00', venue:'BC Place',                city:'Vancouver'     },
  { id:'GB4', group:'B', home:'CAN', away:'QAT', date:'2026-06-19', time:'00:00', venue:'BMO Field',               city:'Toronto'       },
  { id:'GB5', group:'B', home:'SUI', away:'CAN', date:'2026-06-24', time:'21:00', venue:'BC Place',                city:'Vancouver'     },
  { id:'GB6', group:'B', home:'BIH', away:'QAT', date:'2026-06-24', time:'21:00', venue:'BMO Field',               city:'Toronto'       },
  // Groupe C
  { id:'GC1', group:'C', home:'BRA', away:'MAR', date:'2026-06-14', time:'00:00', venue:'Hard Rock Stadium',        city:'Miami'         },
  { id:'GC2', group:'C', home:'HAI', away:'SCO', date:'2026-06-14', time:'03:00', venue:'Mercedes-Benz Stadium',   city:'Atlanta'       },
  { id:'GC3', group:'C', home:'SCO', away:'MAR', date:'2026-06-20', time:'00:00', venue:'Mercedes-Benz Stadium',   city:'Atlanta'       },
  { id:'GC4', group:'C', home:'BRA', away:'HAI', date:'2026-06-20', time:'02:30', venue:'Hard Rock Stadium',        city:'Miami'         },
  { id:'GC5', group:'C', home:'SCO', away:'BRA', date:'2026-06-25', time:'00:00', venue:'Hard Rock Stadium',        city:'Miami'         },
  { id:'GC6', group:'C', home:'MAR', away:'HAI', date:'2026-06-25', time:'00:00', venue:'Mercedes-Benz Stadium',   city:'Atlanta'       },
  // Groupe D
  { id:'GD1', group:'D', home:'USA', away:'PAR', date:'2026-06-13', time:'03:00', venue:'SoFi Stadium',            city:'Los Angeles'   },
  { id:'GD2', group:'D', home:'AUS', away:'TUR', date:'2026-06-14', time:'06:00', venue:'AT&T Stadium',            city:'Dallas'        },
  { id:'GD3', group:'D', home:'USA', away:'AUS', date:'2026-06-19', time:'21:00', venue:'SoFi Stadium',            city:'Los Angeles'   },
  { id:'GD4', group:'D', home:'TUR', away:'PAR', date:'2026-06-20', time:'05:00', venue:'AT&T Stadium',            city:'Dallas'        },
  { id:'GD5', group:'D', home:'TUR', away:'USA', date:'2026-06-26', time:'04:00', venue:'AT&T Stadium',            city:'Dallas'        },
  { id:'GD6', group:'D', home:'PAR', away:'AUS', date:'2026-06-26', time:'04:00', venue:'SoFi Stadium',            city:'Los Angeles'   },
  // Groupe E
  { id:'GE1', group:'E', home:'GER', away:'CUW', date:'2026-06-14', time:'19:00', venue:'Estadio BBVA',            city:'Monterrey'     },
  { id:'GE2', group:'E', home:'CIV', away:'ECU', date:'2026-06-15', time:'01:00', venue:'NRG Stadium',             city:'Houston'       },
  { id:'GE3', group:'E', home:'GER', away:'CIV', date:'2026-06-20', time:'22:00', venue:'Estadio BBVA',            city:'Monterrey'     },
  { id:'GE4', group:'E', home:'ECU', away:'CUW', date:'2026-06-21', time:'02:00', venue:'NRG Stadium',             city:'Houston'       },
  { id:'GE5', group:'E', home:'CUW', away:'CIV', date:'2026-06-25', time:'22:00', venue:'NRG Stadium',             city:'Houston'       },
  { id:'GE6', group:'E', home:'ECU', away:'GER', date:'2026-06-25', time:'22:00', venue:'Estadio BBVA',            city:'Monterrey'     },
  // Groupe F
  { id:'GF1', group:'F', home:'NED', away:'JPN', date:'2026-06-14', time:'22:00', venue:'MetLife Stadium',         city:'New York/NJ'   },
  { id:'GF2', group:'F', home:'SWE', away:'TUN', date:'2026-06-15', time:'04:00', venue:'Lincoln Financial Field', city:'Philadelphie'  },
  { id:'GF3', group:'F', home:'NED', away:'SWE', date:'2026-06-20', time:'19:00', venue:'MetLife Stadium',         city:'New York/NJ'   },
  { id:'GF4', group:'F', home:'TUN', away:'JPN', date:'2026-06-21', time:'06:00', venue:'Lincoln Financial Field', city:'Philadelphie'  },
  { id:'GF5', group:'F', home:'JPN', away:'SWE', date:'2026-06-26', time:'01:00', venue:'MetLife Stadium',         city:'New York/NJ'   },
  { id:'GF6', group:'F', home:'TUN', away:'NED', date:'2026-06-26', time:'01:00', venue:'Lincoln Financial Field', city:'Philadelphie'  },
  // Groupe G
  { id:'GG1', group:'G', home:'BEL', away:'EGY', date:'2026-06-15', time:'21:00', venue:"Levi's Stadium",         city:'San Francisco' },
  { id:'GG2', group:'G', home:'IRN', away:'NZL', date:'2026-06-16', time:'03:00', venue:'Lumen Field',             city:'Seattle'       },
  { id:'GG3', group:'G', home:'BEL', away:'IRN', date:'2026-06-21', time:'21:00', venue:"Levi's Stadium",         city:'San Francisco' },
  { id:'GG4', group:'G', home:'NZL', away:'EGY', date:'2026-06-22', time:'03:00', venue:'Lumen Field',             city:'Seattle'       },
  { id:'GG5', group:'G', home:'EGY', away:'IRN', date:'2026-06-27', time:'05:00', venue:'Lumen Field',             city:'Seattle'       },
  { id:'GG6', group:'G', home:'NZL', away:'BEL', date:'2026-06-27', time:'05:00', venue:"Levi's Stadium",         city:'San Francisco' },
  // Groupe H
  { id:'GH1', group:'H', home:'ESP', away:'CPV', date:'2026-06-15', time:'18:00', venue:'Estadio Azteca',          city:'Mexico'        },
  { id:'GH2', group:'H', home:'KSA', away:'URU', date:'2026-06-16', time:'00:00', venue:'Estadio BBVA',            city:'Monterrey'     },
  { id:'GH3', group:'H', home:'ESP', away:'KSA', date:'2026-06-21', time:'18:00', venue:'Estadio Azteca',          city:'Mexico'        },
  { id:'GH4', group:'H', home:'URU', away:'CPV', date:'2026-06-22', time:'00:00', venue:'Estadio BBVA',            city:'Monterrey'     },
  { id:'GH5', group:'H', home:'CPV', away:'KSA', date:'2026-06-27', time:'02:00', venue:'Estadio BBVA',            city:'Monterrey'     },
  { id:'GH6', group:'H', home:'URU', away:'ESP', date:'2026-06-27', time:'02:00', venue:'Estadio Azteca',          city:'Mexico'        },
  // Groupe I
  { id:'GI1', group:'I', home:'FRA', away:'SEN', date:'2026-06-16', time:'21:00', venue:'AT&T Stadium',            city:'Dallas'        },
  { id:'GI2', group:'I', home:'IRQ', away:'NOR', date:'2026-06-17', time:'00:00', venue:'Arrowhead Stadium',       city:'Kansas City'   },
  { id:'GI3', group:'I', home:'FRA', away:'IRQ', date:'2026-06-22', time:'23:00', venue:'AT&T Stadium',            city:'Dallas'        },
  { id:'GI4', group:'I', home:'NOR', away:'SEN', date:'2026-06-23', time:'02:00', venue:'Arrowhead Stadium',       city:'Kansas City'   },
  { id:'GI5', group:'I', home:'NOR', away:'FRA', date:'2026-06-26', time:'21:00', venue:'Arrowhead Stadium',       city:'Kansas City'   },
  { id:'GI6', group:'I', home:'SEN', away:'IRQ', date:'2026-06-26', time:'21:00', venue:'AT&T Stadium',            city:'Dallas'        },
  // Groupe J
  { id:'GJ1', group:'J', home:'ARG', away:'ALG', date:'2026-06-17', time:'03:00', venue:'MetLife Stadium',         city:'New York/NJ'   },
  { id:'GJ2', group:'J', home:'AUT', away:'JOR', date:'2026-06-17', time:'06:00', venue:'Gillette Stadium',        city:'Boston'        },
  { id:'GJ3', group:'J', home:'ARG', away:'AUT', date:'2026-06-22', time:'19:00', venue:'MetLife Stadium',         city:'New York/NJ'   },
  { id:'GJ4', group:'J', home:'JOR', away:'ALG', date:'2026-06-23', time:'05:00', venue:'Gillette Stadium',        city:'Boston'        },
  { id:'GJ5', group:'J', home:'JOR', away:'ARG', date:'2026-06-28', time:'04:00', venue:'Gillette Stadium',        city:'Boston'        },
  { id:'GJ6', group:'J', home:'ALG', away:'AUT', date:'2026-06-28', time:'04:00', venue:'MetLife Stadium',         city:'New York/NJ'   },
  // Groupe K
  { id:'GK1', group:'K', home:'POR', away:'COD', date:'2026-06-17', time:'19:00', venue:'Hard Rock Stadium',       city:'Miami'         },
  { id:'GK2', group:'K', home:'UZB', away:'COL', date:'2026-06-18', time:'04:00', venue:'SoFi Stadium',            city:'Los Angeles'   },
  { id:'GK3', group:'K', home:'POR', away:'UZB', date:'2026-06-23', time:'19:00', venue:'Hard Rock Stadium',       city:'Miami'         },
  { id:'GK4', group:'K', home:'COL', away:'COD', date:'2026-06-24', time:'04:00', venue:'SoFi Stadium',            city:'Los Angeles'   },
  { id:'GK5', group:'K', home:'COL', away:'POR', date:'2026-06-28', time:'01:30', venue:'SoFi Stadium',            city:'Los Angeles'   },
  { id:'GK6', group:'K', home:'COD', away:'UZB', date:'2026-06-28', time:'01:30', venue:'Hard Rock Stadium',       city:'Miami'         },
  // Groupe L
  { id:'GL1', group:'L', home:'ENG', away:'CRO', date:'2026-06-17', time:'22:00', venue:'Gillette Stadium',        city:'Boston'        },
  { id:'GL2', group:'L', home:'GHA', away:'PAN', date:'2026-06-18', time:'01:00', venue:'Mercedes-Benz Stadium',   city:'Atlanta'       },
  { id:'GL3', group:'L', home:'ENG', away:'GHA', date:'2026-06-23', time:'22:00', venue:'Gillette Stadium',        city:'Boston'        },
  { id:'GL4', group:'L', home:'PAN', away:'CRO', date:'2026-06-24', time:'01:00', venue:'Mercedes-Benz Stadium',   city:'Atlanta'       },
  { id:'GL5', group:'L', home:'PAN', away:'ENG', date:'2026-06-27', time:'23:00', venue:'Mercedes-Benz Stadium',   city:'Atlanta'       },
  { id:'GL6', group:'L', home:'CRO', away:'GHA', date:'2026-06-27', time:'23:00', venue:'Gillette Stadium',        city:'Boston'        },
]

// ── 32 matchs éliminatoires ──────────────────────────────────────
const KO_MATCHES: KOMatch[] = [
  { id:'M73',  round:'round32', homeLabel:'2e Gr. A',          awayLabel:'2e Gr. B',           date:'2026-06-28', time:'21:00', venue:'SoFi Stadium',            city:'Los Angeles'  },
  { id:'M76',  round:'round32', homeLabel:'1er Gr. C',         awayLabel:'2e Gr. F',           date:'2026-06-29', time:'19:00', venue:'NRG Stadium',             city:'Houston'      },
  { id:'M74',  round:'round32', homeLabel:'1er Gr. E',         awayLabel:'3e Gr. A/B/C/D/F',  date:'2026-06-29', time:'22:30', venue:'Gillette Stadium',        city:'Boston'       },
  { id:'M75',  round:'round32', homeLabel:'1er Gr. F',         awayLabel:'2e Gr. C',           date:'2026-06-30', time:'03:00', venue:'Estadio BBVA',            city:'Monterrey'    },
  { id:'M78',  round:'round32', homeLabel:'2e Gr. E',          awayLabel:'2e Gr. I',           date:'2026-06-30', time:'19:00', venue:'AT&T Stadium',            city:'Dallas'       },
  { id:'M77',  round:'round32', homeLabel:'1er Gr. I',         awayLabel:'3e Gr. C/D/F/G/H',  date:'2026-06-30', time:'23:00', venue:'MetLife Stadium',         city:'New York/NJ'  },
  { id:'M79',  round:'round32', homeLabel:'1er Gr. A',         awayLabel:'3e Gr. C/E/F/H/I',  date:'2026-07-01', time:'03:00', venue:'Estadio Azteca',          city:'Mexico'       },
  { id:'M80',  round:'round32', homeLabel:'1er Gr. L',         awayLabel:'3e Gr. E/H/I/J/K',  date:'2026-07-01', time:'18:00', venue:'Mercedes-Benz Stadium',  city:'Atlanta'      },
  { id:'M82',  round:'round32', homeLabel:'1er Gr. G',         awayLabel:'3e Gr. A/E/H/I/J',  date:'2026-07-01', time:'22:00', venue:'Lumen Field',             city:'Seattle'      },
  { id:'M81',  round:'round32', homeLabel:'1er Gr. D',         awayLabel:'3e Gr. B/E/F/I/J',  date:'2026-07-02', time:'02:00', venue:"Levi's Stadium",          city:'San Francisco'},
  { id:'M84',  round:'round32', homeLabel:'1er Gr. H',         awayLabel:'2e Gr. J',           date:'2026-07-02', time:'21:00', venue:'SoFi Stadium',            city:'Los Angeles'  },
  { id:'M83',  round:'round32', homeLabel:'2e Gr. K',          awayLabel:'2e Gr. L',           date:'2026-07-03', time:'01:00', venue:'BMO Field',               city:'Toronto'      },
  { id:'M85',  round:'round32', homeLabel:'1er Gr. B',         awayLabel:'3e Gr. E/F/G/I/J',  date:'2026-07-03', time:'05:00', venue:'BC Place',                city:'Vancouver'    },
  { id:'M88',  round:'round32', homeLabel:'2e Gr. D',          awayLabel:'2e Gr. G',           date:'2026-07-03', time:'20:00', venue:'AT&T Stadium',            city:'Dallas'       },
  { id:'M86',  round:'round32', homeLabel:'1er Gr. J',         awayLabel:'2e Gr. H',           date:'2026-07-04', time:'00:00', venue:'Hard Rock Stadium',       city:'Miami'        },
  { id:'M87',  round:'round32', homeLabel:'1er Gr. K',         awayLabel:'3e Gr. D/E/I/J/L',  date:'2026-07-04', time:'03:30', venue:'Arrowhead Stadium',       city:'Kansas City'  },
  { id:'M90',  round:'round16', homeLabel:'V. (2e A / 2e B)',       awayLabel:'V. (1er F / 2e C)',      date:'2026-07-04', time:'19:00', venue:'NRG Stadium',             city:'Houston'      },
  { id:'M89',  round:'round16', homeLabel:'V. (1er E / 3e ABCDF)', awayLabel:'V. (1er I / 3e CDFGH)', date:'2026-07-04', time:'23:00', venue:'Lincoln Financial Field', city:'Philadelphie' },
  { id:'M91',  round:'round16', homeLabel:'V. (1er C / 2e F)',      awayLabel:'V. (2e E / 2e I)',       date:'2026-07-05', time:'22:00', venue:'MetLife Stadium',         city:'New York/NJ'  },
  { id:'M92',  round:'round16', homeLabel:'V. (1er A / 3e CEFHI)', awayLabel:'V. (1er L / 3e EHIJK)', date:'2026-07-06', time:'02:00', venue:'Estadio Azteca',          city:'Mexico'       },
  { id:'M93',  round:'round16', homeLabel:'V. (2e K / 2e L)',       awayLabel:'V. (1er H / 2e J)',      date:'2026-07-06', time:'21:00', venue:'AT&T Stadium',            city:'Dallas'       },
  { id:'M94',  round:'round16', homeLabel:'V. (1er D / 3e BEFIJ)', awayLabel:'V. (1er G / 3e AEHIJ)', date:'2026-07-07', time:'02:00', venue:'Lumen Field',             city:'Seattle'      },
  { id:'M95',  round:'round16', homeLabel:'V. (1er J / 2e H)',      awayLabel:'V. (2e D / 2e G)',       date:'2026-07-07', time:'18:00', venue:'Mercedes-Benz Stadium',  city:'Atlanta'      },
  { id:'M96',  round:'round16', homeLabel:'V. (1er B / 3e EFGIJ)', awayLabel:'V. (1er K / 3e DEIJL)', date:'2026-07-07', time:'22:00', venue:'BC Place',                city:'Vancouver'    },
  { id:'M97',  round:'quarter', homeLabel:'V. 8e Philadelphie', awayLabel:'V. 8e Houston',     date:'2026-07-09', time:'22:00', venue:'Gillette Stadium',  city:'Boston'      },
  { id:'M98',  round:'quarter', homeLabel:'V. 8e Dallas',       awayLabel:'V. 8e Seattle',     date:'2026-07-10', time:'21:00', venue:'SoFi Stadium',      city:'Los Angeles' },
  { id:'M99',  round:'quarter', homeLabel:'V. 8e New York/NJ',  awayLabel:'V. 8e Mexico',      date:'2026-07-11', time:'23:00', venue:'Hard Rock Stadium', city:'Miami'       },
  { id:'M100', round:'quarter', homeLabel:'V. 8e Atlanta',      awayLabel:'V. 8e Vancouver',   date:'2026-07-12', time:'03:00', venue:'Arrowhead Stadium', city:'Kansas City' },
  { id:'M101', round:'semi',    homeLabel:'V. QF Boston',       awayLabel:'V. QF Los Angeles', date:'2026-07-14', time:'21:00', venue:'AT&T Stadium',           city:'Dallas'      },
  { id:'M102', round:'semi',    homeLabel:'V. QF Miami',        awayLabel:'V. QF Kansas City', date:'2026-07-15', time:'21:00', venue:'Mercedes-Benz Stadium', city:'Atlanta'     },
  { id:'M103', round:'third',   homeLabel:'Perdant DF Dallas',  awayLabel:'Perdant DF Atlanta', date:'2026-07-18', time:'23:00', venue:'Hard Rock Stadium', city:'Miami'       },
  { id:'M104', round:'final',   homeLabel:'Vainqueur DF Dallas',awayLabel:'Vainqueur DF Atlanta', date:'2026-07-19', time:'21:00', venue:'MetLife Stadium', city:'New York/NJ' },
]

// ── Constantes ───────────────────────────────────────────────────
const ROUND_LABELS: Record<string, string> = {
  round32: '16es de finale', round16: '8es de finale',
  quarter: 'Quarts de finale', semi: 'Demi-finales',
  third: 'Match pour la 3e place', final: 'Finale',
}
const ROUND_ORDER = ['round32','round16','quarter','semi','third','final']

const ROUND_TO_STAGE: Record<string, string> = {
  round32: 'Round of 32', round16: 'Round of 16',
  quarter: 'Quarter-final', semi: 'Semi-final',
  third: 'Third Place', final: 'Final',
}

const ROUND_STYLES: Record<string, { dot: string; label: string; accent: string }> = {
  round32: { dot: 'bg-sky-500',    label: 'text-sky-600 dark:text-sky-400',       accent: 'from-sky-500/10'    },
  round16: { dot: 'bg-violet-500', label: 'text-violet-600 dark:text-violet-400', accent: 'from-violet-500/10' },
  quarter: { dot: 'bg-orange-500', label: 'text-orange-500 dark:text-orange-400', accent: 'from-orange-500/10' },
  semi:    { dot: 'bg-rose-500',   label: 'text-rose-600 dark:text-rose-400',     accent: 'from-rose-500/10'   },
  third:   { dot: 'bg-amber-600',  label: 'text-amber-600 dark:text-amber-500',   accent: 'from-amber-500/10'  },
  final:   { dot: 'bg-yellow-400', label: 'text-yellow-500 dark:text-yellow-400', accent: 'from-yellow-400/10' },
}

// ── Interfaces ───────────────────────────────────────────────────
interface ResolvedTeam { name: string; code: string }

// ── Utilitaires ──────────────────────────────────────────────────
function isNight(time: string) { return time < '06:00' }

function displayDate(date: string, time: string): string {
  if (!isNight(time)) return date
  const d = new Date(date + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

function formatDayFull(dateStr: string): { weekday: string; date: string } {
  const d = new Date(dateStr + 'T12:00:00Z')
  return {
    weekday: d.toLocaleDateString('fr-FR', { weekday: 'long' }),
    date: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
}

function formatDayShort(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00Z').toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short',
  })
}

function resolveGroupLabel(
  label: string,
  standingsLookup: Record<string, GroupStanding['teams']>
): ResolvedTeam | null {
  const m = label.match(/^(1er|2e) Gr\. ([A-L])$/)
  if (!m) return null
  const pos = m[1] === '1er' ? 0 : 1
  const group = m[2]
  const teams = standingsLookup[group]
  if (!teams) return null
  const team = teams[pos]
  if (!team || team.played === 0) return null
  return { name: TEAM_NAMES[team.code] ?? team.name, code: team.code }
}

// ── Composants visuels ───────────────────────────────────────────

function TimeChip({ time }: { time: string }) {
  const night = isNight(time)
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold tabular-nums rounded-full px-3 py-1 shrink-0 ${
      night
        ? 'bg-indigo-950 text-indigo-200 border border-indigo-700/60 shadow-sm shadow-indigo-950'
        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
    }`}>
      {night && <Moon className="w-2.5 h-2.5 shrink-0" />}
      {time}
    </span>
  )
}

function GroupMatchCard({ m }: { m: GroupMatch }) {
  const homeName = TEAM_NAMES[m.home] || m.home
  const awayName = TEAM_NAMES[m.away] || m.away
  const night = isNight(m.time)

  return (
    <div className={`group relative overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-px hover:shadow-lg ${
      night
        ? 'bg-[#06101f] border border-indigo-900/50 shadow-md shadow-indigo-950/60'
        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
    }`}>
      {/* shimmer top */}
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
        night ? 'via-indigo-400/50' : 'via-blue-300/50 dark:via-slate-500/30'
      } to-transparent`} />

      <div className="p-4 pb-3.5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[9px] font-black tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border ${
            night
              ? 'text-indigo-300/80 bg-indigo-900/20 border-indigo-800/40'
              : 'text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}>
            Groupe {m.group}
          </span>
          <TimeChip time={m.time} />
        </div>

        {/* Teams */}
        <div className="flex items-center gap-2">
          {/* Home */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <FlagImg code={m.home} size={32} className="shrink-0 drop-shadow-sm" />
            <span className={`font-bold text-lg leading-tight truncate ${
              night ? 'text-white' : 'text-slate-900 dark:text-slate-100'
            }`}>{homeName}</span>
          </div>

          <span className={`shrink-0 font-thin text-xl px-1 ${
            night ? 'text-indigo-800/80' : 'text-slate-200 dark:text-slate-700'
          }`}>—</span>

          {/* Away */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            <span className={`font-bold text-lg leading-tight truncate text-right ${
              night ? 'text-white' : 'text-slate-900 dark:text-slate-100'
            }`}>{awayName}</span>
            <FlagImg code={m.away} size={32} className="shrink-0 drop-shadow-sm" />
          </div>
        </div>

        {/* Venue */}
        <div className={`mt-3 flex items-center gap-1.5 text-[10px] tracking-wide ${
          night ? 'text-indigo-400/50' : 'text-slate-400 dark:text-slate-600'
        }`}>
          <MapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{m.venue} · {m.city}</span>
        </div>
      </div>
    </div>
  )
}

function KOMatchCard({
  m,
  resolvedHome,
  resolvedAway,
}: {
  m: KOMatch
  resolvedHome: ResolvedTeam | null
  resolvedAway: ResolvedTeam | null
}) {
  const night = isNight(m.time)

  return (
    <div className={`relative overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-px hover:shadow-lg ${
      night
        ? 'bg-[#06101f] border border-indigo-900/50 shadow-md shadow-indigo-950/60'
        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
    }`}>
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
        night ? 'via-indigo-400/50' : 'via-amber-300/60 dark:via-amber-600/30'
      } to-transparent`} />

      <div className="p-4 pb-3.5">
        <div className="flex justify-end mb-4">
          <TimeChip time={m.time} />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {resolvedHome ? (
              <>
                <FlagImg code={resolvedHome.code} size={32} className="shrink-0 drop-shadow-sm" />
                <span className={`font-bold text-lg leading-tight truncate ${
                  night ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                }`}>{resolvedHome.name}</span>
              </>
            ) : (
              <span className={`text-sm font-medium italic truncate leading-tight ${
                night ? 'text-indigo-400/60' : 'text-slate-400 dark:text-slate-500'
              }`}>{m.homeLabel}</span>
            )}
          </div>

          <span className={`shrink-0 font-thin text-xl px-1 ${
            night ? 'text-indigo-800/80' : 'text-slate-200 dark:text-slate-700'
          }`}>—</span>

          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            {resolvedAway ? (
              <>
                <span className={`font-bold text-lg leading-tight truncate text-right ${
                  night ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                }`}>{resolvedAway.name}</span>
                <FlagImg code={resolvedAway.code} size={32} className="shrink-0 drop-shadow-sm" />
              </>
            ) : (
              <span className={`text-sm font-medium italic truncate text-right leading-tight ${
                night ? 'text-indigo-400/60' : 'text-slate-400 dark:text-slate-500'
              }`}>{m.awayLabel}</span>
            )}
          </div>
        </div>

        <div className={`mt-3 flex items-center gap-1.5 text-[10px] tracking-wide ${
          night ? 'text-indigo-400/50' : 'text-slate-400 dark:text-slate-600'
        }`}>
          <MapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{m.venue} · {m.city}</span>
        </div>
      </div>
    </div>
  )
}

// ── Page principale ──────────────────────────────────────────────
export default function Calendar() {
  const [tab, setTab] = useState<'group' | 'ko'>('group')

  const { data: standingsData } = useQuery({
    queryKey: ['group-standings'],
    queryFn: () => matchesApi.getGroupStandings().then(r => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const { data: bracketData } = useQuery({
    queryKey: ['ko-bracket'],
    queryFn: () => matchesApi.getBracket().then(r => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const standingsLookup = useMemo(() => {
    if (!standingsData) return {} as Record<string, GroupStanding['teams']>
    return Object.fromEntries(standingsData.map(s => [s.group, s.teams]))
  }, [standingsData])

  const bracketLookup = useMemo((): Record<string, BracketEntry[]> => {
    if (!bracketData) return {}
    return Object.fromEntries(
      Object.entries(ROUND_TO_STAGE).map(([round, stage]) => [round, bracketData[stage] ?? []])
    )
  }, [bracketData])

  const groupedByDate = useMemo(() => {
    const byDate: Record<string, GroupMatch[]> = {}
    for (const m of GROUP_MATCHES) {
      const d = displayDate(m.date, m.time)
      if (!byDate[d]) byDate[d] = []
      byDate[d].push(m)
    }
    for (const d in byDate)
      byDate[d].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    return Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b))
  }, [])

  const koByRound = useMemo(() => {
    const byRound: Record<string, KOMatch[]> = {}
    for (const m of KO_MATCHES) {
      if (!byRound[m.round]) byRound[m.round] = []
      byRound[m.round].push(m)
    }
    for (const r in byRound)
      byRound[r].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    return ROUND_ORDER.filter(r => byRound[r]).map(r => ({ round: r, matches: byRound[r] }))
  }, [])

  return (
    <div className="animate-fade-up">
      <Helmet>
        <title>Calendrier FIFA World Cup 2026 — Tous les matchs</title>
        <meta name="description" content="Calendrier complet des 104 matchs de la Coupe du Monde 2026. Dates, horaires Paris (CEST), équipes, stades." />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 mb-8 p-6 sm:p-8">
        {/* grid pattern */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)' }} />
        {/* glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold tracking-widest uppercase mb-2">
            <span>🏆</span>
            <span>FIFA World Cup 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
            Calendrier Officiel
          </h1>
          <p className="text-blue-300/80 text-sm">
            104 matchs · 11 juin – 19 juillet 2026
            <span className="mx-2 text-blue-500">·</span>
            Heures Paris <span className="font-semibold text-blue-200">CEST (UTC+2)</span>
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-indigo-300/70">
            <Moon className="w-3 h-3 shrink-0" />
            <span>Les matchs en fond sombre ont un coup d'envoi avant 6h heure de Paris</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 w-fit mb-8">
        {[
          { id: 'group' as const, label: 'Phase de poules', count: 72 },
          { id: 'ko'    as const, label: 'Phase éliminatoire', count: 32 },
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {label}
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
              tab === id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* ── Phase de poules ──────────────────────────────────────── */}
      {tab === 'group' && (
        <div className="space-y-10">
          {groupedByDate.map(([date, matches]) => {
            const { weekday, date: dateLabel } = formatDayFull(date)
            return (
              <div key={date}>
                {/* Day header */}
                <div className="flex items-end gap-4 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-black tracking-[0.15em] uppercase text-blue-600 dark:text-blue-400 mb-0.5">
                      {formatDayShort(date)}
                    </p>
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 capitalize leading-none">
                      {weekday}
                    </h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5 capitalize">{dateLabel}</p>
                  </div>
                  <div className="flex-1" />
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 pb-0.5">
                    {matches.length} match{matches.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matches.map(m => <GroupMatchCard key={m.id} m={m} />)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Phase éliminatoire ───────────────────────────────────── */}
      {tab === 'ko' && (
        <div className="space-y-12">
          {koByRound.map(({ round, matches }) => {
            const s = ROUND_STYLES[round]
            const bracketEntries = bracketLookup[round] ?? []
            return (
              <div key={round}>
                {/* Round header */}
                <div className="flex items-center gap-3 mb-5">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${s.dot}`} />
                  <h2 className={`text-sm font-black tracking-[0.12em] uppercase shrink-0 ${s.label}`}>
                    {ROUND_LABELS[round]}
                  </h2>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                    {matches.length} match{matches.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Cards */}
                <div className={`grid gap-3 ${
                  matches.length === 1
                    ? 'grid-cols-1 max-w-lg'
                    : matches.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2'
                }`}>
                  {matches.map((m, idx) => {
                    const entry = bracketEntries[idx]

                    let resolvedHome: ResolvedTeam | null = null
                    let resolvedAway: ResolvedTeam | null = null

                    if (entry) {
                      if (entry.home_team_code && entry.home_team !== 'TBD')
                        resolvedHome = { name: TEAM_NAMES[entry.home_team_code] ?? entry.home_team, code: entry.home_team_code }
                      if (entry.away_team_code && entry.away_team !== 'TBD')
                        resolvedAway = { name: TEAM_NAMES[entry.away_team_code] ?? entry.away_team, code: entry.away_team_code }
                    }
                    if (!resolvedHome) resolvedHome = resolveGroupLabel(m.homeLabel, standingsLookup)
                    if (!resolvedAway) resolvedAway = resolveGroupLabel(m.awayLabel, standingsLookup)

                    return (
                      <div key={m.id}>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-1">
                          {formatDayShort(displayDate(m.date, m.time))}
                        </p>
                        <KOMatchCard m={m} resolvedHome={resolvedHome} resolvedAway={resolvedAway} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
