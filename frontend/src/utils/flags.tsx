const FIFA_TO_ISO: Record<string, string> = {
  USA: 'us', FRA: 'fr', POL: 'pl', MAR: 'ma',
  MEX: 'mx', ESP: 'es', SRB: 'rs', SEN: 'sn',
  CAN: 'ca', ENG: 'gb-eng', UKR: 'ua', NGA: 'ng',
  ARG: 'ar', GER: 'de', TUR: 'tr', CMR: 'cm',
  BRA: 'br', POR: 'pt', JPN: 'jp', EGY: 'eg',
  COL: 'co', NED: 'nl', KOR: 'kr', ALG: 'dz',
  URU: 'uy', BEL: 'be', AUS: 'au', TUN: 'tn',
  ECU: 'ec', ITA: 'it', IRN: 'ir', CIV: 'ci',
  PAR: 'py', CRO: 'hr', KSA: 'sa', GHA: 'gh',
  SUI: 'ch', QAT: 'qa', CRC: 'cr', VEN: 've',
  DEN: 'dk', IRQ: 'iq', PAN: 'pa', BOL: 'bo',
  AUT: 'at', UAE: 'ae', JAM: 'jm', NZL: 'nz',
  // Équipes avec caractères spéciaux
  CZE: 'cz', BIH: 'ba', HAI: 'ht', SCO: 'gb-sct',
  CUW: 'cw', SWE: 'se', CPV: 'cv', NOR: 'no',
  JOR: 'jo', UZB: 'uz', SVK: 'sk', GRE: 'gr',
  ROU: 'ro', HUN: 'hu', WAL: 'gb-wls', ISL: 'is',
  FIN: 'fi', SVN: 'si', ALB: 'al', MKD: 'mk',
  MNE: 'me', GEO: 'ge', ARM: 'am', AZE: 'az',
  KAZ: 'kz', GUB: 'gw', GAM: 'gm', BEN: 'bj',
  MLI: 'ml', BFA: 'bf', GUI: 'gn',
  RSA: 'za', COD: 'cd', CGO: 'cg',
}

