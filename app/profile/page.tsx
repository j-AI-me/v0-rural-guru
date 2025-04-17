import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { UserProfile } from "@/components/auth/user-profile"

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1">
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-8">Tu perfil</h1>
          <div className="flex justify-center">
            <UserProfile />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
