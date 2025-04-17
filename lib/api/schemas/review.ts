import { z } from "zod"

export const createReviewSchema = z.object({
  propertyId: z.string().uuid(),
  bookingId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, "El comentario debe tener al menos 10 caracteres").max(1000),
  images: z.array(z.string().url()).optional(),
})

export const updateReviewSchema = z.object({
  reviewId: z.string().uuid(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10, "El comentario debe tener al menos 10 caracteres").max(1000).optional(),
  images: z.array(z.string().url()).optional(),
})
