const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const buttons = [
  {
    key: 'x',
    icon: XIcon,
    label: 'X / Twitter',
    color: 'hover:bg-black hover:text-white',
    href: (url: string, text: string) => `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
  },
  {
    key: 'fb',
    icon: FacebookIcon,
    label: 'Facebook',
    color: 'hover:bg-[#1877f2] hover:text-white',
    href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    key: 'wa',
    icon: WhatsAppIcon,
    label: 'WhatsApp',
    color: 'hover:bg-[#25d366] hover:text-white',
    href: (url: string, text: string) => `https://wa.me/?text=${text}%20${url}`,
  },
]

export default function ShareButtons({ compact = false }: { compact?: boolean }) {
  const url = encodeURIComponent('https://worldcup-2026-predictor.vercel.app')
  const text = encodeURIComponent('Prédictions IA pour la Coupe du Monde 2026 🏆')

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {buttons.map(({ key, icon: Icon, label, color, href }) => (
        <a
          key={key}
          href={href(url, text)}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          className={`flex items-center justify-center gap-1.5 rounded-lg bg-gray-100 text-gray-600 transition-colors text-xs font-semibold ${color} ${compact ? 'px-2 py-1.5' : 'px-4 py-2'} dark:bg-gray-800 dark:text-gray-300`}
        >
          <Icon />
          {!compact && <span>{label}</span>}
        </a>
      ))}
    </div>
  )
}
