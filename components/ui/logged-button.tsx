"use client"

import type { ReactNode, MouseEvent } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { adminLogger } from "@/lib/admin-logger"

interface LoggedButtonProps extends ButtonProps {
  children: ReactNode
  logName: string
  logContext?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
}

export function LoggedButton({ children, logName, logContext, onClick, ...props }: LoggedButtonProps) {
  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      // Log button click
      await adminLogger.logButtonClick(logName, logContext, {
        timestamp: new Date().toISOString(),
        buttonText: typeof children === "string" ? children : "Complex content",
        disabled: props.disabled,
        variant: props.variant,
      })

      // Execute the original onClick handler
      if (onClick) {
        await onClick(event)
      }
    } catch (error) {
      // Log button click error
      await adminLogger.error(
        "UI",
        "button_click_error",
        `Button click failed: ${logName}`,
        {
          logName,
          logContext,
          error: error instanceof Error ? error.message : String(error),
        },
        error instanceof Error ? error : new Error(String(error)),
      )

      // Re-throw the error to maintain normal error handling
      throw error
    }
  }

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  )
}
