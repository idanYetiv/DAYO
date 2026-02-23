import { isNativePlatform } from './platform'

const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY ?? ''

let initialized = false

export async function initializeRevenueCat(): Promise<void> {
  if (!isNativePlatform() || initialized || !REVENUECAT_API_KEY) return

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY })
    initialized = true
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error)
  }
}

export async function identifyUser(userId: string): Promise<void> {
  if (!isNativePlatform() || !initialized) return

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.logIn({ appUserID: userId })
  } catch (error) {
    console.error('Failed to identify RevenueCat user:', error)
  }
}

export async function logoutUser(): Promise<void> {
  if (!isNativePlatform() || !initialized) return

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.logOut()
  } catch (error) {
    console.error('Failed to logout RevenueCat user:', error)
  }
}
