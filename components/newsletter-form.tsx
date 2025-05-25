"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface NewsletterFormProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  className?: string
  variant?: "default" | "card" | "inline"
}

export function NewsletterForm({
  title = "Restez informé",
  description = "Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives et nos dernières nouveautés",
  placeholder = "Votre adresse email",
  buttonText = "S'inscrire",
  className,
  variant = "default",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setErrorMessage("Veuillez entrer une adresse email")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus("error")
      setErrorMessage("Veuillez entrer une adresse email valide")
      return
    }

    setStatus("loading")

    // Simulate API call
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus("success")
      setEmail("")

      // Reset success status after 3 seconds
      setTimeout(() => {
        setStatus("idle")
      }, 3000)
    } catch (error) {
      setStatus("error")
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.")
    }
  }

  const variants = {
    default: "max-w-md mx-auto text-center",
    card: "bg-card border border-border rounded-lg p-6 shadow-sm",
    inline: "flex flex-col sm:flex-row items-center gap-4",
  }

  return (
    <div className={cn(variants[variant], className)}>
      {(variant === "default" || variant === "card") && (
        <>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className={cn("relative", variant === "inline" && "flex flex-col sm:flex-row w-full gap-3")}
      >
        <div className={cn("relative flex-1", variant !== "inline" && "mb-3")}>
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className={cn("pl-10", status === "error" && "border-red-500 focus-visible:ring-red-500")}
            aria-label="Adresse email"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={cn("relative overflow-hidden", variant !== "inline" && "w-full")}
        >
          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </motion.span>
            ) : status === "success" ? (
              <motion.span
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CheckCircle className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {buttonText}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </form>

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center text-red-500 text-sm mt-2"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            {errorMessage}
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center text-green-500 text-sm mt-2"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Merci pour votre inscription !
          </motion.div>
        )}
      </AnimatePresence>

      {(variant === "default" || variant === "card") && (
        <p className="text-xs text-muted-foreground mt-4">
          En vous inscrivant, vous acceptez de recevoir nos communications marketing. Vous pouvez vous désinscrire à
          tout moment.
        </p>
      )}
    </div>
  )
}
