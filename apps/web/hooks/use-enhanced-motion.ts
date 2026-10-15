"use client"

import { useSyncExternalStore } from "react"

const query = "(min-width: 768px) and (prefers-reduced-motion: no-preference)"
const pointerQuery = `${query} and (hover: hover) and (pointer: fine)`
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

function subscribePointer(callback: () => void) {
  const media = window.matchMedia(pointerQuery)
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

function getPointerSnapshot() {
  return window.matchMedia(pointerQuery).matches
}

export function usePointerMotion() {
  return useSyncExternalStore(
    subscribePointer,
    getPointerSnapshot,
    getServerSnapshot
  )
}
