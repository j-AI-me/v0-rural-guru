"use client"

import type React from "react"

import { useState, useCallback } from "react"

export type ValidationRule<T> = {
  validate: (value: T, formValues?: Record<string, any>) => boolean
  message: string
}

export type FieldValidation<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule[]
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: FieldValidation<T>,
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  // Validar un campo específico
  const validateField = useCallback(
    (name: keyof T, value: any) => {
      const fieldRules = validationRules[name]
      if (!fieldRules) return true

      for (const rule of fieldRules) {
        if (!rule.validate(value, values)) {
          setErrors((prev) => ({ ...prev, [name]: rule.message }))
          return false
        }
      }

      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
      return true
    },
    [validationRules, values],
  )

  // Manejar cambios en los campos
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))

      if (touched[name as keyof T]) {
        validateField(name as keyof T, value)
      }
    },
    [touched, validateField],
  )

  // Manejar cambios en campos select (para componentes personalizados)
  const handleSelectChange = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }))

      if (touched[name]) {
        validateField(name, value)
      }
    },
    [touched, validateField],
  )

  // Manejar el evento blur para marcar un campo como tocado
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target
      setTouched((prev) => ({ ...prev, [name]: true }))
      validateField(name as keyof T, values[name as keyof T])
    },
    [validateField, values],
  )

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    let isValid = true
    const newErrors: Partial<Record<keyof T, string>> = {}
    const newTouched: Partial<Record<keyof T, boolean>> = {}

    // Marcar todos los campos como tocados
    Object.keys(values).forEach((key) => {
      newTouched[key as keyof T] = true
    })
    setTouched(newTouched)

    // Validar cada campo
    Object.keys(validationRules).forEach((key) => {
      const fieldKey = key as keyof T
      const fieldRules = validationRules[fieldKey]
      if (!fieldRules) return

      for (const rule of fieldRules) {
        if (!rule.validate(values[fieldKey], values)) {
          newErrors[fieldKey] = rule.message
          isValid = false
          break
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validationRules, values])

  // Resetear el formulario
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    setValues,
    handleChange,
    handleSelectChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldValue: (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }))
      if (touched[name]) {
        validateField(name, value)
      }
    },
    setFieldTouched: (name: keyof T, isTouched = true) => {
      setTouched((prev) => ({ ...prev, [name]: isTouched }))
      if (isTouched) {
        validateField(name, values[name])
      }
    },
  }
}
