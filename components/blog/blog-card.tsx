"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, User, ArrowRight } from "lucide-react"
import { EnhancedImage } from "@/components/ui/enhanced-image"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
  post: {
    id: string
    title: string
    excerpt: string
    coverImage: string
    date: string
    readingTime: string
    author: {
      name: string
      avatar?: string
    }
    slug: string
    category?: string
  }
  variant?: "default" | "featured" | "compact"
  className?: string
}

export function BlogCard({ post, variant = "default", className }: BlogCardProps) {
  const cardVariants = {
    default: "flex flex-col",
    featured: "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8",
    compact: "flex flex-row gap-4",
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group rounded-lg overflow-hidden border border-border/50 hover:border-primary/30 bg-card shadow-sm hover:shadow-md transition-all duration-300",
        cardVariants[variant],
        className,
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          variant === "default" && "aspect-video",
          variant === "featured" && "aspect-video md:aspect-square",
          variant === "compact" && "w-24 h-24 flex-shrink-0",
        )}
      >
        <Link href={`/blog/${post.slug}`}>
          <EnhancedImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {post.category && (
            <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-md">
              {post.category}
            </div>
          )}
        </Link>
      </div>

      {/* Content */}
      <div className={cn("flex flex-col", variant !== "compact" ? "p-6" : "p-0")}>
        <Link href={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors duration-200">
          <h3
            className={cn(
              "font-bold tracking-tight",
              variant === "featured" && "text-2xl md:text-3xl",
              variant === "default" && "text-xl",
              variant === "compact" && "text-base",
            )}
          >
            {post.title}
          </h3>
        </Link>

        {variant !== "compact" && (
          <p className="mt-3 text-muted-foreground line-clamp-2 md:line-clamp-3">{post.excerpt}</p>
        )}

        <div className={cn("flex items-center text-xs text-muted-foreground", variant !== "compact" ? "mt-4" : "mt-2")}>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <div className="mx-2">•</div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{post.readingTime}</span>
          </div>
        </div>

        {variant === "featured" && (
          <div className="mt-6 flex items-center">
            {post.author.avatar ? (
              <EnhancedImage
                src={post.author.avatar}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full mr-3"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
        )}

        {variant !== "compact" && (
          <Link
            href={`/blog/${post.slug}`}
            className="mt-6 inline-flex items-center text-sm font-medium text-primary group-hover:underline"
          >
            Lire l'article
            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}
