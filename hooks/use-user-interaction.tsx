"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface InteractionState {
  isHovered: boolean
  isFocused: boolean
  isPressed: boolean
  isActive: boolean
  clickCount: number
  lastInteraction: Date | null
}

interface InteractionOptions {
  enableHover?: boolean
  enableFocus?: boolean
  enablePress?: boolean
  enableDoubleClick?: boolean
  hoverDelay?: number
  pressDelay?: number
  resetDelay?: number
}

export function useUserInteraction(options: InteractionOptions = {}) {
  const {
    enableHover = true,
    enableFocus = true,
    enablePress = true,
    enableDoubleClick = false,
    hoverDelay = 0,
    pressDelay = 0,
    resetDelay = 3000,
  } = options

  const [state, setState] = useState<InteractionState>({
    isHovered: false,
    isFocused: false,
    isPressed: false,
    isActive: false,
    clickCount: 0,
    lastInteraction: null,
  })

  const timeoutRefs = useRef<{
    hover?: NodeJS.Timeout
    press?: NodeJS.Timeout
    reset?: NodeJS.Timeout
  }>({})

  const clearTimeouts = useCallback(() => {
    Object.values(timeoutRefs.current).forEach((timeout) => {
      if (timeout) clearTimeout(timeout)
    })
    timeoutRefs.current = {}
  }, [])

  const updateState = useCallback(
    (updates: Partial<InteractionState>) => {
      setState((prev) => ({
        ...prev,
        ...updates,
        lastInteraction: new Date(),
        isActive: updates.isHovered || updates.isFocused || updates.isPressed || prev.isActive,
      }))

      // Reset active state after delay
      if (resetDelay > 0) {
        if (timeoutRefs.current.reset) {
          clearTimeout(timeoutRefs.current.reset)
        }
        timeoutRefs.current.reset = setTimeout(() => {
          setState((prev) => ({ ...prev, isActive: false }))
        }, resetDelay)
      }
    },
    [resetDelay],
  )

  const handleMouseEnter = useCallback(() => {
    if (!enableHover) return

    if (hoverDelay > 0) {
      timeoutRefs.current.hover = setTimeout(() => {
        updateState({ isHovered: true })
      }, hoverDelay)
    } else {
      updateState({ isHovered: true })
    }
  }, [enableHover, hoverDelay, updateState])

  const handleMouseLeave = useCallback(() => {
    if (!enableHover) return

    if (timeoutRefs.current.hover) {
      clearTimeout(timeoutRefs.current.hover)
    }
    updateState({ isHovered: false })
  }, [enableHover, updateState])

  const handleFocus = useCallback(() => {
    if (!enableFocus) return
    updateState({ isFocused: true })
  }, [enableFocus, updateState])

  const handleBlur = useCallback(() => {
    if (!enableFocus) return
    updateState({ isFocused: false })
  }, [enableFocus, updateState])

  const handleMouseDown = useCallback(() => {
    if (!enablePress) return

    if (pressDelay > 0) {
      timeoutRefs.current.press = setTimeout(() => {
        updateState({ isPressed: true })
      }, pressDelay)
    } else {
      updateState({ isPressed: true })
    }
  }, [enablePress, pressDelay, updateState])

  const handleMouseUp = useCallback(() => {
    if (!enablePress) return

    if (timeoutRefs.current.press) {
      clearTimeout(timeoutRefs.current.press)
    }
    updateState({ isPressed: false })
  }, [enablePress, updateState])

  const handleClick = useCallback(() => {
    setState((prev) => ({
      ...prev,
      clickCount: prev.clickCount + 1,
      lastInteraction: new Date(),
    }))
  }, [])

  const handleDoubleClick = useCallback(() => {
    if (!enableDoubleClick) return
    setState((prev) => ({
      ...prev,
      clickCount: prev.clickCount + 2,
      lastInteraction: new Date(),
    }))
  }, [enableDoubleClick])

  useEffect(() => {
    return () => clearTimeouts()
  }, [clearTimeouts])

  const getInteractionStyles = useCallback(() => {
    const baseStyles = {
      transition: "all 0.2s ease-in-out",
      cursor: "pointer",
    }

    let transform = "scale(1)"
    let opacity = 1
    let filter = "none"

    if (state.isPressed) {
      transform = "scale(0.95)"
      opacity = 0.9
    } else if (state.isHovered) {
      transform = "scale(1.02)"
      filter = "brightness(1.05)"
    }

    if (state.isFocused) {
      filter = `${filter} drop-shadow(0 0 0 2px rgba(59, 130, 246, 0.5))`
    }

    return {
      ...baseStyles,
      transform,
      opacity,
      filter,
    }
  }, [state])

  const getInteractionClasses = useCallback(() => {
    const classes = []

    if (state.isHovered) classes.push("hovered")
    if (state.isFocused) classes.push("focused")
    if (state.isPressed) classes.push("pressed")
    if (state.isActive) classes.push("active")

    return classes.join(" ")
  }, [state])

  const handlers = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onClick: handleClick,
    onDoubleClick: enableDoubleClick ? handleDoubleClick : undefined,
  }

  return {
    ...state,
    handlers,
    getInteractionStyles,
    getInteractionClasses,
    clearTimeouts,
  }
}

export function useHoverEffect(delay = 0) {
  const [isHovered, setIsHovered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(true)
      }, delay)
    } else {
      setIsHovered(true)
    }
  }, [delay])

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsHovered(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isHovered,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  }
}
