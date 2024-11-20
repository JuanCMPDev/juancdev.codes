'use client'

import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import InitialProfileForm from '../../components/InitialProfileForm'
import { useToast } from "@/hooks/use-toast"

export default function EditProfilePage() {
  const [profile, setProfile] = useState(null)
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        toast({
          title: "Error",
          description: "No se pudo cargar tu perfil. Por favor, intenta de nuevo.",
          variant: "destructive",
        })
        return
      }

      setProfile(data)
    }

    fetchProfile()
  }, [supabase, router, toast])

  if (!profile) return <div>Cargando perfil...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Editar perfil</h1>
      <InitialProfileForm initialData={profile} />
    </div>
  )
}