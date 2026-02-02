import { Capacitor } from '@capacitor/core'

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform()
}

const WEB_ORIGIN = 'https://dayo-web.vercel.app'

export function getRedirectOrigin(): string {
  return isNativePlatform() ? WEB_ORIGIN : window.location.origin
}
