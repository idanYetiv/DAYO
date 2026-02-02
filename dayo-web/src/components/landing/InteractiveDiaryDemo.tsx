import { useState } from 'react'

const adultMoods = [
  { id: 'amazing', emoji: '\u{2728}', label: 'Amazing' },
  { id: 'happy', emoji: '\u{1F970}', label: 'Happy' },
  { id: 'okay', emoji: '\u{1F610}', label: 'Okay' },
  { id: 'sad', emoji: '\u{1F622}', label: 'Sad' },
  { id: 'stressed', emoji: '\u{1F62B}', label: 'Stressed' },
]

const kidsMoods = [
  { id: 'amazing', emoji: '\u{1F981}', label: 'ROAR!' },
  { id: 'happy', emoji: '\u{1F436}', label: 'Puppy!' },
  { id: 'okay', emoji: '\u{1F422}', label: 'Turtle' },
  { id: 'sad', emoji: '\u{1F430}', label: 'Bunny' },
  { id: 'tired', emoji: '\u{1F43B}', label: 'Bear' },
]

const adultTemplates = [
  { id: 'morning', icon: '\u{1F305}', name: 'Morning Intention' },
  { id: 'evening', icon: '\u{1F319}', name: 'Evening Reflection' },
  { id: 'gratitude', icon: '\u{1F64F}', name: 'Gratitude Deep Dive' },
]

const kidsTemplates = [
  { id: 'adventure', icon: '\u{1F5FA}\u{FE0F}', name: 'Adventure Log' },
  { id: 'super', icon: '\u{1F9B8}', name: 'Super Day Report' },
]

export default function InteractiveDiaryDemo() {
  const [mode, setMode] = useState<'adult' | 'kids'>('adult')
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [demoText, setDemoText] = useState('')

  const moods = mode === 'adult' ? adultMoods : kidsMoods
  const templates = mode === 'adult' ? adultTemplates : kidsTemplates
  const isKids = mode === 'kids'

  const placeholder = isKids
    ? 'Today was so cool because...'
    : 'Dear diary, today...'

  return (
    <div className={`rounded-3xl border-2 shadow-xl overflow-hidden max-w-sm mx-auto ${
      isKids
        ? 'border-amber-300 bg-amber-50'
        : 'border-dayo-gray-200 bg-white'
    }`}>
      {/* Phone-style header */}
      <div className={`px-4 py-3 text-center ${
        isKids ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-dayo-gradient'
      }`}>
        <p className="text-white text-sm font-semibold">Try it yourself</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Mode Toggle */}
        <div className="flex bg-dayo-gray-100 rounded-xl p-1">
          <button
            onClick={() => { setMode('adult'); setSelectedMood(null); setSelectedTemplate(null); setDemoText('') }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              mode === 'adult' ? 'bg-white text-dayo-gray-900 shadow-sm' : 'text-dayo-gray-500'
            }`}
          >
            Adults
          </button>
          <button
            onClick={() => { setMode('kids'); setSelectedMood(null); setSelectedTemplate(null); setDemoText('') }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              mode === 'kids' ? 'bg-white text-dayo-gray-900 shadow-sm' : 'text-dayo-gray-500'
            }`}
          >
            Kids
          </button>
        </div>

        {/* Mood Selector */}
        <div>
          <p className={`text-xs font-medium mb-2 ${isKids ? 'text-amber-700' : 'text-dayo-gray-500'}`}>
            {isKids ? 'How are you feeling? \u{1F43E}' : 'How are you feeling?'}
          </p>
          <div className="flex justify-center gap-1.5">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id === selectedMood ? null : mood.id)}
                className={`flex flex-col items-center px-2 py-1.5 rounded-lg transition-all text-center ${
                  selectedMood === mood.id
                    ? isKids
                      ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-md scale-105'
                      : 'bg-emerald-500 text-white shadow-md'
                    : 'text-dayo-gray-600 hover:bg-dayo-gray-100'
                }`}
              >
                <span className={isKids ? 'text-xl' : 'text-lg'}>{mood.emoji}</span>
                <span className={`text-[9px] font-medium mt-0.5 ${
                  selectedMood === mood.id ? 'text-white' : 'text-dayo-gray-400'
                }`}>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div>
          <p className={`text-xs font-medium mb-2 ${isKids ? 'text-amber-700' : 'text-dayo-gray-500'}`}>
            Choose a template
          </p>
          <div className="space-y-1.5">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id === selectedTemplate ? null : t.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm transition-all ${
                  selectedTemplate === t.id
                    ? isKids
                      ? 'bg-amber-100 border-2 border-amber-400'
                      : 'bg-dayo-purple/10 border-2 border-dayo-purple/30'
                    : 'bg-dayo-gray-50 border-2 border-transparent hover:border-dayo-gray-200'
                }`}
              >
                <span>{t.icon}</span>
                <span className={`font-medium ${
                  isKids ? 'text-amber-800' : 'text-dayo-gray-700'
                }`}>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={demoText}
          onChange={(e) => setDemoText(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`w-full rounded-xl border px-3 py-2 text-sm resize-none outline-none transition-colors ${
            isKids
              ? 'border-amber-200 focus:border-amber-400 bg-white'
              : 'border-dayo-gray-200 focus:border-dayo-purple/50'
          }`}
        />

        {/* Fake save button */}
        <div className={`text-center py-2 rounded-xl text-sm font-medium ${
          isKids
            ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white'
            : 'bg-dayo-gradient text-white'
        }`}>
          {isKids ? 'Save My Adventure! \u{1F680}' : 'Save Entry'}
        </div>
      </div>
    </div>
  )
}
