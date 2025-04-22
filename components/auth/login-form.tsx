"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { FormContainer } from "@/components/ui/form-container"
import { FormField } from "@/components/ui/form-field"
import { useAuthentication } from "@/hooks/use-authentication"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validationRules } from "@/lib/validation-rules"

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)

  const initialValues = {
    email: "",
    password: "",
  }

  const validations = {
    email: [
      validationRules.required("El correo electrónico es obligatorio"),
      validationRules.email("Introduce un correo electrónico válido"),
    ],
    password: [validationRules.required("La contraseña es obligatoria")],
  }

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation(
    initialValues,
    validations,
  )

  const { isLoading, login } = useAuthentication()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return
    }

    setError(null)
    const result = await login(values.email, values.password)
    if (!result.success) {
      setError(result.error)
    }
  }

  return (
    <FormContainer
      title="Iniciar sesión"
      description="Accede a tu cuenta para gestionar tus propiedades o reservas"
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      error={error}
      submitText="Iniciar sesión"
      footerContent={
        <div className="text-center text-sm w-full mt-4">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/registro" className="text-black hover:underline font-medium">
            Regístrate
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <Link href="/auth/recuperar-password" className="text-sm text-gray-500 hover:text-black">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <FormField
          id="password"
          label=""
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
          required
        />
      </div>
    </FormContainer>
  )
}
