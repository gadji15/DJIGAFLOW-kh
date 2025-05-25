"use client"

import type React from "react"

import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

// Magnetic Button Effect
export const MagneticButton = ({
  children,
  className = "",
  strength = 0.3,
  ...props
}: {
  children: ReactNode
  className?: string
  strength?: number
  [key: string]: any
}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Floating Elements
export const FloatingElement = ({
  children,
  delay = 0,
  duration = 3,
  amplitude = 10,
  className = "",
}: {
  children: ReactNode
  delay?: number
  duration?: number
  amplitude?: number
  className?: string
}) => (
  <motion.div
    className={className}
    animate={{
      y: [-amplitude, amplitude, -amplitude],
    }}
    transition={{
      duration,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
)

// Morphing Shape
export const MorphingShape = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={cn("absolute rounded-full bg-gradient-to-r from-primary/20 to-secondary/20", className)}
    animate={{
      borderRadius: ["50%", "30%", "50%", "40%", "50%"],
      rotate: [0, 90, 180, 270, 360],
    }}
    transition={{
      duration: 8,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  />
)

// Particle System
export const ParticleSystem = ({ count = 50, className = "" }: { count?: number; className?: string }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }))

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

// Reveal Text Animation
export const RevealText = ({
  children,
  delay = 0,
  className = "",
}: {
  children: string
  delay?: number
  className?: string
}) => {
  const words = children.split(" ")

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-2"
          variants={{
            hidden: { y: 100, opacity: 0 },
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

// Interactive Card with 3D Effect
export const Interactive3DCard = ({
  children,
  className = "",
  intensity = 15,
}: {
  children: ReactNode
  className?: string
  intensity?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rotateXValue = ((e.clientY - centerY) / rect.height) * intensity * -1
    const rotateYValue = ((e.clientX - centerX) / rect.width) * intensity
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn("perspective-1000", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  )
}

// Scroll Progress Indicator
export const ScrollProgress = ({ color = "bg-primary" }: { color?: string }) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return <motion.div className={cn("fixed top-0 left-0 right-0 h-1 z-50 origin-left", color)} style={{ scaleX }} />
}

// Loading Spinner with Morphing
export const MorphingLoader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <motion.div
      className={cn("relative", sizeMap[size])}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        animate={{
          borderRadius: ["50%", "30%", "50%"],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-1 rounded-full bg-gradient-to-r from-primary to-secondary"
        animate={{
          borderRadius: ["50%", "40%", "50%"],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
    </motion.div>
  )
}

// Parallax Container
export const ParallaxContainer = ({
  children,
  speed = 0.5,
  className = "",
}: {
  children: ReactNode
  speed?: number
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

// Staggered Grid Animation
export const StaggeredGrid = ({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
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

export const StaggeredGridItem = ({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 50, scale: 0.9 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
        },
      },
    }}
  >
    {children}
  </motion.div>
)
