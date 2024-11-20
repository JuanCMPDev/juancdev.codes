'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const router = useRouter()
  const supabaseClient = useSupabaseClient()
  const user = useUser()

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-800">
                Mi Blog
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                Inicio
              </Link>
              <Link href="/posts" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                Posts
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <Link href="/account" className="text-gray-900 text-sm font-medium mr-4">
                  {user.email}
                </Link>
                <Button onClick={handleSignOut}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}