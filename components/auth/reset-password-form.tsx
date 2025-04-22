"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { FormContainer } from "@/components/ui/form-container"
import { FormField } from "@/components/ui/form-field"
import { useAuthentication } from "@/hooks/use-authentication"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validationRules } from "@/lib/validation-rules"

export function ResetPasswordForm() {
  const [success, setSuccess] = useState(false)

  const initialValues = {
    email: "",
  }

  const validations = {
    email: [
      validationRules.required("El correo electrónico es obligatorio"),
      validationRules.email("Introduce un correo electrónico válido"),
    ],
  }

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation(
    initialValues,
    validations,
  )

  const { isLoading, error, resetPassword } = useAuthentication()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return
    }

    const result = await resetPassword(values.email)
    if (result.success) {
      setSuccess(true)
    }
  }

  return (
    <FormContainer
      title="Recuperar contraseña"
      description="Te enviaremos un correo electrónico con un enlace para restablecer tu contraseña"
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      error={error}
      success={
        success
          ? `Hemos enviado un correo electrónico a ${values.email} con instrucciones para restablecer tu contraseña.`
          : null
      }
      submitText="Enviar instrucciones"
      footerContent={
        <div className="text-center text-sm w-full mt-4">
          <Link href="/auth/login" className="text-black hover:underline font-medium">
            Volver a iniciar sesión
          </Link>
        </div>
      }
    >
      <FormField
        id="email"
        label="Correo electrónico"
        type="email"
        placeholder="tu@email.com"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        touched={touched.email}
        required
      />
    </FormContainer>
  )
}
