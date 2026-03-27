export function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback
  }

  try {
    const value = window.localStorage.getItem(key)
    if (!value) {
      return fallback
    }

    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function writeLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeLocalStorage(key: string): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(key)
}
