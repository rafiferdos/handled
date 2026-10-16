"use client"

import { useSyncExternalStore } from "react"

const query = "(min-width: 768px) and (prefers-reduced-motion: no-preference)"
const pointerQuery = `${query} and (hover: hover) and (pointer: fine)`
const motionQuery = "(prefers-reduced-motion: no-preference)"
const storyQuery = `${pointerQuery} and (min-width: 1024px) and (min-height: 700px)`
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

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(motionQuery)
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

function getMotionSnapshot() {
  return window.matchMedia(motionQuery).matches
}

export function useMotionAllowed() {
  return useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getServerSnapshot
  )
}

function subscribeStory(callback: () => void) {
  const media = window.matchMedia(storyQuery)
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

function getStorySnapshot() {
  return window.matchMedia(storyQuery).matches
}

export function useStoryMotion() {
  return useSyncExternalStore(
    subscribeStory,
    getStorySnapshot,
    getServerSnapshot
  )
}
