'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useProfileStore } from '../stores/useProfileStore'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image'

type ProfileFormData = {
  nickname: string
  first_name: string
  last_name: string
}

const defaultAvatars = [
  '/avatars/avatar1.svg',
  '/avatars/avatar2.svg',
  '/avatars/avatar3.svg',
  '/avatars/avatar4.svg',
]

export default function InitialProfileForm() {
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatars[0])
  const [isUploading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>()
  const { updateProfile } = useProfileStore()
  const router = useRouter()
  const { toast } = useToast()

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        ...data,
        avatar_url: selectedAvatar,
      })
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido creado exitosamente.",
      })
      router.push('/account')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar tu perfil. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async () => {
    // Implementación de carga de archivo (sin cambios)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          {...register("nickname", { required: "Este campo es requerido" })}
        />
        {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname.message}</p>}
      </div>
      <div>
        <Label htmlFor="first_name">Nombre</Label>
        <Input
          id="first_name"
          {...register("first_name", { required: "Este campo es requerido" })}
        />
        {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
      </div>
      <div>
        <Label htmlFor="last_name">Apellido</Label>
        <Input
          id="last_name"
          {...register("last_name", { required: "Este campo es requerido" })}
        />
        {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
      </div>
      <div>
        <Label>Avatar</Label>
        <div className="flex space-x-2 my-2">
          {defaultAvatars.map((avatar, index) => (
            <Image
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              width={80}
              height={80}
              className={`cursor-pointer ${selectedAvatar === avatar ? 'border-2 border-blue-500' : ''}`}
              onClick={() => setSelectedAvatar(avatar)}
            />
          ))}
        </div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        {isUploading && <p>Subiendo avatar...</p>}
      </div>
      <Button type="submit" className="w-full">
        Guardar perfil
      </Button>
    </form>
  )
}