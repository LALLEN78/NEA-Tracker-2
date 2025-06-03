"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Unlock, GraduationCap, TrendingUp, BookOpen } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

interface AuthContextType {
  isAuthenticated: boolean
  isPasswordEnabled: boolean
  login: (password: string) => boolean
  logout: () => void
  enablePassword: (password: string) => void
  disablePassword: () => void
  changePassword: (oldPassword: string, newPassword: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if password is enabled
    const savedPassword = localStorage.getItem("nea-tracker-password")
    const sessionAuth = sessionStorage.getItem("nea-tracker-authenticated")

    if (savedPassword) {
      setIsPasswordEnabled(true)
      if (sessionAuth === "true") {
        setIsAuthenticated(true)
        setShowSplash(false)
      }
    } else {
      setIsAuthenticated(true)
      setShowSplash(false)
    }

    setIsLoading(false)
  }, [])

  const login = (inputPassword: string): boolean => {
    const savedPassword = localStorage.getItem("nea-tracker-password")
    if (savedPassword && inputPassword === savedPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem("nea-tracker-authenticated", "true")
      setError("")
      return true
    }
    setError("Incorrect password")
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("nea-tracker-authenticated")
    setPassword("")
    setError("")
  }

  const enablePassword = (newPassword: string) => {
    localStorage.setItem("nea-tracker-password", newPassword)
    setIsPasswordEnabled(true)
    toast({
      title: "Password protection enabled",
      description: "Your data is now password protected.",
    })
  }

  const disablePassword = () => {
    localStorage.removeItem("nea-tracker-password")
    sessionStorage.removeItem("nea-tracker-authenticated")
    setIsPasswordEnabled(false)
    setIsAuthenticated(true)
    toast({
      title: "Password protection disabled",
      description: "Your data is no longer password protected.",
    })
  }

  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    const savedPassword = localStorage.getItem("nea-tracker-password")
    if (savedPassword && oldPassword === savedPassword) {
      localStorage.setItem("nea-tracker-password", newPassword)
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      })
      return true
    }
    return false
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(password)) {
      setShowSplash(false)
    }
  }

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show splash screen first
  if (showSplash && !isPasswordEnabled) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  // Show login if password is enabled and not authenticated
  if (isPasswordEnabled && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 relative">
              <Image src="/images/education-icon.png" alt="NEA Tracker" fill className="object-contain" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">NEA Tracker</CardTitle>
              <CardDescription className="text-gray-600">Enter your password to access student data</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                <Unlock className="mr-2 h-4 w-4" />
                Access NEA Tracker
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isPasswordEnabled,
        login,
        logout,
        enablePassword,
        disablePassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500) // Wait for fade out animation
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center space-y-8 animate-fade-in">
        {/* Main Logo and Animation */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto mb-6 relative animate-bounce-slow">
            <Image src="/images/education-icon.png" alt="NEA Tracker" fill className="object-contain drop-shadow-lg" />
          </div>

          {/* Animated Progress Bars */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-8 bg-blue-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 animate-slide-up">NEA Tracker</h1>
          <p className="text-lg text-gray-600 animate-slide-up-delay">Student Progress Management System</p>

          {/* Feature Icons */}
          <div className="flex justify-center space-x-8 mt-8 animate-slide-up-delay-2">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Students</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Progress</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">NEA</span>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-slow {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.3s both;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.6s both;
        }
        
        .animate-slide-up-delay-2 {
          animation: slide-up 0.8s ease-out 0.9s both;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  )
}
