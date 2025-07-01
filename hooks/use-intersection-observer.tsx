"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | null
  triggerOnce?: boolean
  skip?: boolean
}

interface IntersectionObserverEntry {
  isIntersecting: boolean
  intersectionRatio: number
  boundingClientRect: DOMRect
  intersectionRect: DOMRect
  rootBounds: DOMRect | null
  target: Element
  time: number
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0, rootMargin = "0px", root = null, triggerOnce = false, skip = false } = options

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<Element | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const setElement = useCallback((element: Element | null) => {
    elementRef.current = element
  }, [])

  useEffect(() => {
    if (skip || !elementRef.current) return

    const element = elementRef.current

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting

        setEntry(entry as any)
        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting) {
          setHasIntersected(true)

          if (triggerOnce && observerRef.current) {
            observerRef.current.disconnect()
          }
        }
      },
      {
        threshold,
        rootMargin,
        root,
      },
    )

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, rootMargin, root, triggerOnce, skip])

  return {
    ref: setElement,
    entry,
    isIntersecting,
    hasIntersected,
  }
}

export function useIntersectionObserverMultiple(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0, rootMargin = "0px", root = null, triggerOnce = false, skip = false } = options

  const [entries, setEntries] = useState<Map<Element, IntersectionObserverEntry>>(new Map())
  const elementsRef = useRef<Set<Element>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const addElement = useCallback(
    (element: Element) => {
      if (skip) return

      elementsRef.current.add(element)

      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (observerEntries) => {
            setEntries((prev) => {
              const newEntries = new Map(prev)

              observerEntries.forEach((entry) => {
                newEntries.set(entry.target, entry as any)

                if (triggerOnce && entry.isIntersecting && observerRef.current) {
                  observerRef.current.unobserve(entry.target)
                  elementsRef.current.delete(entry.target)
                }
              })

              return newEntries
            })
          },
          {
            threshold,
            rootMargin,
            root,
          },
        )
      }

      observerRef.current.observe(element)
    },
    [threshold, rootMargin, root, triggerOnce, skip],
  )

  const removeElement = useCallback((element: Element) => {
    elementsRef.current.delete(element)

    if (observerRef.current) {
      observerRef.current.unobserve(element)
    }

    setEntries((prev) => {
      const newEntries = new Map(prev)
      newEntries.delete(element)
      return newEntries
    })
  }, [])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const getEntryForElement = useCallback(
    (element: Element) => {
      return entries.get(element) || null
    },
    [entries],
  )

  const isElementIntersecting = useCallback(
    (element: Element) => {
      const entry = entries.get(element)
      return entry ? entry.isIntersecting : false
    },
    [entries],
  )

  return {
    addElement,
    removeElement,
    entries,
    getEntryForElement,
    isElementIntersecting,
  }
}

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down")
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection("up")
      }

      setScrollY(currentScrollY)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return {
    scrollDirection,
    scrollY,
  }
}

export function useElementInView(threshold = 0.1, triggerOnce = false) {
  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting

        setIsInView(inView)

        if (inView) {
          setHasBeenInView(true)

          if (triggerOnce) {
            observer.unobserve(element)
          }
        }
      },
      { threshold },
    )

    observer.observe(element)

    return () => observer.unobserve(element)
  }, [threshold, triggerOnce])

  return {
    ref: elementRef,
    isInView,
    hasBeenInView,
  }
}
