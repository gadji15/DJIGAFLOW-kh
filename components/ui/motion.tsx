"use client"

import type React from "react"

import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"

// Fade In Animation
export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  viewport = { once: true, margin: "0px 0px -100px 0px" },
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  viewport?: { once: boolean; margin: string }
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    viewport={viewport}
    className={className}
  >
    {children}
  </motion.div>
)

// Slide In Animation
export const SlideIn = ({
  children,
  direction = "left",
  delay = 0,
  duration = 0.5,
  className = "",
  viewport = { once: true, margin: "0px 0px -100px 0px" },
}: {
  children: ReactNode
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  duration?: number
  className?: string
  viewport?: { once: boolean; margin: string }
}) => {
  const directionMap = {
    left: { x: -60, y: 0 },
    right: { x: 60, y: 0 },
    up: { x: 0, y: -60 },
    down: { x: 0, y: 60 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale Animation
export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  viewport = { once: true, margin: "0px 0px -100px 0px" },
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  viewport?: { once: boolean; margin: string }
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    viewport={viewport}
    className={className}
  >
    {children}
  </motion.div>
)

// Staggered Children Animation
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  className = "",
  viewport = { once: true, margin: "0px 0px -100px 0px" },
}: {
  children: ReactNode
  staggerDelay?: number
  className?: string
  viewport?: { once: boolean; margin: string }
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={viewport}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 },
      },
    }}
  >
    {children}
  </motion.div>
)

// Page Transition
export const PageTransition = ({ children }: { children: ReactNode }) => (
  <AnimatePresence mode="wait">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  </AnimatePresence>
)

// Hover Card Animation
export const HoverCard = ({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) => (
  <motion.div
    className={className}
    whileHover={{
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    }}
  >
    {children}
  </motion.div>
)

// Parallax Effect
export const ParallaxSection = ({
  children,
  className = "",
  speed = 0.5,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

// Smooth Scroll Progress
export const SmoothScrollProgress = ({ color = "bg-primary" }: { color?: string }) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return <motion.div className={`fixed top-0 left-0 right-0 h-1 ${color} z-50 origin-left`} style={{ scaleX }} />
}

// Text Reveal Animation
export const TextReveal = ({
  children,
  delay = 0,
  staggerChildren = 0.03,
  className = "",
  viewport = { once: true, margin: "0px 0px -100px 0px" },
}: {
  children: string
  delay?: number
  staggerChildren?: number
  className?: string
  viewport?: { once: boolean; margin: string }
}) => {
  const words = children.split(" ")

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        visible: {
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-1"
          variants={{
            hidden: { y: 40, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                damping: 20,
                stiffness: 100,
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// 3D Card Effect
export const Card3D = ({
  children,
  className = "",
  intensity = 10,
}: {
  children: ReactNode
  className?: string
  intensity?: number
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * intensity * -1
    const rotateY = ((x - centerX) / centerX) * intensity

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`
    cardRef.current.style.transition = "transform 0.5s ease"
  }

  const handleMouseEnter = () => {
    if (!cardRef.current) return
    cardRef.current.style.transition = "transform 0.1s ease"
  }

  return (
    <div
      ref={cardRef}
      className={`transition-transform ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </div>
  )
}
