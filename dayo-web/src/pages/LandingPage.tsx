import { Link } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'
import ModePreview from '../components/landing/ModePreview'
import InteractiveDiaryDemo from '../components/landing/InteractiveDiaryDemo'
import DiaryFeaturesShowcase from '../components/landing/DiaryFeaturesShowcase'
import BeforeAfterComparison from '../components/landing/BeforeAfterComparison'
import DiaryTestimonials from '../components/landing/DiaryTestimonials'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dayo-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-dayo-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="DAYO" className="w-10 h-10 rounded-xl" />
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

      {/* Hero Section — Two Columns */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-dayo-purple/10 text-dayo-purple px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                Your personal growth companion
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dayo-gray-900 mb-6 leading-tight">
                Your Day. Your Story.{' '}
                <span className="text-transparent bg-clip-text bg-dayo-gradient">
                  Your Growth.
                </span>
              </h1>
              <p className="text-lg text-dayo-gray-500 mb-4 max-w-xl">
                The diary that makes you want to write. Templates, mood tracking, insights — all in 2 minutes a day.
              </p>
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 bg-dayo-gradient text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-dayo-lg transition-all hover:scale-105"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <p className="text-sm text-dayo-gray-400">Free forever. No credit card required.</p>
            </div>

            {/* Right: Interactive Demo */}
            <div className="flex-1 w-full max-w-sm lg:max-w-none">
              <InteractiveDiaryDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Diary Features Showcase */}
      <DiaryFeaturesShowcase />

      {/* Before / After Comparison */}
      <BeforeAfterComparison />

      {/* Mode Preview Section */}
      <section className="py-20 px-6">
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

      {/* Diary Testimonials */}
      <DiaryTestimonials />

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
              <img src="/logo.png" alt="DAYO" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-dayo-gray-900">DAYO</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-dayo-gray-500">
              <Link to="/privacy" className="hover:text-dayo-gray-900 transition-colors">Privacy</Link>
              <a href="#" className="hover:text-dayo-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-dayo-gray-900 transition-colors">Support</a>
              <a href="#" className="hover:text-dayo-gray-900 transition-colors">Contact</a>
            </div>
            <p className="text-sm text-dayo-gray-400">
              &copy; {new Date().getFullYear()} DAYO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
