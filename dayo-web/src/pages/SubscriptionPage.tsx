import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Crown, Check, Loader2, Star, Sparkles, Shield } from 'lucide-react'
import { useSubscription, useOfferings, usePurchase, useRestorePurchases, type PurchasesPackage } from '../hooks/useSubscription'
import { isNativePlatform } from '../lib/platform'
import { toast } from 'sonner'
import BottomNavigation from '../components/ui/BottomNavigation'

const PREMIUM_FEATURES = [
  { icon: Sparkles, label: 'Unlimited AI insights' },
  { icon: Star, label: 'Custom diary templates' },
  { icon: Shield, label: 'Advanced data export' },
  { icon: Crown, label: 'Priority support' },
]

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { data: subscription, isLoading: subLoading } = useSubscription()
  const { data: offering, isLoading: offeringsLoading } = useOfferings()
  const purchase = usePurchase()
  const restore = useRestorePurchases()

  const isLoading = subLoading || offeringsLoading

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      await purchase.mutateAsync(pkg)
      toast.success('Welcome to DAYO Premium!')
      navigate('/settings')
    } catch (error) {
      if ((error as Error).message?.includes('cancelled')) return
      toast.error('Purchase failed. Please try again.')
    }
  }

  const handleRestore = async () => {
    try {
      await restore.mutateAsync()
      toast.success('Purchases restored successfully!')
    } catch {
      toast.error('Could not restore purchases.')
    }
  }

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-dayo-purple to-dayo-pink text-white">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-8">
          <button onClick={() => navigate(-1)} className="mb-4 text-white/80 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <Crown className="w-12 h-12 mx-auto mb-3" />
            <h1 className="text-2xl font-bold mb-2">DAYO Premium</h1>
            <p className="text-white/80">Unlock the full DAYO experience</p>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 -mt-4">
        {/* Already premium */}
        {subscription?.isPremium && (
          <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-6 mb-4">
            <div className="flex items-center gap-3 text-green-600">
              <Check className="w-6 h-6" />
              <p className="font-semibold">You're a Premium member!</p>
            </div>
            <p className="text-sm text-dayo-gray-500 mt-2">
              Subscription: {subscription.activeSubscription ?? 'Active'}
            </p>
          </div>
        )}

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-6 mb-4">
          <h2 className="font-semibold text-dayo-gray-900 mb-4">Premium Features</h2>
          <div className="space-y-3">
            {PREMIUM_FEATURES.map((feature) => (
              <div key={feature.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-dayo-purple/10 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-dayo-purple" />
                </div>
                <span className="text-dayo-gray-700">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-dayo-purple animate-spin" />
          </div>
        )}

        {!isLoading && !subscription?.isPremium && isNativePlatform() && offering && (
          <div className="space-y-3 mb-4">
            {offering.availablePackages.map((pkg) => (
              <button
                key={pkg.identifier}
                onClick={() => handlePurchase(pkg)}
                disabled={purchase.isPending}
                className="w-full bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 text-start hover:border-dayo-purple/30 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-dayo-gray-900">{pkg.product.title}</p>
                    <p className="text-sm text-dayo-gray-500">{pkg.product.description}</p>
                  </div>
                  <span className="text-lg font-bold text-dayo-purple">{pkg.product.priceString}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {!isLoading && !isNativePlatform() && !subscription?.isPremium && (
          <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-6 mb-4 text-center">
            <p className="text-dayo-gray-500">
              Subscriptions are available in the DAYO iOS app.
            </p>
          </div>
        )}

        {/* Restore purchases */}
        {isNativePlatform() && !subscription?.isPremium && (
          <button
            onClick={handleRestore}
            disabled={restore.isPending}
            className="w-full text-center text-sm text-dayo-purple py-3 disabled:opacity-50"
          >
            {restore.isPending ? 'Restoring...' : 'Restore Purchases'}
          </button>
        )}

        {/* Legal links */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-dayo-gray-400">
          <Link to="/privacy" className="hover:text-dayo-gray-600">Privacy Policy</Link>
          <span>|</span>
          <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer" className="hover:text-dayo-gray-600">
            Terms of Use
          </a>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
