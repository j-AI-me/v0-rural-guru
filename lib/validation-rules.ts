export const validationRules = {
  required: (message = "Este campo es obligatorio") => ({
    validate: (value: any) => {
      if (value === undefined || value === null) return false
      if (typeof value === "string") return value.trim() !== ""
      if (typeof value === "number") return true
      if (Array.isArray(value)) return value.length > 0
      return !!value
    },
    message,
  }),

  email: (message = "Introduce un correo electrónico válido") => ({
    validate: (value: string) => {
      if (!value) return true // Si no es obligatorio, permitir vacío
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message,
  }),

  minLength: (min: number, message = `Debe tener al menos ${min} caracteres`) => ({
    validate: (value: string) => {
      if (!value) return true // Si no es obligatorio, permitir vacío
      return value.length >= min
    },
    message,
  }),

  maxLength: (max: number, message = `Debe tener como máximo ${max} caracteres`) => ({
    validate: (value: string) => {
      if (!value) return true // Si no es obligatorio, permitir vacío
      return value.length <= max
    },
    message,
  }),

  min: (min: number, message = `El valor debe ser mayor o igual a ${min}`) => ({
    validate: (value: number) => {
      if (value === undefined || value === null || value === "") return true
      return Number(value) >= min
    },
    message,
  }),

  max: (max: number, message = `El valor debe ser menor o igual a ${max}`) => ({
    validate: (value: number) => {
      if (value === undefined || value === null || value === "") return true
      return Number(value) <= max
    },
    message,
  }),

  pattern: (pattern: RegExp, message = "El formato no es válido") => ({
    validate: (value: string) => {
      if (!value) return true // Si no es obligatorio, permitir vacío
      return pattern.test(value)
    },
    message,
  }),

  match: (fieldName: string, message = "Los campos no coinciden") => ({
    validate: (value: any, formValues?: Record<string, any>) => {
      if (!formValues) return true
      return value === formValues[fieldName]
    },
    message,
  }),

  phone: (message = "Introduce un número de teléfono válido") => ({
    validate: (value: string) => {
      if (!value) return true // Si no es obligatorio, permitir vacío
      // Formato español: +34 XXX XXX XXX o XXX XXX XXX
      const phoneRegex = /^(\+34\s?)?[6-9]\d{2}(\s?\d{3}){2}$/
      return phoneRegex.test(value)
    },
    message,
  }),

  url: (message = "Introduce una URL válida") => ({
    validate: (value: string) => {
      if (!value) return true // Si no es obligatorio, permitir vacío
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message,
  }),

  numeric: (message = "Debe ser un valor numérico") => ({
    validate: (value: string) => {
      if (!value) return true // Si no es obligatorio, permitir vacío
      return !isNaN(Number(value))
    },
    message,
  }),

  integer: (message = "Debe ser un número entero") => ({
    validate: (value: string) => {
      if (!value) return true // Si no es obligatorio, permitir vacío
      return Number.isInteger(Number(value))
    },
    message,
  }),

  decimal: (message = "Debe ser un número decimal") => ({
    validate: (value: string) => {
      if (!value) return true // Si no es obligatorio, permitir vacío
      const num = Number(value)
      return !isNaN(num) && num % 1 !== 0
    },
    message,
  }),

  custom: (validateFn: (value: any, formValues?: Record<string, any>) => boolean, message: string) => ({
    validate: validateFn,
    message,
  }),
}
