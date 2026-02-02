import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

const MAX_PHOTOS = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']

interface UploadProgress {
  fileName: string
  progress: number
}

export function usePhotoUpload(date: string) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const queryClient = useQueryClient()

  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, WebP, or HEIC images.')
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File too large. Maximum size is 5MB.')
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Check current photo count
      const { data: dayEntry } = await supabase
        .from('days')
        .select('photos')
        .eq('user_id', user.id)
        .eq('date', date)
        .single()

      const currentPhotos = dayEntry?.photos || []
      if (currentPhotos.length >= MAX_PHOTOS) {
        throw new Error(`Maximum ${MAX_PHOTOS} photos allowed per day.`)
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${date}/${Date.now()}.${fileExt}`

      setUploadProgress({ fileName: file.name, progress: 0 })

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('diary-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      setUploadProgress({ fileName: file.name, progress: 100 })

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('diary-photos')
        .getPublicUrl(fileName)

      // Update day entry with new photo
      const newPhotos = [...currentPhotos, publicUrl]

      // Upsert the day entry
      const { error: updateError } = await supabase
        .from('days')
        .upsert({
          user_id: user.id,
          date,
          photos: newPhotos,
        }, {
          onConflict: 'user_id,date',
        })

      if (updateError) throw updateError

      return publicUrl
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayEntry', date] })
      toast.success('Photo uploaded!')
      setUploadProgress(null)
    },
    onError: (error: Error) => {
      toast.error(error.message)
      setUploadProgress(null)
    },
  })

  const deletePhoto = useMutation({
    mutationFn: async (photoUrl: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Extract file path from URL
      const urlParts = photoUrl.split('/diary-photos/')
      if (urlParts.length < 2) throw new Error('Invalid photo URL')
      const filePath = urlParts[1]

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('diary-photos')
        .remove([filePath])

      if (deleteError) throw deleteError

      // Update day entry to remove photo
      const { data: dayEntry } = await supabase
        .from('days')
        .select('photos')
        .eq('user_id', user.id)
        .eq('date', date)
        .single()

      const newPhotos = (dayEntry?.photos || []).filter((p: string) => p !== photoUrl)

      const { error: updateError } = await supabase
        .from('days')
        .update({ photos: newPhotos })
        .eq('user_id', user.id)
        .eq('date', date)

      if (updateError) throw updateError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayEntry', date] })
      toast.success('Photo deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    uploadPhoto,
    deletePhoto,
    uploadProgress,
    maxPhotos: MAX_PHOTOS,
  }
}
