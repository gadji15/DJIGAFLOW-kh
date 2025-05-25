"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"

// Floating Action Button
export const FloatingActionButton = ({
  icon: Icon,
  label,
  onClick,
  className = "",
}: {
  icon: any
  label: string
  onClick: () => void
  className?: string
}) => (
  <motion.button
    className={cn(
      "fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg z-50",
      "flex items-center justify-center",
      className,
    )}
    onClick={onClick}
    whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
    whileTap={{ scale: 0.9 }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
    <Icon className="w-6 h-6" />
    <motion.span
      className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      {label}
    </motion.span>
  </motion.button>
)

// Animated Tab Navigation
export const AnimatedTabs = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: {
  tabs: { id: string; label: string; icon?: any; badge?: string }[]
  activeTab: string
  onTabChange: (id: string) => void
  className?: string
}) => (
  <div className={cn("flex space-x-1 bg-muted p-1 rounded-lg", className)}>
    {tabs.map((tab) => {
      const Icon = tab.icon
      return (
        <motion.button
          key={tab.id}
          className={cn(
            "relative flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => onTabChange(tab.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {activeTab === tab.id && (
            <motion.div
              className="absolute inset-0 bg-primary rounded-md"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <div className="relative flex items-center space-x-2">
            {Icon && <Icon className="w-4 h-4" />}
            <span>{tab.label}</span>
            {tab.badge && (
              <Badge variant="secondary" className="text-xs">
                {tab.badge}
              </Badge>
            )}
          </div>
        </motion.button>
      )
    })}
  </div>
)

// Breadcrumb with Animation
export const AnimatedBreadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => (
  <nav className="flex items-center space-x-2 text-sm">
    <AnimatePresence>
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ delay: index * 0.1 }}
        >
          {item.href ? (
            <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="text-muted-foreground">/</span>}
        </motion.div>
      ))}
    </AnimatePresence>
  </nav>
)

// Smart Search Bar
export const SmartSearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions] = useState(["iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Air M3", "AirPods Pro", "iPad Pro"])

  return (
    <div className="relative w-full max-w-md">
      <motion.div
        className={cn("relative flex items-center", isFocused && "ring-2 ring-primary ring-offset-2 rounded-lg")}
        layout
      >
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher des produits..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-3 w-4 h-4 text-muted-foreground hover:text-foreground"
              onClick={() => setQuery("")}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isFocused && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50"
          >
            <div className="p-2">
              {suggestions
                .filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
                .map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors"
                    onClick={() => {
                      setQuery(suggestion)
                      onSearch(suggestion)
                      setIsFocused(false)
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span>{suggestion}</span>
                    </div>
                  </motion.button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Dock Navigation (macOS style)
export const DockNavigation = ({ items }: { items: any[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-end space-x-2 bg-background/80 backdrop-blur-md border border-border rounded-2xl p-3 shadow-lg z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {items.map((item, index) => {
        const Icon = item.icon
        const isHovered = hoveredIndex === index
        const isAdjacent = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1

        return (
          <motion.button
            key={item.id}
            className="relative flex flex-col items-center justify-center p-2 rounded-xl hover:bg-muted/50 transition-colors"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            animate={{
              scale: isHovered ? 1.3 : isAdjacent ? 1.1 : 1,
              y: isHovered ? -10 : isAdjacent ? -5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Icon className="w-6 h-6" />
            {item.badge && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center"
                animate={{ scale: isHovered ? 1.2 : 1 }}
              >
                {item.badge}
              </motion.div>
            )}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-8 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap"
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
