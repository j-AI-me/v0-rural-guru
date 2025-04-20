import { getCurrentUserProfile, requireAuth } from "@/lib/auth"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  // Verificar que el usuario esté autenticado
  const session = await requireAuth()

  // Obtener el perfil del usuario
  const profile = await getCurrentUserProfile()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mi Perfil</h1>
      <ProfileForm session={session} profile={profile} />
    </div>
  )
}
