"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface TransitionState {
  isVisible: boolean
  isEntering: boolean
  isExiting: boolean
  hasEntered: boolean
  hasExited: boolean
}

interface TransitionOptions {
  duration?: number
  delay?: number
  easing?: string
  type?: "fade" | "slide" | "scale" | "rotate" | "custom"
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  staggerDelay?: number
  staggerIndex?: number
}

export function useAnimatedTransition(show: boolean, options: TransitionOptions = {}) {
  const {
    duration = 300,
    delay = 0,
    easing = "ease-out",
    type = "fade",
    direction = "up",
    distance = 20,
    staggerDelay = 0,
    staggerIndex = 0,
  } = options

  const timeoutRefs = useRef<NodeJS.Timeout[]>([])
  const [state, setState] = useState<TransitionState>({
    isVisible: false,
    isEntering: false,
    isExiting: false,
    hasEntered: false,
    hasExited: !show,
  })

  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
    timeoutRefs.current = []
  }, [])

  const calculateDelay = useCallback(() => {
    return delay + staggerDelay * staggerIndex
  }, [delay, staggerDelay, staggerIndex])

  const startTransition = useCallback(
    (entering: boolean) => {
      clearTimeouts()

      const totalDelay = calculateDelay()

      if (entering) {
        setState((prev) => ({
          ...prev,
          isVisible: true,
          isEntering: true,
          isExiting: false,
        }))

        const enterTimeout = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isEntering: false,
            hasEntered: true,
            hasExited: false,
          }))
        }, totalDelay + duration)

        timeoutRefs.current.push(enterTimeout)
      } else {
        setState((prev) => ({
          ...prev,
          isExiting: true,
          isEntering: false,
        }))

        const exitTimeout = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isVisible: false,
            isExiting: false,
            hasExited: true,
            hasEntered: false,
          }))
        }, totalDelay + duration)

        timeoutRefs.current.push(exitTimeout)
      }
    },
    [calculateDelay, duration, clearTimeouts],
  )

  useEffect(() => {
    startTransition(show)
    return () => clearTimeouts()
  }, [show, startTransition, clearTimeouts])

  const getTransitionStyles = useCallback(() => {
    const totalDelay = calculateDelay()
    const baseStyles = {
      transition: `all ${duration}ms ${easing}`,
      transitionDelay: `${totalDelay}ms`,
    }

    if (!state.isVisible && !state.isEntering) {
      return { ...baseStyles, display: "none" }
    }

    const isActive = state.hasEntered && !state.isExiting

    switch (type) {
      case "fade":
        return {
          ...baseStyles,
          opacity: isActive ? 1 : 0,
        }

      case "slide":
        let transform = "translate3d(0, 0, 0)"
        if (!isActive) {
          switch (direction) {
            case "up":
              transform = `translate3d(0, ${distance}px, 0)`
              break
            case "down":
              transform = `translate3d(0, -${distance}px, 0)`
              break
            case "left":
              transform = `translate3d(${distance}px, 0, 0)`
              break
            case "right":
              transform = `translate3d(-${distance}px, 0, 0)`
              break
          }
        }
        return {
          ...baseStyles,
          opacity: isActive ? 1 : 0,
          transform,
        }

      case "scale":
        return {
          ...baseStyles,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "scale(1)" : "scale(0.9)",
        }

      case "rotate":
        return {
          ...baseStyles,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "rotate(0deg)" : "rotate(-10deg)",
        }

      default:
        return {
          ...baseStyles,
          opacity: isActive ? 1 : 0,
        }
    }
  }, [state, type, direction, distance, duration, easing, calculateDelay])

  const getTransitionClasses = useCallback(() => {
    const classes = []

    if (state.isVisible) classes.push("visible")
    if (state.isEntering) classes.push("entering")
    if (state.isExiting) classes.push("exiting")
    if (state.hasEntered) classes.push("entered")
    if (state.hasExited) classes.push("exited")

    return classes.join(" ")
  }, [state])

  return {
    ...state,
    getTransitionStyles,
    getTransitionClasses,
    shouldRender: state.isVisible || state.isEntering || state.isExiting,
  }
}

export function useStaggeredTransition(items: any[], show: boolean, options: TransitionOptions = {}) {
  const { staggerDelay = 100, ...restOptions } = options

  const transitions = items.map((_, index) =>
    useAnimatedTransition(show, {
      ...restOptions,
      staggerDelay,
      staggerIndex: index,
    }),
  )

  return transitions
}

export function useSequentialTransition(steps: boolean[], options: TransitionOptions = {}) {
  const { duration = 300, ...restOptions } = options

  const transitions = steps.map((show, index) =>
    useAnimatedTransition(show, {
      ...restOptions,
      duration,
      delay: index * duration,
    }),
  )

  return transitions
}
