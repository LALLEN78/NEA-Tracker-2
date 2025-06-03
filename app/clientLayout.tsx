"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "./components/sidebar"
import { OfflineProvider } from "./components/offline-provider"
import { OfflineIndicator } from "./components/offline-indicator"
import { InstallPrompt } from "./components/install-prompt"
import { AuthProvider, useAuth } from "./components/auth-provider"
import { hasUnsavedChanges, autoSave, markDataAsModified } from "./data"
import { toast } from "@/components/ui/use-toast"

function AppContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    // Auto-save every 5 minutes
    const autoSaveInterval = setInterval(
      () => {
        if (hasUnsavedChanges()) {
          autoSave()
          toast({
            title: "Auto-saved",
            description: "Your data has been automatically saved.",
          })
        }
      },
      5 * 60 * 1000,
    ) // 5 minutes

    // Warn before closing if there are unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        // Auto-save before closing
        autoSave()

        const message = "You have unsaved changes. Your data has been auto-saved, but you may want to create a backup."
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    // Listen for data changes in localStorage
    const handleStorageChange = () => {
      markDataAsModified()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("storage", handleStorageChange)

    // Cleanup
    return () => {
      clearInterval(autoSaveInterval)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [isAuthenticated])

  // If not authenticated, the AuthProvider will handle showing login/splash
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <OfflineProvider>
        <AuthProvider>
          <AppContent>{children}</AppContent>
          <OfflineIndicator />
          <InstallPrompt />
        </AuthProvider>
      </OfflineProvider>
    </ThemeProvider>
  )
}
