import { Timestamp } from "firebase/firestore"

export function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (value instanceof Timestamp) return value.toDate()
  if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return ((value as { toDate: () => Date }).toDate())
  }
  return null
}

export function numberOrDefault(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

export function stringOrDefault(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function booleanOrDefault(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback
}

export function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string")
}
