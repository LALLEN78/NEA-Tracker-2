"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Store the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt")
      setIsInstalled(true)
    } else {
      console.log("User dismissed the install prompt")
    }

    // Clear the saved prompt as it can't be used again
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  if (!showPrompt || isInstalled) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Install NEA Tracker</CardTitle>
        <CardDescription>Install this app on your device for offline access</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Installing the app will allow you to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Access all features without an internet connection</li>
          <li>Launch directly from your home screen</li>
          <li>Work with your data even when offline</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={handleInstallClick} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Install App
        </Button>
      </CardFooter>
    </Card>
  )
}
