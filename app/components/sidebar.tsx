"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Menu,
  Home,
  Users,
  BarChart3,
  Award,
  Target,
  BookOpen,
  Settings,
  PresentationIcon as PresentationChart,
  FileText,
  Clipboard,
  Download,
  Upload,
  Save,
  HardDrive,
  Lightbulb,
  BookOpenCheck,
} from "lucide-react"
import { createBackup, loadBackupFromFile, hasUnsavedChanges, autoSave } from "../data"
import { ThemeSelector } from "./theme-selector"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Data Import", href: "/data-import", icon: Upload },
  { name: "Students", href: "/students", icon: Users },
  { name: "Progress", href: "/progress", icon: BarChart3 },
  { name: "NEA Criteria", href: "/nea-criteria", icon: BookOpen },
  { name: "NEA Units", href: "/nea-units", icon: BookOpenCheck },
  { name: "NEA Page Tracker", href: "/nea-page-tracker", icon: Clipboard },
  { name: "Grade Boundaries", href: "/grade-boundaries", icon: Target },
  { name: "Rewards", href: "/rewards", icon: Award },
  { name: "Analytics", href: "/analytics", icon: PresentationChart },
  { name: "Contextual Challenges", href: "/contextual-challenges", icon: Clipboard },
  { name: "Project Ideas", href: "/project-ideas", icon: Lightbulb },
  { name: "Whiteboard", href: "/whiteboard", icon: FileText },
  { name: "Student Log", href: "/student-log", icon: FileText },
  { name: "Moderation", href: "/moderation", icon: Clipboard },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleCreateBackup = async () => {
    setIsBackingUp(true)
    try {
      createBackup()
      toast({
        title: "Backup created",
        description: "Your data has been saved to a backup file.",
      })
    } catch (error) {
      toast({
        title: "Backup failed",
        description: "There was an error creating the backup.",
        variant: "destructive",
      })
    } finally {
      setIsBackingUp(false)
    }
  }

  const handleRestoreBackup = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".neabackup,.json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setIsRestoring(true)
      try {
        const success = await loadBackupFromFile(file)
        if (success) {
          toast({
            title: "Backup restored",
            description: "Your data has been restored successfully. Reloading page...",
          })
          setTimeout(() => window.location.reload(), 1500)
        } else {
          throw new Error("Invalid backup file")
        }
      } catch (error) {
        toast({
          title: "Restore failed",
          description: "The backup file is invalid or corrupted.",
          variant: "destructive",
        })
      } finally {
        setIsRestoring(false)
      }
    }
    input.click()
  }

  const handleQuickSave = () => {
    autoSave()
    toast({
      title: "Quick save complete",
      description: "Your current data has been saved.",
    })
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col sidebar">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="w-8 h-8 relative">
            <Image
              src="/images/school-logo.webp"
              alt="John Flamsteed Community School"
              fill
              className="object-contain"
            />
          </div>
          <span>NEA Tracker</span>
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4 lg:p-6">
          {/* Theme Selector */}
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Appearance</h3>
            <ThemeSelector />
          </div>

          <Separator />

          {/* Data Management Section */}
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Data Management</h3>
            <div className="space-y-2">
              <Button onClick={handleQuickSave} variant="outline" size="sm" className="w-full justify-start">
                <Save className="mr-2 h-4 w-4" />
                Quick Save
                {hasUnsavedChanges() && <div className="ml-auto w-2 h-2 rounded-full bg-amber-500" />}
              </Button>

              <Button
                onClick={handleCreateBackup}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                disabled={isBackingUp}
              >
                <Download className="mr-2 h-4 w-4" />
                {isBackingUp ? "Creating..." : "Create Backup"}
              </Button>

              <Button
                onClick={handleRestoreBackup}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                disabled={isRestoring}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isRestoring ? "Restoring..." : "Restore Backup"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Navigation Section */}
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Navigation</h3>
            <nav className="grid gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                  onClick={() => onOpenChange(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>

      {/* Status Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <HardDrive className="h-3 w-3" />
          <span>{hasUnsavedChanges() ? "Unsaved changes" : "All changes saved"}</span>
          {hasUnsavedChanges() && <div className="ml-auto h-2 w-2 rounded-full bg-amber-500" />}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden border-r bg-muted/40 md:block md:w-[280px] lg:w-[300px]">
        <SidebarContent />
      </div>
    </>
  )
}
