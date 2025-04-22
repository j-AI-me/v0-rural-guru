"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  id: string
  label: string
  type?: "text" | "email" | "password" | "number" | "textarea" | "select"
  placeholder?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectChange?: (value: string) => void
  required?: boolean
  disabled?: boolean
  className?: string
  min?: number
  max?: number
  step?: number
  options?: { value: string; label: string }[]
  helperText?: string
  error?: string
  touched?: boolean
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  onSelectChange,
  required = false,
  disabled = false,
  className = "",
  min,
  max,
  step,
  options = [],
  helperText,
  error,
  touched,
}: FormFieldProps) {
  const showError = error && touched

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={showError ? "text-destructive" : ""}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {type === "textarea" ? (
        <Textarea
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          className={cn(showError ? "border-destructive" : "", className)}
        />
      ) : type === "select" ? (
        <Select
          value={value.toString()}
          onValueChange={onSelectChange}
          disabled={disabled}
          onOpenChange={(open) => {
            if (!open && onBlur) {
              // Simular un evento blur cuando se cierra el select
              const fakeEvent = {
                target: { name: id },
              } as React.FocusEvent<HTMLInputElement>
              onBlur(fakeEvent)
            }
          }}
        >
          <SelectTrigger className={cn(showError ? "border-destructive" : "", className)}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          className={cn(showError ? "border-destructive" : "", className)}
          min={min}
          max={max}
          step={step}
        />
      )}

      {showError ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}
