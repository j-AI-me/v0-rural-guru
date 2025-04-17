export default function Loading() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Cargando...</h1>
          <p className="text-sm text-muted-foreground">Por favor espere mientras cargamos el formulario</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-full bg-muted rounded"></div>
          <div className="h-8 w-full bg-muted rounded"></div>
          <div className="h-8 w-full bg-muted rounded"></div>
          <div className="h-8 w-full bg-muted rounded"></div>
          <div className="h-8 w-full bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
}
