"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  Save,
  Bell,
  Shield,
  Download,
  Upload,
  Trash2,
  Cloud,
  Plus,
  FileText,
  RefreshCw,
  Calendar,
  Palette,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PasswordSettings } from "../components/password-settings"
import { ThemeSelector } from "../components/theme-selector"

// Define the NEA sections
const neaSections = [
  { id: "section-a", name: "Section A: Identifying & Investigating Design Possibilities", maxMarks: 10 },
  { id: "section-b", name: "Section B: Producing a Design Brief & Specification", maxMarks: 10 },
  { id: "section-c", name: "Section C: Generating Design Ideas", maxMarks: 20 },
  { id: "section-d", name: "Section D: Developing Design Ideas", maxMarks: 20 },
  { id: "section-e", name: "Section E: Realising Design Ideas", maxMarks: 20 },
  { id: "section-f", name: "Section F: Analysing & Evaluating", maxMarks: 20 },
]

// Define the deadline type
type Deadline = {
  sectionId: string
  date: string // ISO date string
  description?: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaveClassDialogOpen, setIsSaveClassDialogOpen] = useState(false)
  const [isLoadClassDialogOpen, setIsLoadClassDialogOpen] = useState(false)
  const [isManageClassesDialogOpen, setIsManageClassesDialogOpen] = useState(false)
  const [className, setClassName] = useState("")
  const [classDescription, setClassDescription] = useState("")
  const [savedClasses, setSavedClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [isGoogleDriveEnabled, setIsGoogleDriveEnabled] = useState(false)
  const [isGoogleDriveAuthenticated, setIsGoogleDriveAuthenticated] = useState(false)
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [isDeadlineDialogOpen, setIsDeadlineDialogOpen] = useState(false)
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null)

  // Load saved classes on component mount
  useEffect(() => {
    const classes = localStorage.getItem("nea-tracker-saved-classes")
    if (classes) {
      setSavedClasses(JSON.parse(classes))
    }

    // Check if Google Drive was previously enabled
    const driveEnabled = localStorage.getItem("nea-tracker-gdrive-enabled")
    if (driveEnabled === "true") {
      setIsGoogleDriveEnabled(true)
      // In a real implementation, we would check if the user is still authenticated
      setIsGoogleDriveAuthenticated(localStorage.getItem("nea-tracker-gdrive-auth") === "true")
    }

    // Load deadlines
    const savedDeadlines = localStorage.getItem("nea-tracker-deadlines")
    if (savedDeadlines) {
      setDeadlines(JSON.parse(savedDeadlines))
    } else {
      // Initialize with empty deadlines for each section
      const initialDeadlines = neaSections.map((section) => ({
        sectionId: section.id,
        date: "",
        description: "",
      }))
      setDeadlines(initialDeadlines)
      localStorage.setItem("nea-tracker-deadlines", JSON.stringify(initialDeadlines))
    }
  }, [])

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    })
  }

  const handleImportData = () => {
    // Create a file input element
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          // Validate JSON format
          const data = JSON.parse(event.target.result)

          // Basic validation that it's student data
          if (!Array.isArray(data) || !data.length || !data[0].hasOwnProperty("name")) {
            throw new Error("Invalid student data format")
          }

          // Ask for confirmation before replacing current data
          if (confirm("This will replace your current student data. Continue?")) {
            localStorage.setItem("nea-tracker-students", event.target.result)
            toast({
              title: "Import successful",
              description: "Class data has been imported successfully.",
            })
            // Reload the page to reflect changes
            window.location.reload()
          }
        } catch (error) {
          toast({
            title: "Import failed",
            description: "The selected file contains invalid data.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }

    input.click()
  }

  const handleExportData = () => {
    // Get current student data
    const students = localStorage.getItem("nea-tracker-students")
    if (!students) {
      toast({
        title: "No data to export",
        description: "There is no student data to export.",
        variant: "destructive",
      })
      return
    }

    // Create a file with the data
    const blob = new Blob([students], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Create a link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `nea-tracker-class-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: "Class data has been exported as a JSON file.",
    })
  }

  const saveCurrentClass = () => {
    // Open dialog to save current class
    setIsSaveClassDialogOpen(true)
  }

  const loadSavedClass = () => {
    // Open dialog to load a saved class
    setIsLoadClassDialogOpen(true)
  }

  const manageClasses = () => {
    // Open dialog to manage saved classes
    setIsManageClassesDialogOpen(true)
  }

  const handleGoogleDriveToggle = () => {
    if (!isGoogleDriveEnabled) {
      // Enable Google Drive
      setIsGoogleDriveEnabled(true)
      localStorage.setItem("nea-tracker-gdrive-enabled", "true")

      // In a real implementation, we would authenticate with Google here
      // For this demo, we'll simulate authentication
      simulateGoogleAuth()
    } else {
      // Disable Google Drive
      if (confirm("Are you sure you want to disable Google Drive integration? Your local data will not be affected.")) {
        setIsGoogleDriveEnabled(false)
        setIsGoogleDriveAuthenticated(false)
        localStorage.setItem("nea-tracker-gdrive-enabled", "false")
        localStorage.removeItem("nea-tracker-gdrive-auth")

        toast({
          title: "Google Drive disabled",
          description: "Google Drive integration has been disabled.",
        })
      }
    }
  }

  const simulateGoogleAuth = () => {
    // In a real implementation, this would redirect to Google's OAuth flow
    toast({
      title: "Authenticating with Google Drive",
      description: "Please wait while we connect to your Google Drive account...",
    })

    // Simulate authentication delay
    setTimeout(() => {
      setIsGoogleDriveAuthenticated(true)
      localStorage.setItem("nea-tracker-gdrive-auth", "true")

      toast({
        title: "Google Drive connected",
        description: "Your account has been successfully connected to Google Drive.",
      })
    }, 1500)
  }

  const saveToGoogleDrive = () => {
    // In a real implementation, this would upload to Google Drive
    toast({
      title: "Saving to Google Drive",
      description: "Uploading your class data to Google Drive...",
    })

    // Simulate upload delay
    setTimeout(() => {
      toast({
        title: "Saved to Google Drive",
        description: "Your class data has been successfully saved to Google Drive.",
      })
    }, 1500)
  }

  const loadFromGoogleDrive = () => {
    // In a real implementation, this would download from Google Drive
    toast({
      title: "Loading from Google Drive",
      description: "Downloading your class data from Google Drive...",
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Loaded from Google Drive",
        description: "Your class data has been successfully loaded from Google Drive.",
      })
    }, 1500)
  }

  const handleEditDeadline = (deadline: Deadline) => {
    setEditingDeadline(deadline)
    setIsDeadlineDialogOpen(true)
  }

  const handleSaveDeadline = () => {
    if (!editingDeadline) return

    const updatedDeadlines = deadlines.map((d) => (d.sectionId === editingDeadline.sectionId ? editingDeadline : d))

    setDeadlines(updatedDeadlines)
    localStorage.setItem("nea-tracker-deadlines", JSON.stringify(updatedDeadlines))

    setIsDeadlineDialogOpen(false)
    setEditingDeadline(null)

    toast({
      title: "Deadline updated",
      description: "The deadline has been updated successfully.",
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    } catch (e) {
      return "Invalid date"
    }
  }

  const getDaysRemaining = (dateString: string) => {
    if (!dateString) return null

    try {
      const deadline = new Date(dateString)
      const today = new Date()

      // Reset time part for accurate day calculation
      today.setHours(0, 0, 0, 0)
      deadline.setHours(0, 0, 0, 0)

      const diffTime = deadline.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return diffDays
    } catch (e) {
      return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences and settings</p>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="deadlines">NEA Deadlines</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school-name">School Name</Label>
                <Input id="school-name" defaultValue="John Flamsteed Community School" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic-year">Academic Year</Label>
                <Select defaultValue="2025-2026">
                  <SelectTrigger id="academic-year">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" defaultValue="Design & Technology" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto-save Changes</Label>
                  <p className="text-sm text-muted-foreground">Automatically save changes to student records</p>
                </div>
                <Switch id="auto-save" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NEA Settings</CardTitle>
              <CardDescription>Configure NEA-specific settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nea-subject">NEA Subject</Label>
                <Select defaultValue="dt">
                  <SelectTrigger id="nea-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dt">Design & Technology</SelectItem>
                    <SelectItem value="art">Art & Design</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-board">Exam Board</Label>
                <Select defaultValue="aqa">
                  <SelectTrigger id="exam-board">
                    <SelectValue placeholder="Select exam board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aqa">AQA</SelectItem>
                    <SelectItem value="edexcel">Edexcel</SelectItem>
                    <SelectItem value="ocr">OCR</SelectItem>
                    <SelectItem value="wjec">WJEC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="submission-deadline">Final Submission Deadline</Label>
                <Input id="submission-deadline" type="date" defaultValue="2023-05-15" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-rewards">Enable Rewards System</Label>
                  <p className="text-sm text-muted-foreground">Allow students to earn points and achievements</p>
                </div>
                <Switch id="enable-rewards" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Application Theme</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose from multiple themes to completely change the visual style
                  </p>
                  <ThemeSelector />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-medium">Display Options</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing for more content on screen</p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animations">Enable Animations</Label>
                      <p className="text-sm text-muted-foreground">Smooth transitions and hover effects</p>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Palette className="mr-2 h-4 w-4" />
                Save Appearance Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input id="display-name" defaultValue="Mr. Allen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="allenl@jfcs.org.uk" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="teacher">
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="head">Department Head</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Update Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Notification Types</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Student Progress Updates</Label>
                    <p className="text-sm text-muted-foreground">When students complete sections</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Deadline Reminders</Label>
                    <p className="text-sm text-muted-foreground">Upcoming section deadlines</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Achievement Alerts</Label>
                    <p className="text-sm text-muted-foreground">When students earn achievements</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Announcements</Label>
                    <p className="text-sm text-muted-foreground">Important system updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Notification Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Bell className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>Save, load, and manage your classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Button onClick={saveCurrentClass} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Save Current Class
                </Button>
                <Button onClick={loadSavedClass} className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Load Saved Class
                </Button>
                <Button onClick={manageClasses} className="w-full" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Manage Classes
                </Button>
                <Button onClick={handleExportData} className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Current Class
                </Button>
                <Button onClick={handleImportData} className="w-full" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Class Data
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Google Drive Integration</Label>
                    <p className="text-sm text-muted-foreground">Save and load classes from Google Drive</p>
                  </div>
                  <Switch checked={isGoogleDriveEnabled} onCheckedChange={handleGoogleDriveToggle} />
                </div>

                {isGoogleDriveEnabled && (
                  <div className="space-y-4 rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Google Drive Status</h4>
                        <p className="text-sm text-muted-foreground">
                          {isGoogleDriveAuthenticated ? "Connected to Google Drive" : "Not connected to Google Drive"}
                        </p>
                      </div>
                      <Badge variant={isGoogleDriveAuthenticated ? "default" : "outline"}>
                        {isGoogleDriveAuthenticated ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>

                    {!isGoogleDriveAuthenticated ? (
                      <Button onClick={simulateGoogleAuth} className="w-full">
                        Connect to Google Drive
                      </Button>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Button onClick={saveToGoogleDrive} className="w-full">
                          <Cloud className="mr-2 h-4 w-4" />
                          Save to Google Drive
                        </Button>
                        <Button onClick={loadFromGoogleDrive} className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Load from Google Drive
                        </Button>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Note: This is a simulated Google Drive integration for demonstration purposes. In a production
                      environment, this would connect to the actual Google Drive API.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Import/Export</CardTitle>
              <CardDescription>Import, export, and manage your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Import Data</h3>
                <div className="grid gap-2">
                  <Label htmlFor="import-type">Import Type</Label>
                  <Select defaultValue="students">
                    <SelectTrigger id="import-type">
                      <SelectValue placeholder="Select import type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="students">Student Data</SelectItem>
                      <SelectItem value="classes">Class Data</SelectItem>
                      <SelectItem value="marks">NEA Marks</SelectItem>
                      <SelectItem value="all">All Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="import-format">Import Format</Label>
                  <Select defaultValue="csv">
                    <SelectTrigger id="import-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleImportData}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Export Data</h3>
                <div className="grid gap-2">
                  <Label htmlFor="export-type">Export Type</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="export-type">
                      <SelectValue placeholder="Select export type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="students">Student Data</SelectItem>
                      <SelectItem value="classes">Class Data</SelectItem>
                      <SelectItem value="marks">NEA Marks</SelectItem>
                      <SelectItem value="all">All Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select defaultValue="excel">
                    <SelectTrigger id="export-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Data Cleanup</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Archive Completed Projects</Label>
                    <p className="text-sm text-muted-foreground">Move completed projects to archive</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Archive
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Clear Temporary Data</Label>
                    <p className="text-sm text-muted-foreground">Remove cached and temporary files</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-destructive">Reset All Data</Label>
                    <p className="text-sm text-muted-foreground">This will permanently delete all data</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (
                        confirm(
                          "WARNING: This will permanently delete ALL data including students, classes, and settings. This action cannot be undone. Are you absolutely sure?",
                        )
                      ) {
                        // Clear all localStorage data
                        localStorage.removeItem("nea-tracker-students")
                        localStorage.removeItem("nea-tracker-saved-classes")
                        localStorage.removeItem("nea-tracker-settings")

                        toast({
                          title: "Data reset complete",
                          description: "All data has been permanently deleted.",
                          variant: "destructive",
                        })

                        // Reload the page
                        window.location.reload()
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NEA Section Deadlines</CardTitle>
              <CardDescription>Set and manage deadlines for each NEA section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Days Remaining</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deadlines.map((deadline) => {
                      const section = neaSections.find((s) => s.id === deadline.sectionId)
                      const daysRemaining = getDaysRemaining(deadline.date)

                      return (
                        <TableRow key={deadline.sectionId}>
                          <TableCell className="font-medium">{section?.name.split(":")[0]}</TableCell>
                          <TableCell>{formatDate(deadline.date)}</TableCell>
                          <TableCell>
                            {daysRemaining !== null ? (
                              <Badge
                                variant={daysRemaining < 0 ? "destructive" : daysRemaining <= 7 ? "warning" : "default"}
                              >
                                {daysRemaining < 0
                                  ? `${Math.abs(daysRemaining)} days overdue`
                                  : daysRemaining === 0
                                    ? "Due today"
                                    : `${daysRemaining} days remaining`}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Not set</Badge>
                            )}
                          </TableCell>
                          <TableCell>{deadline.description || "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleEditDeadline(deadline)}>
                              <Calendar className="h-4 w-4 mr-1" />
                              Set Deadline
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  localStorage.setItem("nea-tracker-deadlines", JSON.stringify(deadlines))
                  toast({
                    title: "Deadlines saved",
                    description: "All deadlines have been saved successfully.",
                  })
                }}
              >
                <Save className="mr-2 h-4 w-4" />
                Save All Deadlines
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <PasswordSettings />

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Privacy</Label>
                  <p className="text-sm text-muted-foreground">Control how student data is used</p>
                </div>
                <Button variant="outline" size="sm">
                  Privacy Settings
                </Button>
              </div>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Access Control</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Student Access</Label>
                    <p className="text-sm text-muted-foreground">Allow students to view their own progress</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Parent Access</Label>
                    <p className="text-sm text-muted-foreground">Allow parents to view their child's progress</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Department Access</Label>
                    <p className="text-sm text-muted-foreground">Allow department heads to view all student data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Shield className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Class Dialog */}
      <Dialog open={isSaveClassDialogOpen} onOpenChange={setIsSaveClassDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Current Class</DialogTitle>
            <DialogDescription>Enter a name and optional description for this class.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class-name" className="text-right">
                Class Name
              </Label>
              <Input
                id="class-name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Year 10 DT 2023"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class-description" className="text-right">
                Description
              </Label>
              <Input
                id="class-description"
                value={classDescription}
                onChange={(e) => setClassDescription(e.target.value)}
                className="col-span-3"
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setClassName("")
                setClassDescription("")
                setIsSaveClassDialogOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!className.trim()) {
                  toast({
                    title: "Class name required",
                    description: "Please enter a name for this class.",
                    variant: "destructive",
                  })
                  return
                }

                // Get current student data
                const students = localStorage.getItem("nea-tracker-students")
                if (!students) {
                  toast({
                    title: "No data to save",
                    description: "There is no student data to save.",
                    variant: "destructive",
                  })
                  return
                }

                // Save class data
                const newClass = {
                  id: Date.now().toString(),
                  name: className,
                  description: classDescription,
                  data: JSON.parse(students),
                  date: new Date().toISOString(),
                  studentCount: JSON.parse(students).length,
                }

                const updatedClasses = [...savedClasses, newClass]
                localStorage.setItem("nea-tracker-saved-classes", JSON.stringify(updatedClasses))
                setSavedClasses(updatedClasses)

                toast({
                  title: "Class saved",
                  description: `Class "${className}" has been saved successfully.`,
                })

                setClassName("")
                setClassDescription("")
                setIsSaveClassDialogOpen(false)
              }}
            >
              Save Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Class Dialog */}
      <Dialog open={isLoadClassDialogOpen} onOpenChange={setIsLoadClassDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Load Saved Class</DialogTitle>
            <DialogDescription>Select a previously saved class to load.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {savedClasses.length === 0 ? (
              <p className="text-center text-muted-foreground">No saved classes found.</p>
            ) : (
              <div className="space-y-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} ({new Date(cls.date).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedClass && (
                  <div className="space-y-2 rounded-md border p-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Class:</span>
                      <span className="text-sm">{savedClasses.find((c) => c.id === selectedClass)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Date Saved:</span>
                      <span className="text-sm">
                        {new Date(savedClasses.find((c) => c.id === selectedClass)?.date).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Students:</span>
                      <span className="text-sm">
                        {savedClasses.find((c) => c.id === selectedClass)?.studentCount || 0}
                      </span>
                    </div>
                    {savedClasses.find((c) => c.id === selectedClass)?.description && (
                      <div className="pt-2">
                        <span className="text-sm font-medium">Description:</span>
                        <p className="text-sm text-muted-foreground">
                          {savedClasses.find((c) => c.id === selectedClass)?.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedClass("")
                setIsLoadClassDialogOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedClass}
              onClick={() => {
                const selectedClassData = savedClasses.find((c) => c.id === selectedClass)
                if (selectedClassData) {
                  if (confirm("This will replace your current student data. Continue?")) {
                    localStorage.setItem("nea-tracker-students", JSON.stringify(selectedClassData.data))

                    toast({
                      title: "Class loaded",
                      description: `Class "${selectedClassData.name}" has been loaded successfully.`,
                    })

                    // Reload the page to reflect changes
                    window.location.reload()
                  }
                }
              }}
            >
              Load Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Classes Dialog */}
      <Dialog open={isManageClassesDialogOpen} onOpenChange={setIsManageClassesDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Manage Saved Classes</DialogTitle>
            <DialogDescription>View, export, or delete your saved classes.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {savedClasses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No saved classes found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Date Saved</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedClasses.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">
                        {cls.name}
                        {cls.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{cls.description}</p>
                        )}
                      </TableCell>
                      <TableCell>{cls.studentCount || cls.data.length}</TableCell>
                      <TableCell>{new Date(cls.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Create a file with the data
                              const blob = new Blob([JSON.stringify(cls.data)], { type: "application/json" })
                              const url = URL.createObjectURL(blob)

                              // Create a link and trigger download
                              const a = document.createElement("a")
                              a.href = url
                              a.download = `${cls.name.replace(/\s+/g, "-")}-${new Date(cls.date).toISOString().split("T")[0]}.json`
                              document.body.appendChild(a)
                              a.click()

                              // Clean up
                              document.body.removeChild(a)
                              URL.revokeObjectURL(url)

                              toast({
                                title: "Export successful",
                                description: `Class "${cls.name}" has been exported as a JSON file.`,
                              })
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete the class "${cls.name}"?`)) {
                                const updatedClasses = savedClasses.filter((c) => c.id !== cls.id)
                                localStorage.setItem("nea-tracker-saved-classes", JSON.stringify(updatedClasses))
                                setSavedClasses(updatedClasses)

                                toast({
                                  title: "Class deleted",
                                  description: `Class "${cls.name}" has been deleted.`,
                                })
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsManageClassesDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Deadline Dialog */}
      <Dialog open={isDeadlineDialogOpen} onOpenChange={setIsDeadlineDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Section Deadline</DialogTitle>
            <DialogDescription>
              {editingDeadline && neaSections.find((s) => s.id === editingDeadline.sectionId)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline-date" className="text-right">
                Deadline Date
              </Label>
              <Input
                id="deadline-date"
                type="date"
                value={editingDeadline?.date || ""}
                onChange={(e) =>
                  editingDeadline &&
                  setEditingDeadline({
                    ...editingDeadline,
                    date: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline-description" className="text-right">
                Description
              </Label>
              <Input
                id="deadline-description"
                value={editingDeadline?.description || ""}
                onChange={(e) =>
                  editingDeadline &&
                  setEditingDeadline({
                    ...editingDeadline,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="e.g., Submit draft for review"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingDeadline(null)
                setIsDeadlineDialogOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveDeadline}>Save Deadline</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
