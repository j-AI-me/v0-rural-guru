import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1">
        <div className="relative h-[300px] w-full">
          <Image
            src="/mountain-village-vista.png"
            alt="Paisaje rural de Asturias"
            fill
            className="object-cover brightness-[0.7]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">Sobre Nosotros</h1>
          </div>
        </div>

        <section className="py-12">
          <div className="container mx-auto px-6 md:px-10 lg:px-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Nuestra Historia</h2>
              <p className="text-lg mb-6">
                RuralGuru nació en 2020 con una misión clara: conectar a viajeros con los mejores alojamientos rurales
                de Asturias. Fundada por un grupo de amantes de la naturaleza y el turismo rural, nuestra plataforma
                busca promover el turismo sostenible y apoyar a las comunidades locales.
              </p>
              <p className="text-lg mb-6">
                Después de años viajando por diferentes casas rurales, nos dimos cuenta de que faltaba una plataforma
                especializada que realmente entendiera las necesidades tanto de los viajeros como de los propietarios de
                alojamientos rurales en Asturias.
              </p>
              <p className="text-lg mb-10">
                Hoy, RuralGuru se ha convertido en un referente para quienes buscan experiencias auténticas en entornos
                naturales privilegiados, con una cuidada selección de propiedades que cumplen con nuestros estándares de
                calidad y autenticidad.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src="/rural-office-collaboration.png"
                    alt="Equipo de RuralGuru"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">Nuestro Equipo</h3>
                  <p className="text-lg">
                    Somos un equipo diverso de profesionales apasionados por el turismo rural y la tecnología. Nuestro
                    conocimiento del territorio asturiano y su cultura nos permite ofrecer una experiencia única a
                    nuestros usuarios.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-6">Nu estros Valores</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-primary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3">Autenticidad</h3>
                  <p>
                    Promovemos experiencias genuinas que conectan a los viajeros con la cultura y tradiciones locales.
                  </p>
                </div>
                <div className="bg-primary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3">Sostenibilidad</h3>
                  <p>Apoyamos prácticas de turismo responsable que respetan y preservan el entorno natural.</p>
                </div>
                <div className="bg-primary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-3">Comunidad</h3>
                  <p>Contribuimos al desarrollo económico de las zonas rurales apoyando a propietarios locales.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-6">Nuestra Misión</h2>
              <p className="text-lg mb-12">
                En RuralGuru, nuestra misión es facilitar el acceso a experiencias rurales auténticas, promoviendo un
                turismo sostenible que beneficie tanto a viajeros como a comunidades locales. Queremos ser el puente que
                conecta a los amantes de la naturaleza con los tesoros escondidos del paisaje rural asturiano.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
