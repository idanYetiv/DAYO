import { Camera, ImagePlus } from 'lucide-react'
import { useProfileMode } from '../../hooks/useProfileMode'

interface PhotoSourceSheetProps {
  onSelect: (source: 'camera' | 'library') => void
  onClose: () => void
}

export default function PhotoSourceSheet({ onSelect, onClose }: PhotoSourceSheetProps) {
  const { isKidsMode } = useProfileMode()

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Sheet */}
      <div
        className="relative w-full max-w-lg animate-sheet-slide-up safe-area-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`mx-3 mb-2 rounded-2xl overflow-hidden ${
          isKidsMode ? 'bg-dayo-kids-yellow/10 backdrop-blur-xl' : 'bg-white'
        }`}>
          <button
            type="button"
            onClick={() => onSelect('camera')}
            className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${
              isKidsMode
                ? 'hover:bg-dayo-kids-yellow/20 active:bg-dayo-kids-yellow/30'
                : 'hover:bg-dayo-gray-50 active:bg-dayo-gray-100'
            }`}
          >
            <Camera className={`w-5 h-5 ${isKidsMode ? 'text-dayo-kids-orange' : 'text-dayo-purple'}`} />
            <span className="text-base font-medium text-dayo-gray-900">Take Photo</span>
          </button>
          <div className={`h-px ${isKidsMode ? 'bg-dayo-kids-yellow/30' : 'bg-dayo-gray-100'}`} />
          <button
            type="button"
            onClick={() => onSelect('library')}
            className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${
              isKidsMode
                ? 'hover:bg-dayo-kids-yellow/20 active:bg-dayo-kids-yellow/30'
                : 'hover:bg-dayo-gray-50 active:bg-dayo-gray-100'
            }`}
          >
            <ImagePlus className={`w-5 h-5 ${isKidsMode ? 'text-dayo-kids-orange' : 'text-dayo-purple'}`} />
            <span className="text-base font-medium text-dayo-gray-900">Choose from Library</span>
          </button>
        </div>

        <div className={`mx-3 mb-3 rounded-2xl overflow-hidden ${
          isKidsMode ? 'bg-dayo-kids-yellow/10 backdrop-blur-xl' : 'bg-white'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`w-full px-5 py-4 text-base font-semibold transition-colors ${
              isKidsMode
                ? 'text-dayo-kids-orange hover:bg-dayo-kids-yellow/20'
                : 'text-dayo-purple hover:bg-dayo-gray-50'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
