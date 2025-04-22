"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { FormContainer } from "@/components/ui/form-container"
import { FormField } from "@/components/ui/form-field"
import { useFormState } from "@/hooks/use-form-state"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validationRules } from "@/lib/validation-rules"

interface Property {
  id: string
  title: string
  description: string
  long_description: string | null
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  capacity: number
  status: string
  [key: string]: any
}

interface PropertyFormProps {
  property?: Property
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()

  const initialValues = {
    title: property?.title || "",
    description: property?.description || "",
    long_description: property?.long_description || "",
    location: property?.location || "",
    price: property?.price?.toString() || "",
    bedrooms: property?.bedrooms?.toString() || "",
    bathrooms: property?.bathrooms?.toString() || "",
    capacity: property?.capacity?.toString() || "",
    status: property?.status || "active",
  }

  const validations = {
    title: [
      validationRules.required("El título es obligatorio"),
      validationRules.minLength(5, "El título debe tener al menos 5 caracteres"),
      validationRules.maxLength(100, "El título debe tener como máximo 100 caracteres"),
    ],
    description: [
      validationRules.required("La descripción es obligatoria"),
      validationRules.minLength(10, "La descripción debe tener al menos 10 caracteres"),
    ],
    location: [validationRules.required("La ubicación es obligatoria")],
    price: [
      validationRules.required("El precio es obligatorio"),
      validationRules.numeric("El precio debe ser un valor numérico"),
      validationRules.min(1, "El precio debe ser mayor que 0"),
    ],
    bedrooms: [
      validationRules.required("El número de dormitorios es obligatorio"),
      validationRules.integer("El número de dormitorios debe ser un número entero"),
      validationRules.min(0, "El número de dormitorios no puede ser negativo"),
    ],
    bathrooms: [
      validationRules.required("El número de baños es obligatorio"),
      validationRules.integer("El número de baños debe ser un número entero"),
      validationRules.min(0, "El número de baños no puede ser negativo"),
    ],
    capacity: [
      validationRules.required("La capacidad es obligatoria"),
      validationRules.integer("La capacidad debe ser un número entero"),
      validationRules.min(1, "La capacidad debe ser al menos 1"),
    ],
    status: [validationRules.required("El estado es obligatorio")],
  }

  const { values, errors, touched, handleChange, handleBlur, handleSelectChange, validateForm } = useFormValidation(
    initialValues,
    validations,
  )

  const { error, success, isSubmitting, processSubmit, supabase } = useFormState({
    initialState: {},
    successMessage: property ? "Propiedad actualizada correctamente" : "Propiedad creada correctamente",
    onSuccess: () => {
      router.push("/dashboard/properties")
      router.refresh()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      return
    }

    await processSubmit(async () => {
      // Convertir valores numéricos
      const propertyData = {
        title: values.title,
        description: values.description,
        long_description: values.long_description,
        location: values.location,
        price: Number.parseFloat(values.price),
        bedrooms: Number.parseInt(values.bedrooms),
        bathrooms: Number.parseInt(values.bathrooms),
        capacity: Number.parseInt(values.capacity),
        status: values.status,
      }

      if (property?.id) {
        // Actualizar propiedad existente
        const { error } = await supabase.from("properties").update(propertyData).eq("id", property.id)
        if (error) throw error
      } else {
        // Crear nueva propiedad
        const { error } = await supabase.from("properties").insert([
          {
            ...propertyData,
            amenities: ["Wifi gratis", "Cocina completa", "Calefacción"], // Valores por defecto
          },
        ])
        if (error) throw error
      }
    })
  }

  const statusOptions = [
    { value: "active", label: "Activo" },
    { value: "maintenance", label: "Mantenimiento" },
    { value: "inactive", label: "Inactivo" },
  ]

  return (
    <FormContainer
      title={property ? "Editar propiedad" : "Nueva propiedad"}
      description={
        property
          ? "Modifica los detalles de tu propiedad."
          : "Introduce los detalles de la nueva propiedad que quieres añadir a tu catálogo."
      }
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isSubmitting={isSubmitting}
      error={error}
      success={success}
    >
      <FormField
        id="title"
        label="Título"
        placeholder="Ej: Casa rural en Covadonga"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.title}
        touched={touched.title}
        required
      />

      <FormField
        id="description"
        label="Descripción corta"
        type="textarea"
        placeholder="Breve descripción de la propiedad"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        touched={touched.description}
        required
      />

      <FormField
        id="long_description"
        label="Descripción detallada"
        type="textarea"
        placeholder="Descripción completa con todos los detalles de la propiedad"
        value={values.long_description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.long_description}
        touched={touched.long_description}
        className="min-h-[150px]"
      />

      <FormField
        id="location"
        label="Ubicación"
        placeholder="Ej: Covadonga, Asturias"
        value={values.location}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.location}
        touched={touched.location}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="price"
          label="Precio por noche (€)"
          type="number"
          placeholder="Ej: 120"
          value={values.price}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.price}
          touched={touched.price}
          min={0}
          step={0.01}
          required
        />

        <FormField
          id="status"
          label="Estado"
          type="select"
          value={values.status}
          onSelectChange={(value) => handleSelectChange("status", value)}
          onBlur={handleBlur}
          error={errors.status}
          touched={touched.status}
          options={statusOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          id="bedrooms"
          label="Dormitorios"
          type="number"
          placeholder="Ej: 3"
          value={values.bedrooms}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.bedrooms}
          touched={touched.bedrooms}
          min={0}
          required
        />

        <FormField
          id="bathrooms"
          label="Baños"
          type="number"
          placeholder="Ej: 2"
          value={values.bathrooms}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.bathrooms}
          touched={touched.bathrooms}
          min={0}
          required
        />

        <FormField
          id="capacity"
          label="Capacidad (personas)"
          type="number"
          placeholder="Ej: 6"
          value={values.capacity}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.capacity}
          touched={touched.capacity}
          min={1}
          required
        />
      </div>
    </FormContainer>
  )
}
