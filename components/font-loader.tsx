"use client"

import { useEffect } from "react"

interface FontLoaderProps {
  fonts: {
    family: string
    url: string
    weight?: string
    style?: string
  }[]
}

export function FontLoader({ fonts }: FontLoaderProps) {
  useEffect(() => {
    // Create font face observers
    fonts.forEach((font) => {
      const fontFace = new FontFace(font.family, `url(${font.url})`, {
        weight: font.weight || "400",
        style: font.style || "normal",
      })

      // Load the font
      fontFace
        .load()
        .then((loadedFace) => {
          // Add the font to the document
          document.fonts.add(loadedFace)
          // Apply the font
          document.documentElement.classList.add(`font-${font.family.toLowerCase().replace(/\s+/g, "-")}`)
        })
        .catch((error) => {
          console.error(`Failed to load font: ${font.family}`, error)
        })
    })
  }, [fonts])

  return null
}
