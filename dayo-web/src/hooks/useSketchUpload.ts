import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export function useSketchUpload(date: string) {
  const queryClient = useQueryClient()

  const uploadSketch = useMutation({
    mutationFn: async (dataUrl: string) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()

      // Generate filename (one sketch per day, overwrites previous)
      const fileName = `${user.id}/${date}/sketch.png`

      // Upload to Supabase Storage (upsert to overwrite)
      const { error: uploadError } = await supabase.storage
        .from('diary-sketches')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/png',
        })

      if (uploadError) throw uploadError

      // Get public URL with cache buster
      const { data: { publicUrl } } = supabase.storage
        .from('diary-sketches')
        .getPublicUrl(fileName)

      // Add cache buster to force refresh
      const urlWithCacheBuster = `${publicUrl}?t=${Date.now()}`

      // Update day entry with sketch URL
      const { error: updateError } = await supabase
        .from('days')
        .upsert({
          user_id: user.id,
          date,
          sketch_url: urlWithCacheBuster,
        }, {
          onConflict: 'user_id,date',
        })

      if (updateError) throw updateError

      return urlWithCacheBuster
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayEntry', date] })
    },
    onError: (error: Error) => {
      toast.error(`Failed to save sketch: ${error.message}`)
    },
  })

  const deleteSketch = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const fileName = `${user.id}/${date}/sketch.png`

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('diary-sketches')
        .remove([fileName])

      // Ignore "not found" errors - sketch might not exist in storage
      if (deleteError && !deleteError.message.includes('not found')) {
        throw deleteError
      }

      // Update day entry to remove sketch URL
      const { error: updateError } = await supabase
        .from('days')
        .update({ sketch_url: null })
        .eq('user_id', user.id)
        .eq('date', date)

      if (updateError) throw updateError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayEntry', date] })
      toast.success('Sketch cleared')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    uploadSketch,
    deleteSketch,
  }
}
