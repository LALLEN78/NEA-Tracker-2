"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import {
  Save,
  FolderOpen,
  Download,
  Upload,
  Trash2,
  ChevronDown,
  Database,
  CloudUpload,
  CloudDownload,
} from "lucide-react"

export function ClassManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("save")
  const [className, setClassName] = useState("")
  const [classDescription, setClassDescription] = useState("")
  const [savedClasses, setSavedClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [isGDriveEnabled, setIsGDriveEnabled] = useState(false)
  const [isGDriveAuthenticated, setIsGDriveAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Load saved classes and Google Drive settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedClassesData = localStorage.getItem("nea-tracker-saved-classes")
      if (savedClassesData) {
        setSavedClasses(JSON.parse(savedClassesData))
      }

      const gdriveEnabled = localStorage.getItem("nea-tracker-gdrive-enabled")
      if (gdriveEnabled) {
        setIsGDriveEnabled(gdriveEnabled === "true")
      }

      const gdriveAuth = localStorage.getItem("nea-tracker-gdrive-auth")
      if (gdriveAuth) {
        setIsGDriveAuthenticated(gdriveAuth === "true")
      }
    }
  }, [])

  // Save current class
  const handleSaveClass = () => {
    if (!className.trim()) {
      toast({
        title: "Error",
        description: "Please enter a class name",
        variant: "destructive",
      })
      return
    }

    // Get current students data
    const studentsData = localStorage.getItem("nea-tracker-students")
    if (!studentsData) {
      toast({
        title: "Error",
        description: "No student data found to save",
        variant: "destructive",
      })
      return
    }

    const newClass = {
      id: Date.now().toString(),
      name: className,
      description: classDescription,
      date: new Date().toISOString(),
      studentCount: JSON.parse(studentsData).length,
      data: studentsData,
    }

    const updatedClasses = [...savedClasses, newClass]
    setSavedClasses(updatedClasses)
    localStorage.setItem("nea-tracker-saved-classes", JSON.stringify(updatedClasses))

    toast({
      title: "Class saved",
      description: `"${className}" has been saved successfully.`,
    })

    // Reset form
    setClassName("")
    setClassDescription("")
    setActiveTab("manage")

    // Save to Google Drive if enabled
    if (isGDriveEnabled && isGDriveAuthenticated) {
      handleSaveToGDrive(newClass)
    }
  }

  // Load selected class
  const handleLoadClass = (classData) => {
    if (confirm(`Are you sure you want to load "${classData.name}"? This will replace your current student data.`)) {
      localStorage.setItem("nea-tracker-students", classData.data)
      toast({
        title: "Class loaded",
        description: `"${classData.name}" has been loaded successfully.`,
      })
      setIsDialogOpen(false)
    }
  }

  // Delete selected class
  const handleDeleteClass = (id) => {
    if (confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
      const updatedClasses = savedClasses.filter((c) => c.id !== id)
      setSavedClasses(updatedClasses)
      localStorage.setItem("nea-tracker-saved-classes", JSON.stringify(updatedClasses))
      toast({
        title: "Class deleted",
        description: "The class has been deleted successfully.",
      })
    }
  }

  // Export class as JSON file
  const handleExportClass = (classData) => {
    const dataStr = JSON.stringify(classData)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `${classData.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Import class from JSON file
  const handleImportClass = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedClass = JSON.parse(e.target.result)

        // Validate imported data
        if (!importedClass.name || !importedClass.data) {
          throw new Error("Invalid class data format")
        }

        // Add to saved classes
        const newClass = {
          ...importedClass,
          id: Date.now().toString(), // Generate new ID to avoid conflicts
          date: new Date().toISOString(), // Update date to import date
        }

        const updatedClasses = [...savedClasses, newClass]
        setSavedClasses(updatedClasses)
        localStorage.setItem("nea-tracker-saved-classes", JSON.stringify(updatedClasses))

        toast({
          title: "Class imported",
          description: `"${newClass.name}" has been imported successfully.`,
        })

        // Reset file input
        event.target.value = null
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

  // Export all data as a gradebook
  const handleExportGradebook = () => {
    // Collect all data from localStorage
    const gradebookData = {
      students: JSON.parse(localStorage.getItem("nea-tracker-students") || "[]"),
      scores: JSON.parse(localStorage.getItem("nea-tracker-scores") || "{}"),
      savedClasses: JSON.parse(localStorage.getItem("nea-tracker-saved-classes") || "[]"),
      deadlines: JSON.parse(localStorage.getItem("nea-tracker-deadlines") || "[]"),
      settings: JSON.parse(localStorage.getItem("nea-tracker-settings") || "{}"),
      rewards: JSON.parse(localStorage.getItem("nea-tracker-rewards") || "{}"),
      mockExamScores: JSON.parse(localStorage.getItem("nea-tracker-mock-exam-scores") || "{}"),
      version: "1.0.0", // For future compatibility checks
      exportDate: new Date().toISOString(),
    }

    // Create a file with the data
    const dataStr = JSON.stringify(gradebookData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `nea-tracker-gradebook-${new Date().toISOString().split("T")[0]}.neagb`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Gradebook exported",
      description: "Your gradebook has been exported successfully. Save this file to your USB drive.",
    })
  }

  // Import gradebook data
  const handleImportGradebook = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)

        // Validate imported data
        if (!importedData.version || !importedData.students) {
          throw new Error("Invalid gradebook data format")
        }

        // Ask for confirmation before replacing current data
        if (confirm("This will replace ALL your current data including students, scores, and settings. Continue?")) {
          // Store each data type in localStorage
          if (importedData.students) localStorage.setItem("nea-tracker-students", JSON.stringify(importedData.students))
          if (importedData.scores) localStorage.setItem("nea-tracker-scores", JSON.stringify(importedData.scores))
          if (importedData.savedClasses)
            localStorage.setItem("nea-tracker-saved-classes", JSON.stringify(importedData.savedClasses))
          if (importedData.deadlines)
            localStorage.setItem("nea-tracker-deadlines", JSON.stringify(importedData.deadlines))
          if (importedData.settings) localStorage.setItem("nea-tracker-settings", JSON.stringify(importedData.settings))
          if (importedData.rewards) localStorage.setItem("nea-tracker-rewards", JSON.stringify(importedData.rewards))
          if (importedData.mockExamScores)
            localStorage.setItem("nea-tracker-mock-exam-scores", JSON.stringify(importedData.mockExamScores))

          toast({
            title: "Gradebook imported",
            description: "Your gradebook has been imported successfully. Reloading page to apply changes.",
          })

          // Reload the page to reflect changes
          setTimeout(() => window.location.reload(), 1500)
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

  // Toggle Google Drive integration
  const handleToggleGDrive = (enabled) => {
    setIsGDriveEnabled(enabled)
    localStorage.setItem("nea-tracker-gdrive-enabled", enabled.toString())

    if (enabled && !isGDriveAuthenticated) {
      toast({
        title: "Google Drive integration enabled",
        description: "Please authenticate to use Google Drive features.",
      })
    }
  }

  // Authenticate with Google Drive (simulated)
  const handleAuthenticateGDrive = () => {
    setIsAuthenticating(true)

    // Simulate authentication process
    setTimeout(() => {
      setIsGDriveAuthenticated(true)
      localStorage.setItem("nea-tracker-gdrive-auth", "true")
      setIsAuthenticating(false)

      toast({
        title: "Authentication successful",
        description: "Your account is now connected to Google Drive.",
      })
    }, 2000)
  }

  // Disconnect from Google Drive
  const handleDisconnectGDrive = () => {
    setIsGDriveAuthenticated(false)
    localStorage.setItem("nea-tracker-gdrive-auth", "false")

    toast({
      title: "Disconnected",
      description: "Your account has been disconnected from Google Drive.",
    })
  }

  // Save to Google Drive (simulated)
  const handleSaveToGDrive = (classData) => {
    toast({
      title: "Saving to Google Drive",
      description: "Uploading class data...",
    })

    // Simulate upload process
    setTimeout(() => {
      toast({
        title: "Saved to Google Drive",
        description: `"${classData.name}" has been saved to Google Drive.`,
      })
    }, 1500)
  }

  // Load from Google Drive (simulated)
  const handleLoadFromGDrive = () => {
    toast({
      title: "Loading from Google Drive",
      description: "Fetching available classes...",
    })

    // Simulate loading process
    setTimeout(() => {
      // For demo purposes, we'll just show the local saved classes
      setActiveTab("manage")

      toast({
        title: "Classes loaded",
        description: "Your classes have been loaded from Google Drive.",
      })
    }, 1500)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Database className="mr-2 h-4 w-4" />
            Class Manager
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setActiveTab("save")
              setIsDialogOpen(true)
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Current Class
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setActiveTab("load")
              setIsDialogOpen(true)
            }}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            Load Class
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setActiveTab("manage")
              setIsDialogOpen(true)
            }}
          >
            <Database className="mr-2 h-4 w-4" />
            Manage Classes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportGradebook}>
            <Download className="mr-2 h-4 w-4" />
            Export Gradebook to USB
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.accept = ".neagb,.json"
              input.onchange = handleImportGradebook
              input.click()
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Gradebook from USB
          </DropdownMenuItem>
          {isGDriveEnabled && isGDriveAuthenticated && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  const currentStudentsData = localStorage.getItem("nea-tracker-students")
                  if (currentStudentsData) {
                    handleSaveToGDrive({
                      name: "Current Class",
                      data: currentStudentsData,
                    })
                  } else {
                    toast({
                      title: "Error",
                      description: "No student data found to save",
                      variant: "destructive",
                    })
                  }
                }}
              >
                <CloudUpload className="mr-2 h-4 w-4" />
                Save to Google Drive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLoadFromGDrive}>
                <CloudDownload className="mr-2 h-4 w-4" />
                Load from Google Drive
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={() => {
              setActiveTab("settings")
              setIsDialogOpen(true)
            }}
          >
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Class Manager</DialogTitle>
            <DialogDescription>Save, load, and manage your classes</DialogDescription>
          </DialogHeader>

          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 ${activeTab === "save" ? "border-b-2 border-primary font-medium" : ""}`}
              onClick={() => setActiveTab("save")}
            >
              Save Class
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "load" ? "border-b-2 border-primary font-medium" : ""}`}
              onClick={() => setActiveTab("load")}
            >
              Load Class
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "manage" ? "border-b-2 border-primary font-medium" : ""}`}
              onClick={() => setActiveTab("manage")}
            >
              Manage Classes
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "settings" ? "border-b-2 border-primary font-medium" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          {activeTab === "save" && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="class-name">Class Name</Label>
                <Input
                  id="class-name"
                  placeholder="e.g., Year 11 Computer Science 2023"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-description">Description (Optional)</Label>
                <Textarea
                  id="class-description"
                  placeholder="Add notes about this class..."
                  value={classDescription}
                  onChange={(e) => setClassDescription(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveClass}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Class
                </Button>
              </DialogFooter>
            </div>
          )}

          {activeTab === "load" && (
            <div className="space-y-4 py-2">
              {savedClasses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No saved classes found.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("save")}>
                    Create Your First Class
                  </Button>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Class Name</TableHead>
                          <TableHead>Date Saved</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedClasses.map((classItem) => (
                          <TableRow key={classItem.id}>
                            <TableCell className="font-medium">{classItem.name}</TableCell>
                            <TableCell>{new Date(classItem.date).toLocaleDateString()}</TableCell>
                            <TableCell>{classItem.studentCount}</TableCell>
                            <TableCell>
                              <Button size="sm" onClick={() => handleLoadClass(classItem)}>
                                Load
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          )}

          {activeTab === "manage" && (
            <div className="space-y-4 py-2">
              {savedClasses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No saved classes found.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("save")}>
                    Create Your First Class
                  </Button>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Class Name</TableHead>
                          <TableHead>Date Saved</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedClasses.map((classItem) => (
                          <TableRow key={classItem.id}>
                            <TableCell className="font-medium">
                              {classItem.name}
                              {classItem.description && (
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {classItem.description}
                                </p>
                              )}
                            </TableCell>
                            <TableCell>{new Date(classItem.date).toLocaleDateString()}</TableCell>
                            <TableCell>{classItem.studentCount}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => handleLoadClass(classItem)}>
                                  <FolderOpen className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleExportClass(classItem)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteClass(classItem.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <Label htmlFor="import-class" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <Upload className="h-4 w-4" />
                          Import Class
                        </div>
                      </Label>
                      <input
                        id="import-class"
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportClass}
                      />
                    </div>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Close
                    </Button>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">Gradebook Export/Import</h3>
                    <div className="flex flex-col gap-2">
                      <Button onClick={handleExportGradebook} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Export Complete Gradebook
                      </Button>
                      <div>
                        <Label htmlFor="import-gradebook" className="cursor-pointer">
                          <div className="flex items-center justify-center gap-2 text-sm border rounded-md p-2 hover:bg-muted">
                            <Upload className="h-4 w-4" />
                            Import Gradebook
                          </div>
                        </Label>
                        <input
                          id="import-gradebook"
                          type="file"
                          accept=".neagb,.json"
                          className="hidden"
                          onChange={handleImportGradebook}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        The gradebook file contains all your data including students, scores, and settings. Perfect for
                        transferring to another computer or backing up to a USB drive.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6 py-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Google Drive Integration</CardTitle>
                  <CardDescription>Save and load your classes from Google Drive</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Google Drive</Label>
                      <p className="text-sm text-muted-foreground">Sync your classes with Google Drive</p>
                    </div>
                    <Switch checked={isGDriveEnabled} onCheckedChange={handleToggleGDrive} />
                  </div>
                </CardContent>
                {isGDriveEnabled && (
                  <CardFooter className="flex flex-col items-start gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${isGDriveAuthenticated ? "bg-green-500" : "bg-amber-500"}`}
                      />
                      <span className="text-sm">
                        {isGDriveAuthenticated ? "Connected to Google Drive" : "Not connected"}
                      </span>
                    </div>
                    {!isGDriveAuthenticated ? (
                      <Button onClick={handleAuthenticateGDrive} disabled={isAuthenticating}>
                        {isAuthenticating ? (
                          <>Authenticating...</>
                        ) : (
                          <>
                            <CloudUpload className="mr-2 h-4 w-4" />
                            Connect to Google Drive
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleDisconnectGDrive}>
                          Disconnect
                        </Button>
                        <Button
                          onClick={() => {
                            const currentStudentsData = localStorage.getItem("nea-tracker-students")
                            if (currentStudentsData) {
                              handleSaveToGDrive({
                                name: "Current Class",
                                data: currentStudentsData,
                              })
                            } else {
                              toast({
                                title: "Error",
                                description: "No student data found to save",
                                variant: "destructive",
                              })
                            }
                          }}
                        >
                          <CloudUpload className="mr-2 h-4 w-4" />
                          Save Current Class
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                )}
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Manage your local data storage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Saved Classes</p>
                      <p className="text-sm text-muted-foreground">{savedClasses.length} classes saved</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to export all classes? This will download a JSON file with all your class data.",
                          )
                        ) {
                          const dataStr = JSON.stringify(savedClasses)
                          const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

                          const exportFileDefaultName = `nea-tracker-all-classes-${new Date().toISOString().split("T")[0]}.json`

                          const linkElement = document.createElement("a")
                          linkElement.setAttribute("href", dataUri)
                          linkElement.setAttribute("download", exportFileDefaultName)
                          linkElement.click()
                        }
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export All Classes
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Clear All Data</p>
                      <p className="text-sm text-muted-foreground">Remove all saved classes</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete ALL saved classes? This action cannot be undone.")
                        ) {
                          setSavedClasses([])
                          localStorage.setItem("nea-tracker-saved-classes", JSON.stringify([]))
                          toast({
                            title: "Data cleared",
                            description: "All saved classes have been deleted.",
                          })
                        }
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
