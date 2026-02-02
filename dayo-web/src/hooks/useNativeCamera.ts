import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { isNativePlatform } from '../lib/platform'

export function useNativeCamera() {
  const isNative = isNativePlatform()

  async function pickPhoto(source: 'camera' | 'library'): Promise<File> {
    const photo = await Camera.getPhoto({
      quality: 80,
      width: 1920,
      resultType: CameraResultType.Uri,
      source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
    })

    const response = await fetch(photo.webPath!)
    const blob = await response.blob()

    const extension = photo.format || 'jpeg'
    const fileName = `photo_${Date.now()}.${extension}`
    return new File([blob], fileName, { type: blob.type || `image/${extension}` })
  }

  return { pickPhoto, isNative }
}
