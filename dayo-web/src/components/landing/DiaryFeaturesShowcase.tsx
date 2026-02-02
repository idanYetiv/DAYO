const features = [
  {
    icon: '\u{1F4CB}',
    title: 'Smart Templates',
    description: 'Guided prompts for every mood — morning intentions, evening reflections, gratitude deep dives, and more.',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Mood Insights',
    description: 'See your mood patterns over time with beautiful charts. Discover what makes your best days.',
  },
  {
    icon: '\u{1F50D}',
    title: 'Search & Tags',
    description: 'Find any entry in seconds. Tag entries with themes and filter by mood, date, or content.',
  },
  {
    icon: '\u{1F4F7}',
    title: 'Photo Diary',
    description: 'Capture moments with photos alongside your words. Build a visual timeline of your life.',
  },
  {
    icon: '\u{1F525}',
    title: 'Writing Streaks',
    description: 'Build a daily writing habit with streak tracking. See your word counts and consistency grow.',
  },
  {
    icon: '\u{2B50}',
    title: 'Bookmark Favorites',
    description: 'Save your best moments with bookmarks. Build a personal highlight reel of your life.',
  },
]

export default function DiaryFeaturesShowcase() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dayo-gray-900 mb-4">
            A diary experience like no other
          </h2>
          <p className="text-dayo-gray-500 max-w-2xl mx-auto">
            More than a blank page. DAYO gives you the tools to write deeper, reflect better, and understand yourself.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-dayo-gray-100 hover:shadow-md hover:border-dayo-purple/20 transition-all"
            >
              <span className="text-3xl mb-3 block">{feature.icon}</span>
              <h3 className="font-semibold text-dayo-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-dayo-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
