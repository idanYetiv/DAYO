import { useState } from 'react'
import { RefreshCw, Heart } from 'lucide-react'

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Every day is a new beginning. Take a deep breath and start again.", author: "Unknown" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
]

export default function QuoteCard() {
  const [currentQuote, setCurrentQuote] = useState(() =>
    quotes[Math.floor(Math.random() * quotes.length)]
  )
  const [isFavorite, setIsFavorite] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleNewQuote = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      let newQuote = quotes[Math.floor(Math.random() * quotes.length)]
      while (newQuote.text === currentQuote.text && quotes.length > 1) {
        newQuote = quotes[Math.floor(Math.random() * quotes.length)]
      }
      setCurrentQuote(newQuote)
      setIsRefreshing(false)
    }, 300)
  }

  return (
    <div className="bg-dayo-gradient rounded-3xl p-6 text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />

      {/* Quote icon */}
      <div className="relative">
        <svg
          className="w-10 h-10 text-white/80 mb-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>

        <p className="text-xl font-medium leading-relaxed mb-3">
          "{currentQuote.text}"
        </p>

        <p className="text-white/80 text-sm">
          — {currentQuote.author}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 relative">
        <button
          onClick={handleNewQuote}
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          New quote
        </button>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="text-white/90 hover:text-white transition-colors"
        >
          <Heart
            className={`w-6 h-6 transition-all ${isFavorite ? 'fill-current scale-110' : ''}`}
          />
        </button>
      </div>
    </div>
  )
}
