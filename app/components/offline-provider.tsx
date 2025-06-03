"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface OfflineContextType {
  isOnline: boolean
  hasInstalledServiceWorker: boolean
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  hasInstalledServiceWorker: false,
})

export const useOfflineStatus = () => useContext(OfflineContext)

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [hasInstalledServiceWorker, setHasInstalledServiceWorker] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Initial online status
    setIsOnline(navigator.onLine)

    // Only attempt to register service worker in production environment
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.location.hostname !== "localhost" &&
      !window.location.hostname.includes("vusercontent.net")
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope)
          setHasInstalledServiceWorker(true)
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
          // Continue without service worker
        })
    } else {
      console.log("Service Worker not supported or development environment detected")
    }

    // Event listeners for online/offline status
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You're back online",
        description: "All features are now available",
        variant: "default",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're offline",
        description: "The app will continue to work with limited functionality",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  return <OfflineContext.Provider value={{ isOnline, hasInstalledServiceWorker }}>{children}</OfflineContext.Provider>
}
