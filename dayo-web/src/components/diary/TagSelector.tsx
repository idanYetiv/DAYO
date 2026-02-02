import { useProfileMode } from '../../hooks/useProfileMode'
import { getTagsForMode, type TagOption } from '../../data/tags'

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const { isKidsMode } = useProfileMode()
  const tags = getTagsForMode(isKidsMode)

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(t => t !== tagId))
    } else {
      onChange([...selectedTags, tagId])
    }
  }

  return (
    <div className={`rounded-2xl border p-4 ${
      isKidsMode
        ? 'bg-dayo-kids-yellow/20 border-dayo-kids-yellow'
        : 'bg-blue-50 border-blue-200'
    }`}>
      <div className={`flex items-center gap-2 mb-3 ${
        isKidsMode ? 'text-dayo-kids-orange-dark' : 'text-blue-600'
      }`}>
        <span className="text-sm">{'\u{1F3F7}\u{FE0F}'}</span>
        <span className="text-sm font-medium">Tags</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag: TagOption) => {
          const isSelected = selectedTags.includes(tag.id)
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? isKidsMode
                    ? 'bg-kids-gradient text-white shadow-kids'
                    : 'bg-blue-500 text-white'
                  : isKidsMode
                    ? 'bg-white text-dayo-gray-600 border border-dayo-kids-yellow/50 hover:border-dayo-kids-orange'
                    : 'bg-white text-dayo-gray-600 border border-blue-200 hover:border-blue-400'
              }`}
            >
              <span>{tag.emoji}</span>
              <span>{tag.label}</span>
              {isSelected && <span>\u{2713}</span>}
            </button>
          )
        })}
      </div>
      {selectedTags.length > 0 && (
        <p className={`text-xs mt-2 ${isKidsMode ? 'text-dayo-kids-orange' : 'text-blue-500'}`}>
          Selected: {selectedTags.map(id => {
            const tag = tags.find(t => t.id === id)
            return tag ? tag.label : id
          }).join(', ')}
        </p>
      )}
    </div>
  )
}
