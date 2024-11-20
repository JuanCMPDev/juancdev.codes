'use client'

import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Github } from 'lucide-react'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'sign-in' | 'sign-up' | 'forgot-password'>('sign-in')
  const router = useRouter()
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/account')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase, router])

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast({
        title: "Error en el inicio de sesión",
        description: error.message,
        variant: "destructive",
      })
    } else {
      router.push('/account')
    }
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      toast({
        title: "Error en el registro",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Registro exitoso",
        description: "Por favor, verifica tu correo electrónico para confirmar tu cuenta.",
      })
      setView('sign-in')
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      toast({
        title: "Error al enviar el correo de recuperación",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Correo enviado",
        description: "Por favor, revisa tu correo electrónico para restablecer tu contraseña.",
      })
      setView('sign-in')
    }
    setLoading(false)
  }

  const handleGitHubSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast({
        title: "Error en el inicio de sesión con GitHub",
        description: error.message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          {view === 'sign-in' ? 'Iniciar sesión' : view === 'sign-up' ? 'Registrarse' : 'Recuperar contraseña'}
        </h2>
        <form onSubmit={view === 'sign-in' ? handleSignIn : view === 'sign-up' ? handleSignUp : handleForgotPassword} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {view !== 'forgot-password' && (
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Cargando...' : view === 'sign-in' ? 'Iniciar sesión' : view === 'sign-up' ? 'Registrarse' : 'Enviar correo de recuperación'}
          </Button>
        </form>
        {view === 'sign-in' && (
          <div className="mt-4">
            <Button onClick={handleGitHubSignIn} variant="outline" className="w-full" disabled={loading}>
              <Github className="mr-2 h-4 w-4" />
              {loading ? 'Cargando...' : 'Iniciar sesión con GitHub'}
            </Button>
          </div>
        )}
        <div className="text-center space-y-2">
          {view === 'sign-in' ? (
            <>
              <p>
                ¿No tienes una cuenta?{' '}
                <button className="text-blue-600" onClick={() => setView('sign-up')}>
                  Regístrate
                </button>
              </p>
              <p>
                <button className="text-blue-600" onClick={() => setView('forgot-password')}>
                  ¿Olvidaste tu contraseña?
                </button>
              </p>
            </>
          ) : (
            <p>
              ¿Ya tienes una cuenta?{' '}
              <button className="text-blue-600" onClick={() => setView('sign-in')}>
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}