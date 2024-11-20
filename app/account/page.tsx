'use client'

import { useEffect } from 'react'
import { useProfileStore } from '../stores/useProfileStore'
import UserProfile from '../components/UserProfile'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const { profile, isLoading, fetchProfile } = useProfileStore()
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (!isLoading && !profile) {
      router.push('/complete-profile')
    }
  }, [isLoading, profile, router])

  if (isLoading) return <div>Cargando...</div>
  if (!profile) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile />
    </div>
  )
}