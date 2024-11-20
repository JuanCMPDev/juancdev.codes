import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export function useProfile() {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useSupabaseClient()

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setProfile(data)
        } else if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }
      }
      setIsLoading(false)
    }

    fetchProfile()
  }, [supabase])

  return { profile, isLoading }
}