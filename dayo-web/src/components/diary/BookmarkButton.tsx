import { Star } from 'lucide-react'

interface BookmarkButtonProps {
  bookmarked: boolean
  onClick: (e: React.MouseEvent) => void
  size?: 'sm' | 'md'
}

export default function BookmarkButton({ bookmarked, onClick, size = 'sm' }: BookmarkButtonProps) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      onClick={onClick}
      type="button"
      className={`transition-all ${
        bookmarked
          ? 'text-amber-500 hover:text-amber-600'
          : 'text-dayo-gray-300 hover:text-amber-400'
      }`}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this entry'}
    >
      <Star
        className={`${iconSize} transition-transform ${bookmarked ? 'fill-current scale-110' : ''}`}
      />
    </button>
  )
}
