"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/toast"

interface CSRFProtectionProps {
  children: React.ReactNode
}

export function CSRFProtection({ children }: CSRFProtectionProps) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const { addToast } = useToast()

  useEffect(() => {
    // Generate a random token on component mount
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setCsrfToken(token)

    // Store the token in sessionStorage
    sessionStorage.setItem("csrf-token", token)

    // Add a hidden input with the CSRF token to all forms
    const forms = document.querySelectorAll("form")
    forms.forEach((form) => {
      let input = form.querySelector('input[name="csrf-token"]')

      if (!input) {
        input = document.createElement("input")
        input.setAttribute("type", "hidden")
        input.setAttribute("name", "csrf-token")
        form.appendChild(input)
      }

      input.setAttribute("value", token)
    })

    // Add event listener to validate CSRF token on form submission
    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement
      const formToken = form.querySelector('input[name="csrf-token"]')?.value
      const storedToken = sessionStorage.getItem("csrf-token")

      if (!formToken || formToken !== storedToken) {
        event.preventDefault()
        addToast({
          type: "error",
          title: "Erreur de sécurité",
          message: "Une erreur de sécurité est survenue. Veuillez rafraîchir la page et réessayer.",
        })
      }
    }

    document.addEventListener("submit", handleFormSubmit as EventListener)

    return () => {
      document.removeEventListener("submit", handleFormSubmit as EventListener)
    }
  }, [addToast])

  return <>{children}</>
}
