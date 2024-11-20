'use client'

import { useEffect } from 'react'
import { useProfileStore } from '../stores/useProfileStore'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

export default function UserProfile() {
  const { profile, isLoading, fetchProfile } = useProfileStore()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) return <div>Cargando perfil...</div>
  if (!profile) return <div>No se encontró el perfil</div>

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <Image
        src={profile.avatar_url}
        alt="Avatar"
        width={100}
        height={100}
        className="rounded-full mx-auto mb-4"
      />
      <h1 className="text-2xl font-bold text-center mb-4">{profile.nickname}</h1>
      <div className="space-y-2">
        <p><strong>Nombre:</strong> {profile.first_name}</p>
        <p><strong>Apellido:</strong> {profile.last_name}</p>
      </div>
      <Button onClick={() => router.push('/account/edit')} className="w-full mt-6">
        Editar perfil
      </Button>
      <Button onClick={handleSignOut} variant="outline" className="w-full mt-2">
        Cerrar sesión
      </Button>
    </div>
  )
}