import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-dayo-gray-100 hover:shadow-dayo transition-shadow">
      <div className="w-12 h-12 bg-dayo-gradient rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-dayo-gray-900 mb-2">{title}</h3>
      <p className="text-dayo-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
