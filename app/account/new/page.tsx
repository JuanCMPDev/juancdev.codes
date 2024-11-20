import InitialProfileForm from '../../components/InitialProfileForm'

export default function NewProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Completa tu perfil</h1>
      <InitialProfileForm />
    </div>
  )
}