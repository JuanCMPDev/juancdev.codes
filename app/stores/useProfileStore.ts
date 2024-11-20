import { create } from 'zustand'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Profile = {
  id: string
  nickname: string
  first_name: string
  last_name: string
  avatar_url: string
}

type ProfileStore = {
  profile: Profile | null
  isLoading: boolean
  fetchProfile: () => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<void>
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  isLoading: true,
  fetchProfile: async () => {
    const supabase = createClientComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        set({ profile: data, isLoading: false })
      } else if (error) {
        console.error('Error fetching profile:', error)
        set({ isLoading: false })
      }
    } else {
      set({ isLoading: false })
    }
  },
  updateProfile: async (updatedProfile) => {
    const supabase = createClientComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updatedProfile })
        .select()
        .single()

      if (data) {
        set({ profile: data })
      } else if (error) {
        console.error('Error updating profile:', error)
      }
    }
  },
}))