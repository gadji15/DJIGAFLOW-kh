"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && window.workbox !== undefined) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/service-worker.js")
          console.log("Service Worker registered with scope:", registration.scope)

          // Request notification permission
          if ("Notification" in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                console.log("Notification permission granted")
              }
            })
          }
        } catch (error) {
          console.error("Service Worker registration failed:", error)
        }
      }

      registerServiceWorker()
    }
  }, [])

  return null
}
