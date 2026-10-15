"use client"

import { useSyncExternalStore } from "react"

const query = "(min-width: 768px) and (prefers-reduced-motion: no-preference)"
function subscribe(callback: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}
function getSnapshot() {
  return window.matchMedia(query).matches
}
function getServerSnapshot() {
  return false
}

export function useEnhancedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
