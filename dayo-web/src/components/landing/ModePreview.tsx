import { useState } from 'react'

type PreviewMode = 'adult' | 'kid'

export default function ModePreview() {
  const [activeMode, setActiveMode] = useState<PreviewMode>('adult')

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-dayo-gray-100 rounded-full p-1 inline-flex">
          <button
            onClick={() => setActiveMode('adult')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeMode === 'adult'
                ? 'bg-white text-dayo-gray-900 shadow-sm'
                : 'text-dayo-gray-500 hover:text-dayo-gray-700'
            }`}
          >
            Adults
          </button>
          <button
            onClick={() => setActiveMode('kid')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeMode === 'kid'
                ? 'bg-white text-dayo-gray-900 shadow-sm'
                : 'text-dayo-gray-500 hover:text-dayo-gray-700'
            }`}
          >
            Kids
          </button>
        </div>
      </div>

      {/* Preview Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Adult Preview */}
        <div
          className={`transition-all duration-300 ${
            activeMode === 'adult' ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
          }`}
        >
          <div className="bg-white rounded-3xl shadow-dayo border border-dayo-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-dayo-gradient p-4">
              <h4 className="text-white font-semibold">Good morning</h4>
              <p className="text-white/70 text-sm">How are you feeling today?</p>
            </div>

            {/* Mood selector */}
            <div className="p-4 border-b border-dayo-gray-100">
              <div className="flex justify-around">
                {['✨', '🥰', '😐', '😢', '😫'].map((emoji, i) => (
                  <button
                    key={i}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      i === 1 ? 'bg-emerald-500' : 'hover:bg-dayo-gray-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Diary placeholder */}
            <div className="p-4">
              <p className="text-dayo-gray-400 text-sm italic">
                Dear diary, today...
              </p>
            </div>
          </div>
        </div>

        {/* Kids Preview */}
        <div
          className={`transition-all duration-300 ${
            activeMode === 'kid' ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
          }`}
        >
          <div className="bg-white rounded-3xl shadow-kids border-2 border-dayo-kids-yellow overflow-hidden">
            {/* Header */}
            <div className="bg-kids-gradient p-4">
              <h4 className="text-white font-bold">Good morning, superstar!</h4>
              <p className="text-white/80 text-sm">What adventure awaits today?</p>
            </div>

            {/* Mood selector */}
            <div className="p-4 border-b-2 border-dayo-kids-yellow/30 bg-dayo-kids-yellow/10">
              <div className="flex justify-around">
                {['🦁', '🐶', '🐢', '🐰', '🐻'].map((emoji, i) => (
                  <button
                    key={i}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                      i === 0 ? 'bg-kids-gradient shadow-kids' : 'hover:bg-dayo-kids-yellow/30'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Diary placeholder */}
            <div className="p-4">
              <p className="text-dayo-gray-400 text-sm italic">
                Today was so cool because...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 text-center">
        <p className="text-dayo-gray-600">
          {activeMode === 'adult' ? (
            <>Calm, minimal design for <span className="text-dayo-purple font-medium">thoughtful reflection</span></>
          ) : (
            <>Fun, colorful experience with <span className="text-dayo-kids-orange font-medium">animal mood friends</span></>
          )}
        </p>
      </div>
    </div>
  )
}
