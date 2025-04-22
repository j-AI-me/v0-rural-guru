"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { FormProvider } from "@/contexts/form-context"

interface FormContainerProps {
  title: string
  description?: string
  onSubmit: (e: React.FormEvent) => Promise<void>
  onCancel?: () => void
  cancelText?: string
  submitText?: string
  isSubmitting?: boolean
  error?: string | null
  success?: string | null
  children: React.ReactNode
  footerContent?: React.ReactNode
}

export function FormContainer({
  title,
  description,
  onSubmit,
  onCancel,
  cancelText = "Cancelar",
  submitText = "Guardar",
  isSubmitting = false,
  error = null,
  success = null,
  children,
  footerContent,
}: FormContainerProps) {
  return (
    <FormProvider>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {children}
          </CardContent>

          <CardFooter className="flex justify-between">
            {onCancel && (
              <Button variant="outline" type="button" onClick={onCancel}>
                {cancelText}
              </Button>
            )}
            <Button type="submit" className="bg-black hover:bg-gray-800" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                submitText
              )}
            </Button>
            {footerContent}
          </CardFooter>
        </form>
      </Card>
    </FormProvider>
  )
}
