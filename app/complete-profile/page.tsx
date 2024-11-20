'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileStore } from '../stores/useProfileStore'
import InitialProfileForm from '../components/InitialProfileForm'

export default function CompleteProfilePage() {
  const { profile, isLoading, fetchProfile } = useProfileStore()
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (!isLoading && profile) {
      router.push('/account')
    }
  }, [isLoading, profile, router])

  if (isLoading) return <div>Cargando...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Completa tu perfil</h1>
      <InitialProfileForm />
    </div>
  )
}