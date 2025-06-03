"use client"

import { useEffect, useState } from "react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Set initial state
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-destructive px-3 py-1 text-xs text-destructive-foreground shadow-lg">
      <div className="h-2 w-2 rounded-full bg-white"></div>
      <span>Offline</span>
    </div>
  )
}
