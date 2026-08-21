import { useEffect } from 'react'

const STORAGE_KEY = 'sh-theme'

/**
 * Keeps the site locked to a single dark theme for a refined, editorial look.
 */
export default function useTheme() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    window.localStorage.setItem(STORAGE_KEY, 'dark')
  }, [])

  return { theme: 'dark' }
}
