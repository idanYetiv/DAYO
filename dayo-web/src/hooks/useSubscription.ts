import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isNativePlatform } from '../lib/platform'
import type { PurchasesOffering, PurchasesPackage } from '@revenuecat/purchases-capacitor'

const WEB_DEFAULTS = {
  isPremium: false,
  activeSubscription: null as string | null,
}

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      if (!isNativePlatform()) return WEB_DEFAULTS

      try {
        const { Purchases } = await import('@revenuecat/purchases-capacitor')
        const { customerInfo } = await Purchases.getCustomerInfo()
        const isPremium = Object.keys(customerInfo.entitlements.active).length > 0
        const activeSubscription = Object.keys(customerInfo.entitlements.active)[0] ?? null
        return { isPremium, activeSubscription }
      } catch {
        return WEB_DEFAULTS
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

export type { PurchasesOffering, PurchasesPackage }

export function useOfferings() {
  return useQuery({
    queryKey: ['offerings'],
    queryFn: async (): Promise<PurchasesOffering | null> => {
      if (!isNativePlatform()) return null

      try {
        const { Purchases } = await import('@revenuecat/purchases-capacitor')
        const offerings = await Purchases.getOfferings()
        return offerings.current ?? null
      } catch {
        return null
      }
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function usePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (aPackage: PurchasesPackage) => {
      if (!isNativePlatform()) {
        throw new Error('Purchases are only available on native platforms')
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor')
      const result = await Purchases.purchasePackage({ aPackage })
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    },
  })
}

export function useRestorePurchases() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!isNativePlatform()) {
        throw new Error('Restore is only available on native platforms')
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor')
      const { customerInfo } = await Purchases.restorePurchases()
      return customerInfo
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    },
  })
}
