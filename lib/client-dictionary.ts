"use client"

import { useState, useEffect } from "react"
import type { Locale } from "./i18n-config"

// This is a client-side cache to avoid refetching the dictionary
const dictCache = new Map<string, any>()

export function useTranslation(locale: Locale) {
  const [dictionary, setDictionary] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDictionary = async () => {
      if (dictCache.has(locale)) {
        setDictionary(dictCache.get(locale))
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch the dictionary from the API
        const response = await fetch(`/api/dictionary?locale=${locale}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch dictionary: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        dictCache.set(locale, data)
        setDictionary(data)
      } catch (error) {
        console.error("Failed to fetch dictionary:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
        // Fallback to empty dictionary
        setDictionary({})
      } finally {
        setIsLoading(false)
      }
    }

    fetchDictionary()
  }, [locale])

  return {
    t: (key: string, defaultValue = "") => {
      // Split the key by dots to access nested properties
      const keys = key.split(".")
      let value = dictionary

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k]
        } else {
          return defaultValue || key
        }
      }

      return value || defaultValue || key
    },
    dictionary,
    isLoading,
    error,
  }
}

