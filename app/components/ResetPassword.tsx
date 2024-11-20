'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useForm, SubmitHandler } from "react-hook-form"

type FormData = {
  password: string;
};

export default function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = useSupabaseClient()
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>() // Usa el tipo FormData

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: data.password })

    if (error) {
      toast({
        title: "Error al restablecer la contraseña",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Contraseña restablecida",
        description: "Tu contraseña ha sido actualizada correctamente.",
      })
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Restablecer contraseña
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "Este campo es requerido" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </Button>
        </form>
      </div>
    </div>
  )
}
