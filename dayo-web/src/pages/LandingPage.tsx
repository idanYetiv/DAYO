import { Link } from 'react-router-dom'
import { Clock, Lock, Sparkles, Heart, Star, ArrowRight } from 'lucide-react'
import FeatureCard from '../components/landing/FeatureCard'
import ModePreview from '../components/landing/ModePreview'

const features = [
  {
    icon: Clock,
    title: '2 Minutes a Day',
    description: 'Quick daily check-ins that fit your busy schedule. Capture moods, moments, and gratitude in seconds.',
  },
  {
    icon: Lock,
    title: 'Private & Secure',
    description: 'Your thoughts are yours alone. End-to-end privacy with secure cloud backup.',
  },
  {
    icon: Sparkles,
    title: 'Smart Prompts',
    description: 'Thoughtful questions that help you reflect deeper and discover patterns in your life.',
  },
  {
    icon: Heart,
    title: 'Track Your Growth',
    description: 'Build streaks, see your mood trends, and celebrate your journey of self-discovery.',
  },
]

const testimonials = [
  {
    quote: "DAYO has become my morning ritual. The prompts help me start each day with intention.",
    author: "Sarah K.",
    role: "Designer",
    avatar: "S",
  },
  {
    quote: "My daughter loves the animal moods! It's a fun way for her to express how she's feeling.",
    author: "Michael T.",
    role: "Parent",
    avatar: "M",
  },
  {
    quote: "Finally, a journal app that doesn't feel like homework. Simple, beautiful, and effective.",
    author: "Emma R.",
    role: "Teacher",
    avatar: "E",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dayo-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-dayo-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-dayo-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-xl text-dayo-gray-900">DAYO</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-dayo-gray-600 hover:text-dayo-gray-900 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-dayo-gradient text-white px-5 py-2 rounded-xl font-medium hover:shadow-dayo transition-shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-dayo-purple/10 text-dayo-purple px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Your personal growth companion
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-dayo-gray-900 mb-6 leading-tight">
            Your Day. Your Story.{' '}
            <span className="text-transparent bg-clip-text bg-dayo-gradient">
              Your Growth.
            </span>
          </h1>
          <p className="text-xl text-dayo-gray-500 mb-8 max-w-2xl mx-auto">
            A beautiful daily journal for reflection and growth. Track moods, capture moments,
            and build habits — in just 2 minutes a day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-dayo-gradient text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-dayo-lg transition-all hover:scale-105"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-dayo-gray-400">Free forever. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Mode Preview Section */}
      <section className="py-20 px-6 bg-dayo-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dayo-gray-900 mb-4">
              For Adults & Kids
            </h2>
            <p className="text-dayo-gray-500 max-w-2xl mx-auto">
              Two beautifully designed experiences — calm reflection for adults,
              fun adventures for kids. Switch anytime in settings.
            </p>
          </div>
          <ModePreview />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dayo-gray-900 mb-4">
              Everything you need to grow
            </h2>
            <p className="text-dayo-gray-500 max-w-2xl mx-auto">
              Simple tools that make a big difference in your daily life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-dayo-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dayo-gray-900 mb-4">
              Loved by thousands
            </h2>
            <p className="text-dayo-gray-500">
              Join a community of reflective thinkers and growing families.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-dayo-gray-100"
              >
                <p className="text-dayo-gray-600 mb-4 italic">"{testimonial.quote}"</p>
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

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-dayo-gradient rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Start your journey today
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands who are building better habits and discovering themselves,
              one day at a time.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-dayo-purple px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-dayo-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-dayo-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-bold text-dayo-gray-900">DAYO</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-dayo-gray-500">
              <a href="#" className="hover:text-dayo-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-dayo-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-dayo-gray-900 transition-colors">Support</a>
              <a href="#" className="hover:text-dayo-gray-900 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-dayo-gray-400">
              © {new Date().getFullYear()} DAYO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
