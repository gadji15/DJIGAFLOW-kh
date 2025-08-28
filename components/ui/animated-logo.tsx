"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AnimatedLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
  textPosition?: "right" | "bottom"
  animated?: boolean
}

export function AnimatedLogo({
  className,
  size = "md",
  showText = true,
  textPosition = "right",
  animated = true,
}: AnimatedLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 lg:w-12 lg:h-12",
    lg: "w-16 h-16",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl lg:text-2xl",
    lg: "text-3xl",
  }

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  const textVariants = {
    initial: { opacity: 0, x: -10 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const subtitleVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.5,
      },
    },
  }

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center",
        textPosition === "bottom" && "flex-col",
        textPosition === "right" && "space-x-3",
        textPosition === "bottom" && "space-y-2",
        className,
      )}
    >
      <motion.div
        className="relative"
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
        variants={animated ? logoVariants : undefined}
      >
        <div
          className={cn(
            sizeClasses[size],
            "rounded-xl bg-gradient-to-br from-primary via-primary-hover to-secondary flex items-center justify-center shadow-lg",
          )}
        >
          <span className="text-primary-foreground font-bold text-lg lg:text-xl">J</span>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <motion.span
            className={cn(
              textSizeClasses[size],
              "font-bold bg-gradient-to-r from-primary via-primary-hover to-secondary bg-clip-text text-transparent",
            )}
            initial={animated ? "initial" : undefined}
            animate={animated ? "animate" : undefined}
            variants={animated ? textVariants : undefined}
          >
            JammShop
          </motion.span>
          <motion.div
            className="text-xs text-muted-foreground font-medium"
            initial={animated ? "initial" : undefined}
            animate={animated ? "animate" : undefined}
            variants={animated ? subtitleVariants : undefined}
          >
            Votre boutique tendance
          </motion.div>
        </div>
      )}
    </Link>
  )
}
