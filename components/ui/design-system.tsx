import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type { ReactNode, JSX } from "react"

// Heading Component
const headingVariants = cva("font-heading tracking-tight", {
  variants: {
    level: {
      h1: "text-4xl md:text-5xl lg:text-6xl font-bold",
      h2: "text-3xl md:text-4xl font-bold",
      h3: "text-2xl md:text-3xl font-semibold",
      h4: "text-xl md:text-2xl font-semibold",
      h5: "text-lg md:text-xl font-medium",
      h6: "text-base md:text-lg font-medium",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      gradient: "bg-gradient-to-r from-primary via-primary-hover to-secondary bg-clip-text text-transparent",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    level: "h2",
    color: "default",
    align: "left",
  },
})

interface HeadingProps extends VariantProps<typeof headingVariants> {
  children: ReactNode
  className?: string
  id?: string
}

export function Heading({ level, color, align, children, className, id }: HeadingProps) {
  const Component = level || "h2"
  return (
    <Component id={id} className={cn(headingVariants({ level, color, align, className }))}>
      {children}
    </Component>
  )
}

// Text Component
const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    color: "default",
    align: "left",
    leading: "normal",
  },
})

interface TextProps extends VariantProps<typeof textVariants> {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function Text({ size, weight, color, align, leading, children, className, as = "p" }: TextProps) {
  const Component = as
  return (
    <Component className={cn(textVariants({ size, weight, color, align, leading, className }))}>{children}</Component>
  )
}

// Container Component
const containerVariants = cva("mx-auto px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full",
    },
    padding: {
      none: "py-0",
      sm: "py-4",
      md: "py-8",
      lg: "py-12",
      xl: "py-16",
      "2xl": "py-24",
    },
  },
  defaultVariants: {
    size: "2xl",
    padding: "lg",
  },
})

interface ContainerProps extends VariantProps<typeof containerVariants> {
  children: ReactNode
  className?: string
  id?: string
}

export function Container({ size, padding, children, className, id }: ContainerProps) {
  return (
    <div id={id} className={cn(containerVariants({ size, padding, className }))}>
      {children}
    </div>
  )
}

// Section Component
const sectionVariants = cva("", {
  variants: {
    padding: {
      none: "py-0",
      sm: "py-8",
      md: "py-12 md:py-16",
      lg: "py-16 md:py-24",
      xl: "py-24 md:py-32",
    },
    background: {
      default: "bg-background",
      muted: "bg-muted",
      primary: "bg-primary text-primary-foreground",
      "primary-light": "bg-primary/5",
      secondary: "bg-secondary text-secondary-foreground",
      "secondary-light": "bg-secondary/5",
      accent: "bg-accent text-accent-foreground",
      "accent-light": "bg-accent/5",
      gradient: "bg-gradient-to-r from-primary/20 to-secondary/20",
    },
  },
  defaultVariants: {
    padding: "md",
    background: "default",
  },
})

interface SectionProps extends VariantProps<typeof sectionVariants> {
  children: ReactNode
  className?: string
  id?: string
}

export function Section({ padding, background, children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn(sectionVariants({ padding, background, className }))}>
      {children}
    </section>
  )
}

// Grid Component
const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    },
    gap: {
      none: "gap-0",
      xs: "gap-2",
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-10",
    },
  },
  defaultVariants: {
    cols: 3,
    gap: "md",
  },
})

interface GridProps extends VariantProps<typeof gridVariants> {
  children: ReactNode
  className?: string
}

export function Grid({ cols, gap, children, className }: GridProps) {
  return <div className={cn(gridVariants({ cols, gap, className }))}>{children}</div>
}

// Flex Component
const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
    gap: {
      none: "gap-0",
      xs: "gap-2",
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-10",
    },
  },
  defaultVariants: {
    direction: "row",
    align: "start",
    justify: "start",
    wrap: "nowrap",
    gap: "none",
  },
})

interface FlexProps extends VariantProps<typeof flexVariants> {
  children: ReactNode
  className?: string
}

export function Flex({ direction, align, justify, wrap, gap, children, className }: FlexProps) {
  return <div className={cn(flexVariants({ direction, align, justify, wrap, gap, className }))}>{children}</div>
}

// Divider Component
const dividerVariants = cva("border-t", {
  variants: {
    color: {
      default: "border-border",
      primary: "border-primary",
      secondary: "border-secondary",
      muted: "border-muted",
    },
    spacing: {
      none: "my-0",
      sm: "my-4",
      md: "my-8",
      lg: "my-12",
      xl: "my-16",
    },
    width: {
      full: "w-full",
      "3/4": "w-3/4",
      "1/2": "w-1/2",
      "1/4": "w-1/4",
    },
  },
  defaultVariants: {
    color: "default",
    spacing: "md",
    width: "full",
  },
})

interface DividerProps extends VariantProps<typeof dividerVariants> {
  className?: string
}

export function Divider({ color, spacing, width, className }: DividerProps) {
  return <hr className={cn(dividerVariants({ color, spacing, width, className }))} />
}
