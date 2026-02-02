const testimonials = [
  {
    quote: "The templates changed everything. I went from staring at a blank page to writing meaningful reflections in minutes.",
    author: "Sarah K.",
    role: "Product Designer",
    avatar: "S",
  },
  {
    quote: "The mood insights were eye-opening. I never realized how much my exercise routine affects my daily mood.",
    author: "Michael T.",
    role: "Software Engineer",
    avatar: "M",
  },
  {
    quote: "My kids fight over who gets to pick the mood animal first. It turned journaling from a chore into a game.",
    author: "Emma R.",
    role: "Parent of 3",
    avatar: "E",
  },
  {
    quote: "The bookmark feature is my personal highlight reel. I go back and read my best entries whenever I need a boost.",
    author: "James L.",
    role: "Entrepreneur",
    avatar: "J",
  },
]

export default function DiaryTestimonials() {
  return (
    <section className="py-20 px-6 bg-dayo-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dayo-gray-900 mb-4">
            Loved by journalers everywhere
          </h2>
          <p className="text-dayo-gray-500">
            Real stories from people who made writing a daily habit.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-dayo-gray-100"
            >
              <p className="text-dayo-gray-600 mb-4 italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dayo-gradient rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-dayo-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-dayo-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
