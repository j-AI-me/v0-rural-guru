"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { FormContainer } from "@/components/ui/form-container"
import { FormField } from "@/components/ui/form-field"
import { useFormState } from "@/hooks/use-form-state"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validationRules } from "@/lib/validation-rules"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Session } from "@supabase/supabase-js"

interface ProfileFormProps {
  session: Session
  profile: any
}

export function ProfileForm({ session, profile }: ProfileFormProps) {
  const router = useRouter()

  const initialValues = {
    fullName: profile?.full_name || "",
    email: session.user.email || "",
    phone: profile?.phone || "",
  }

  const validations = {
    fullName: [
      validationRules.required("El nombre es obligatorio"),
      validationRules.minLength(3, "El nombre debe tener al menos 3 caracteres"),
    ],
    phone: [validationRules.phone("El formato del teléfono no es válido")],
  }

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation(
    initialValues,
    validations,
  )

  const { error, success, isSubmitting, processSubmit, supabase } = useFormState({
    initialState: {},
    successMessage: "Tu perfil ha sido actualizado correctamente",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return
    }

    await processSubmit(async () => {
      // Actualizar el perfil en la tabla profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: values.fullName,
          phone: values.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id)

      if (profileError) {
        throw profileError
      }

      router.refresh()
    })
  }

  // Obtener las iniciales del nombre del usuario
  const getInitials = () => {
    if (!values.fullName) return session.user.email?.charAt(0).toUpperCase() || "U"

    return values.fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <FormContainer
      title="Información personal"
      description="Actualiza tu información personal y de contacto"
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isSubmitting={isSubmitting}
      error={error}
      success={success}
    >
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile?.avatar_url || "/placeholder-user.jpg"} alt="Avatar" />
          <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
        </Avatar>
        <Button variant="outline" type="button" size="sm">
          Cambiar foto
        </Button>
      </div>

      <FormField
        id="fullName"
        label="Nombre completo"
        placeholder="Tu nombre completo"
        value={values.fullName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.fullName}
        touched={touched.fullName}
        required
      />

      <FormField
        id="email"
        label="Correo electrónico"
        type="email"
        value={values.email}
        onChange={handleChange}
        disabled
        className="bg-gray-50"
        helperText="El correo electrónico no se puede cambiar."
      />

      <FormField
        id="phone"
        label="Teléfono"
        placeholder="Tu número de teléfono"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.phone}
        touched={touched.phone}
        helperText="Formato: +34 XXX XXX XXX o XXX XXX XXX"
      />
    </FormContainer>
  )
}
