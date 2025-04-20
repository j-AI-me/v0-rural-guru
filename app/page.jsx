export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">RuralGuru</h1>
      <p className="text-xl mb-8">Alojamientos rurales en Asturias</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        {[1, 2, 3].map((id) => (
          <div key={id} className="border rounded-lg p-4 shadow-sm">
            <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
            <h2 className="text-lg font-semibold">Casa Rural {id}</h2>
            <p className="text-gray-500 mb-2">Asturias, España</p>
            <p className="font-bold">{80 + id * 10}€ / noche</p>
          </div>
        ))}
      </div>
    </div>
  )
}
