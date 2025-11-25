export type FieldError = {
  message: string
}

export type FormError = Record<string, FieldError[]>

export type FieldValue = string

export type FormInitial = Record<string, FieldValue>
