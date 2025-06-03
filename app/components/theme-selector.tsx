"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const themes = [
  {
    id: "default",
    name: "Modern Blue",
    description: "Clean, professional design with blue accents",
    preview: "bg-gradient-to-br from-blue-50 to-indigo-100",
    colors: {
      primary: "hsl(221.2 83.2% 53.3%)",
      secondary: "hsl(210 40% 96%)",
      accent: "hsl(210 40% 94%)",
    },
  },
  {
    id: "dark-pro",
    name: "Dark Professional",
    description: "Sleek dark theme for focused work",
    preview: "bg-gradient-to-br from-slate-800 to-slate-900",
    colors: {
      primary: "hsl(210 40% 98%)",
      secondary: "hsl(217.2 32.6% 17.5%)",
      accent: "hsl(217.2 32.6% 17.5%)",
    },
  },
  {
    id: "education-green",
    name: "Education Green",
    description: "Warm, educational theme with green accents",
    preview: "bg-gradient-to-br from-green-50 to-emerald-100",
    colors: {
      primary: "hsl(142.1 76.2% 36.3%)",
      secondary: "hsl(138 76% 97%)",
      accent: "hsl(138 76% 94%)",
    },
  },
  {
    id: "warm-orange",
    name: "Warm Orange",
    description: "Energetic and creative with orange highlights",
    preview: "bg-gradient-to-br from-orange-50 to-amber-100",
    colors: {
      primary: "hsl(24.6 95% 53.1%)",
      secondary: "hsl(60 4.8% 95.9%)",
      accent: "hsl(60 4.8% 95.9%)",
    },
  },
  {
    id: "purple-creative",
    name: "Creative Purple",
    description: "Inspiring purple theme for creative work",
    preview: "bg-gradient-to-br from-purple-50 to-violet-100",
    colors: {
      primary: "hsl(262.1 83.3% 57.8%)",
      secondary: "hsl(270 20% 98%)",
      accent: "hsl(270 20% 95%)",
    },
  },
  {
    id: "minimal-gray",
    name: "Minimal Gray",
    description: "Clean, distraction-free monochrome design",
    preview: "bg-gradient-to-br from-gray-50 to-slate-100",
    colors: {
      primary: "hsl(222.2 84% 4.9%)",
      secondary: "hsl(210 40% 96%)",
      accent: "hsl(210 40% 94%)",
    },
  },
  {
    id: "nature-teal",
    name: "Nature Teal",
    description: "Calming teal inspired by nature",
    preview: "bg-gradient-to-br from-teal-50 to-cyan-100",
    colors: {
      primary: "hsl(173 58% 39%)",
      secondary: "hsl(180 100% 97%)",
      accent: "hsl(180 100% 94%)",
    },
  },
  {
    id: "sunset-red",
    name: "Sunset Red",
    description: "Bold and energetic red theme",
    preview: "bg-gradient-to-br from-red-50 to-rose-100",
    colors: {
      primary: "hsl(346.8 77.2% 49.8%)",
      secondary: "hsl(0 0% 98%)",
      accent: "hsl(0 0% 96%)",
    },
  },
]

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("default")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem("nea-tracker-theme")
    if (savedTheme) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId)
    if (!theme) return

    const root = document.documentElement

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, "")
    document.body.classList.add(`theme-${themeId}`)

    // Save to localStorage
    localStorage.setItem("nea-tracker-theme", themeId)
    setCurrentTheme(themeId)
  }

  const currentThemeData = themes.find((t) => t.id === currentTheme)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="h-4 w-4 mr-2" />
          Theme: {currentThemeData?.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose Your Theme</DialogTitle>
          <DialogDescription>
            Select a theme to completely change the look and feel of the application
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentTheme === theme.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => applyTheme(theme.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{theme.name}</CardTitle>
                  {currentTheme === theme.id && <Check className="h-4 w-4 text-primary" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className={`h-20 rounded-md mb-3 ${theme.preview}`} />
                <CardDescription className="text-xs">{theme.description}</CardDescription>
                <div className="flex gap-1 mt-2">
                  {Object.values(theme.colors).map((color, index) => (
                    <div key={index} className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
