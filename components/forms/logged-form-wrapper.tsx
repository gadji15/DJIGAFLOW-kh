"use client"

import type { ReactNode, FormEvent } from "react"
import { adminLogger } from "@/lib/admin-logger"

interface LoggedFormWrapperProps {
  children: ReactNode
  formName: string
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  className?: string
}

export function LoggedFormWrapper({ children, formName, onSubmit, className }: LoggedFormWrapperProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const startTime = Date.now()

    try {
      // Log form submission attempt
      await adminLogger.info("FORM", "form_submit_attempt", `Form submission started: ${formName}`, {
        formName,
        timestamp: new Date().toISOString(),
      })

      // Execute the original onSubmit handler
      if (onSubmit) {
        await onSubmit(event)
      }

      // Log successful submission
      const duration = Date.now() - startTime
      await adminLogger.logFormSubmit(formName, true, { duration })
    } catch (error) {
      // Log failed submission
      const duration = Date.now() - startTime
      await adminLogger.logFormSubmit(
        formName,
        false,
        { duration },
        error instanceof Error ? error : new Error(String(error)),
      )

      // Re-throw the error to maintain normal error handling
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  )
}
