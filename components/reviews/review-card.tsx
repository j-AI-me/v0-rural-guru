import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StarIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    comment: string
    created_at: string
    images?: string[]
    user: {
      name: string
      avatar_url?: string
    }
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { rating, comment, created_at, user, images } = review

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4 pb-2 px-5">
        <Avatar>
          <AvatarImage src={user.avatar_url || ""} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            />
          ))}
        </div>
        <p className="text-gray-700 mb-4">{comment}</p>

        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={`Imagen de reseña ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
