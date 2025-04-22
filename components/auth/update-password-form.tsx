"use client"

import type React from "react"
import { FormContainer } from "@/components/ui/form-container"
import { FormField } from "@/components/ui/form-field"
import { useAuthentication } from "@/hooks/use-authentication"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validationRules } from "@/lib/validation-rules"

export function UpdatePasswordForm() {
  const initialValues = {
    password: "",
    confirmPassword: "",
  }

  const validations = {
    password: [
      validationRules.required("La contraseña es obligatoria"),
      validationRules.minLength(6, "La contraseña debe tener al menos 6 caracteres"),
    ],
    confirmPassword: [
      validationRules.required("Debes confirmar la contraseña"),
      validationRules.match("password", "Las contraseñas no coinciden"),
    ],
  }

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation(
    initialValues,
    validations,
  )

  const { isLoading, error, updatePassword } = useAuthentication()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return
    }

    await updatePassword(values.password)
  }

  return (
    <FormContainer
      title="Actualizar contraseña"
      description="Crea una nueva contraseña para tu cuenta"
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      error={error}
      submitText="Actualizar contraseña"
    >
      <FormField
        id="password"
        label="Nueva contraseña"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        touched={touched.password}
        required
      />

      <FormField
        id="confirmPassword"
        label="Confirmar nueva contraseña"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.confirmPassword}
        touched={touched.confirmPassword}
        required
      />
    </FormContainer>
  )
}
