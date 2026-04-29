export default function ShareButtons({ compact = false }: { compact?: boolean }) {
  const url = encodeURIComponent('https://worldcup-2026-predictor.vercel.app')
  const text = encodeURIComponent('Prédictions IA pour la Coupe du Monde 2026 🏆')

  const buttons = [
    { label: '𝕏', title: 'Partager sur X', href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
    { label: 'f', title: 'Partager sur Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
  ]

  return (
    <div className="flex items-center gap-1">
      {buttons.map(b => (
        <a
          key={b.label}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          title={b.title}
          className={`flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors font-bold ${compact ? 'w-8 h-8 text-sm' : 'px-3 py-2 text-sm gap-1.5'}`}
        >
          {b.label}
        </a>
      ))}
    </div>
  )
}
