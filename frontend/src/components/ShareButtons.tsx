export default function ShareButtons({ compact = false }: { compact?: boolean }) {
  const url = encodeURIComponent('https://worldcup-2026-predictor.vercel.app')
  const text = encodeURIComponent('Prédictions IA pour la Coupe du Monde 2026 🏆')
  const buttons = [
    { label: compact ? 'X' : '🐦 X / Twitter', href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
    { label: compact ? 'FB' : '📘 Facebook',    href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { label: compact ? 'WA' : '💬 WhatsApp',    href: `https://wa.me/?text=${text}%20${url}` },
  ]
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {buttons.map(b => (
        <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer"
          className={`flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors text-xs font-semibold ${compact ? 'px-2 py-1' : 'px-4 py-2'}`}>
          {b.label}
        </a>
      ))}
    </div>
  )
}