const NAME_TO_CODE: Record<string, string> = {
  // Anglais
  'united states': 'us', 'usa': 'us', 'france': 'fr', 'poland': 'pl', 'morocco': 'ma',
  'mexico': 'mx', 'spain': 'es', 'serbia': 'rs', 'senegal': 'sn',
  'canada': 'ca', 'england': 'gb-eng', 'ukraine': 'ua', 'nigeria': 'ng',
  'argentina': 'ar', 'germany': 'de', 'turkey': 'tr', 'cameroon': 'cm',
  'brazil': 'br', 'portugal': 'pt', 'japan': 'jp', 'egypt': 'eg',
  'colombia': 'co', 'netherlands': 'nl', 'south korea': 'kr',
  'republic of korea': 'kr', 'korea republic': 'kr', 'algeria': 'dz',
  'uruguay': 'uy', 'belgium': 'be', 'australia': 'au', 'tunisia': 'tn',
  'ecuador': 'ec', 'italy': 'it', 'iran': 'ir', 'ivory coast': 'ci',
  'cote d ivoire': 'ci', 'paraguay': 'py', 'croatia': 'hr',
  'saudi arabia': 'sa', 'ghana': 'gh', 'switzerland': 'ch', 'qatar': 'qa',
  'costa rica': 'cr', 'venezuela': 've', 'denmark': 'dk', 'iraq': 'iq',
  'panama': 'pa', 'bolivia': 'bo', 'austria': 'at',
  'united arab emirates': 'ae', 'uae': 'ae', 'jamaica': 'jm', 'new zealand': 'nz',
  // Français (noms différents de l'anglais uniquement)
  'etats unis': 'us', 'maroc': 'ma', 'mexique': 'mx', 'espagne': 'es',
  'serbie': 'rs', 'angleterre': 'gb-eng', 'nigéria': 'ng',
  'allemagne': 'de', 'turquie': 'tr', 'cameroun': 'cm', 'bresil': 'br',
  'egypte': 'eg', 'pays bas': 'nl', 'coree du sud': 'kr',
  'republique de coree': 'kr', 'algerie': 'dz', 'belgique': 'be',
  'australie': 'au', 'tunisie': 'tn', 'equateur': 'ec', 'italie': 'it',
  'croatie': 'hr', 'arabie saoudite': 'sa', 'suisse': 'ch',
  'danemark': 'dk', 'irak': 'iq', 'autriche': 'at',
  'emirats arabes unis': 'ae', 'jamaique': 'jm', 'nouvelle zelande': 'nz',
  'pologne': 'pl', 'colombie': 'co', 'bolivie': 'bo', 'japon': 'jp',
  // Équipes avec accents/caractères spéciaux (normalisés sans accents)
  'tcheque': 'cz', 'tchecoslovaquie': 'cz', 'republique tcheque': 'cz',
  'czech republic': 'cz', 'czechia': 'cz', 'tchequie': 'cz',
  'bosnie': 'ba', 'bosnie herzegovine': 'ba', 'bosnia': 'ba',
  'bosnia and herzegovina': 'ba', 'bosnie-herzegovine': 'ba',
  'haiti': 'ht',
  'ecosse': 'gb-sct', 'scotland': 'gb-sct',
  'curacao': 'cw',
  'suede': 'se', 'sweden': 'se',
  'cap vert': 'cv', 'cape verde': 'cv', 'cabo verde': 'cv',
  'norvege': 'no', 'norway': 'no',
  'jordanie': 'jo', 'jordan': 'jo',
  'ouzbekistan': 'uz', 'uzbekistan': 'uz',
  'slovaquie': 'sk', 'slovakia': 'sk',
  'grece': 'gr', 'greece': 'gr',
  'roumanie': 'ro', 'romania': 'ro',
  'hongrie': 'hu', 'hungary': 'hu',
  'pays de galles': 'gb-wls', 'wales': 'gb-wls',
  'islande': 'is', 'iceland': 'is',
  'finlande': 'fi', 'finland': 'fi',
  'slovenie': 'si', 'slovenia': 'si',
  'albanie': 'al', 'albania': 'al',
  'macedoine': 'mk', 'north macedonia': 'mk',
  'montenegro': 'me',
  'georgie': 'ge', 'georgia': 'ge',
  'armenie': 'am', 'armenia': 'am',
  'afrique du sud': 'za', 'south africa': 'za',
  'republique democratique du congo': 'cd', 'democratic republic of the congo': 'cd',
  'dr congo': 'cd', 'rdc': 'cd', 'congo dr': 'cd', 'rd congo': 'cd',
  'congo': 'cg', 'republique du congo': 'cg', 'congo brazzaville': 'cg',
}

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
}

function getIso(codeOrName: string): string {
  if (!codeOrName) return ''
  const upper = codeOrName.toUpperCase().trim()
  if (FIFA_TO_ISO[upper]) return FIFA_TO_ISO[upper]
  if (FIFA_TO_ISO[upper.slice(0, 3)]) return FIFA_TO_ISO[upper.slice(0, 3)]
  const norm = normalize(codeOrName)
  if (NAME_TO_CODE[norm]) return NAME_TO_CODE[norm]
  // Try all keys normalized (no substring match — would false-positive on bracket labels like "V. 8e Mexico")
  const found = Object.keys(NAME_TO_CODE).find(k => normalize(k) === norm)
  return found ? NAME_TO_CODE[found] : ''
}

export function flagUrl(codeOrName: string, size: number = 40): string {
  const iso = getIso(codeOrName)
  if (!iso) return ''
  return `https://flagcdn.com/w${size}/${iso}.png`
}

export function FlagImg({ code, size = 32, className = '' }: { code: string; size?: number; className?: string }) {
  const url = flagUrl(code, size > 40 ? 80 : 40)
  if (!url) return <span className="text-gray-500 text-xs">{code}</span>
  return (
    <img
      src={url}
      alt={code}
      width={size}
      height={Math.round(size * 0.67)}
      className={`inline-block rounded-sm object-cover ${className}`}
    />
  )
}
