"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface VisibilityOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
  animationDuration?: number
}

interface VisibilityState {
  isVisible: boolean
  hasBeenVisible: boolean
  entry?: IntersectionObserverEntry
}

export function useElementVisibility(options: VisibilityOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = false, delay = 0, animationDuration = 300 } = options

  const [state, setState] = useState<VisibilityState>({
    isVisible: false,
    hasBeenVisible: false,
  })

  const elementRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const setVisible = useCallback(
    (visible: boolean, entry?: IntersectionObserverEntry) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (visible && delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setState((prev) => ({
            isVisible: true,
            hasBeenVisible: true,
            entry,
          }))
        }, delay)
      } else {
        setState((prev) => ({
          isVisible: visible,
          hasBeenVisible: prev.hasBeenVisible || visible,
          entry,
        }))
      }
    },
    [delay],
  )

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting

        if (isIntersecting) {
          setVisible(true, entry)
        } else if (!triggerOnce) {
          setVisible(false, entry)
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [threshold, rootMargin, triggerOnce, setVisible])

  const getAnimationStyles = useCallback(
    (type: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" = "fadeIn") => {
      const baseStyles = {
        transition: `all ${animationDuration}ms ease-out`,
        willChange: "transform, opacity",
      }

      if (!state.isVisible) {
        switch (type) {
          case "fadeIn":
            return { ...baseStyles, opacity: 0 }
          case "slideUp":
            return { ...baseStyles, opacity: 0, transform: "translateY(20px)" }
          case "slideDown":
            return { ...baseStyles, opacity: 0, transform: "translateY(-20px)" }
          case "slideLeft":
            return { ...baseStyles, opacity: 0, transform: "translateX(20px)" }
          case "slideRight":
            return { ...baseStyles, opacity: 0, transform: "translateX(-20px)" }
          case "scale":
            return { ...baseStyles, opacity: 0, transform: "scale(0.9)" }
          default:
            return { ...baseStyles, opacity: 0 }
        }
      }

      return { ...baseStyles, opacity: 1, transform: "none" }
    },
    [state.isVisible, animationDuration],
  )

  return {
    ref: elementRef,
    isVisible: state.isVisible,
    hasBeenVisible: state.hasBeenVisible,
    entry: state.entry,
    getAnimationStyles,
  }
}

export function useScrollVisibility(threshold = 100) {
  const [isVisible, setIsVisible] = useState(true)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up")
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY > lastScrollY.current ? "down" : "up"

      setScrollDirection(direction)

      if (direction === "down" && currentScrollY > threshold) {
        setIsVisible(false)
      } else if (direction === "up" || currentScrollY <= threshold) {
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [threshold])

  return { isVisible, scrollDirection }
}
