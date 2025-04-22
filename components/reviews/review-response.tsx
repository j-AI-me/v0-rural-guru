import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface ReviewResponseProps {
  response: string
  responseDate: string | null
}

export function ReviewResponse({ response, responseDate }: ReviewResponseProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg ml-6 border-l-4 border-gray-200">
      <div className="font-medium mb-1">Respuesta del propietario</div>
      {responseDate && (
        <div className="text-xs text-gray-500 mb-2">
          {formatDistanceToNow(new Date(responseDate), {
            addSuffix: true,
            locale: es,
          })}
        </div>
      )}
      <p className="text-gray-700">{response}</p>
    </div>
  )
}
