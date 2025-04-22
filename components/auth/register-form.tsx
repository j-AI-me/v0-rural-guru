"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { FormContainer } from "@/components/ui/form-container"
import { FormField } from "@/components/ui/form-field"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuthentication } from "@/hooks/use-authentication"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validationRules } from "@/lib/validation-rules"

export function RegisterForm() {
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  const validations = {
    fullName: [
      validationRules.required("El nombre completo es obligatorio"),
      validationRules.minLength(3, "El nombre debe tener al menos 3 caracteres"),
    ],
    email: [
      validationRules.required("El correo electrónico es obligatorio"),
      validationRules.email("Introduce un correo electrónico válido"),
    ],
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

  const { isLoading, register } = useAuthentication()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return
    }

    // Validar términos y condiciones
    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    setError(null)
    const result = await register(values.email, values.password, {
      full_name: values.fullName,
    })

    if (!result.success) {
      setError(result.error)
    }
  }

  return (
    <FormContainer
      title="Crear una cuenta"
      description="Regístrate para empezar a usar RuralGuru"
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      error={error}
      submitText="Registrarse"
      footerContent={
        <div className="text-center text-sm w-full mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/auth/login" className="text-black hover:underline font-medium">
            Inicia sesión
          </Link>
        </div>
      }
    >
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
        placeholder="tu@email.com"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        touched={touched.email}
        required
      />

      <FormField
        id="password"
        label="Contraseña"
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
        label="Confirmar contraseña"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.confirmPassword}
        touched={touched.confirmPassword}
        required
      />

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked === true)} />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Acepto los{" "}
          <Link href="/terminos" className="text-black hover:underline">
            términos y condiciones
          </Link>
        </label>
      </div>
    </FormContainer>
  )
}
