"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Filter, Printer, Search, MessageSquare } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function StudentLogPage() {
  const { toast } = useToast()
  const [students, setStudents] = useState([])
  const [logEntries, setLogEntries] = useState([])
  const [activeTab, setActiveTab] = useState("view")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSection, setSelectedSection] = useState("")
  const [notes, setNotes] = useState("")
  const [actions, setActions] = useState("")
  const [targets, setTargets] = useState("")
  const [targetStatus, setTargetStatus] = useState("not-started")
  const [filterStudent, setFilterStudent] = useState("")
  const [filterSection, setFilterSection] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentEditId, setCurrentEditId] = useState(null)

  // NEA sections
  const neaSections = [
    { id: "section-a", name: "Section A: Identifying & Investigating Design Possibilities" },
    { id: "section-b", name: "Section B: Producing a Design Brief & Specification" },
    { id: "section-c", name: "Section C: Generating Design Ideas" },
    { id: "section-d", name: "Section D: Developing Design Ideas" },
    { id: "section-e", name: "Section E: Realising Design Ideas" },
    { id: "section-f", name: "Section F: Analysing & Evaluating" },
    { id: "general", name: "General Discussion" },
  ]

  // Target status options
  const targetStatusOptions = [
    { id: "not-started", name: "Not Started", color: "bg-red-500" },
    { id: "in-progress", name: "In Progress", color: "bg-yellow-500" },
    { id: "completed", name: "Completed", color: "bg-green-500" },
  ]

  // Load students and log entries from localStorage
  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem("students")
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents))
      }

      const storedLogEntries = localStorage.getItem("studentLogEntries")
      if (storedLogEntries) {
        setLogEntries(JSON.parse(storedLogEntries))
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load data from storage",
        variant: "destructive",
      })
    }
  }, [toast])

  // Save log entries to localStorage
  const saveLogEntries = (entries) => {
    try {
      localStorage.setItem("studentLogEntries", JSON.stringify(entries))
      setLogEntries(entries)
    } catch (error) {
      console.error("Error saving log entries:", error)
      toast({
        title: "Error",
        description: "Failed to save log entries",
        variant: "destructive",
      })
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive",
      })
      return
    }

    if (!selectedSection) {
      toast({
        title: "Error",
        description: "Please select an NEA section",
        variant: "destructive",
      })
      return
    }

    if (!notes) {
      toast({
        title: "Error",
        description: "Please enter discussion notes",
        variant: "destructive",
      })
      return
    }

    // Find student details
    const student = students.find((s) => s.id === selectedStudent)
    if (!student) {
      toast({
        title: "Error",
        description: "Selected student not found",
        variant: "destructive",
      })
      return
    }

    // Create new log entry or update existing one
    const newEntry = {
      id: isEditMode ? currentEditId : `log-${Date.now()}`,
      studentId: selectedStudent,
      studentName: student.name,
      studentClass: student.class,
      date: selectedDate.toISOString(),
      section: selectedSection,
      notes,
      actions,
      targets,
      targetStatus,
      createdAt: isEditMode ? logEntries.find((e) => e.id === currentEditId).createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    let updatedEntries
    if (isEditMode) {
      updatedEntries = logEntries.map((entry) => (entry.id === currentEditId ? newEntry : entry))
      toast({
        title: "Success",
        description: "Log entry updated successfully",
      })
    } else {
      updatedEntries = [...logEntries, newEntry]
      toast({
        title: "Success",
        description: "New log entry added successfully",
      })
    }

    saveLogEntries(updatedEntries)
    resetForm()
    setActiveTab("view")
  }

  // Reset form fields
  const resetForm = () => {
    setSelectedStudent("")
    setSelectedDate(new Date())
    setSelectedSection("")
    setNotes("")
    setActions("")
    setTargets("")
    setTargetStatus("not-started")
    setIsEditMode(false)
    setCurrentEditId(null)
  }

  // Edit log entry
  const handleEdit = (entry) => {
    setSelectedStudent(entry.studentId)
    setSelectedDate(new Date(entry.date))
    setSelectedSection(entry.section)
    setNotes(entry.notes)
    setActions(entry.actions)
    setTargets(entry.targets)
    setTargetStatus(entry.targetStatus)
    setIsEditMode(true)
    setCurrentEditId(entry.id)
    setActiveTab("add")
  }

  // Delete log entry
  const handleDelete = (id) => {
    const updatedEntries = logEntries.filter((entry) => entry.id !== id)
    saveLogEntries(updatedEntries)
    toast({
      title: "Success",
      description: "Log entry deleted successfully",
    })
  }

  // Update target status
  const handleUpdateStatus = (id, newStatus) => {
    const updatedEntries = logEntries.map((entry) => {
      if (entry.id === id) {
        return {
          ...entry,
          targetStatus: newStatus,
          updatedAt: new Date().toISOString(),
        }
      }
      return entry
    })
    saveLogEntries(updatedEntries)
    toast({
      title: "Success",
      description: "Target status updated successfully",
    })
  }

  // Filter log entries
  const filteredEntries = logEntries.filter((entry) => {
    const matchesStudent = filterStudent ? entry.studentId === filterStudent : true
    const matchesSection = filterSection ? entry.section === filterSection : true
    const matchesStatus = filterStatus ? entry.targetStatus === filterStatus : true
    const matchesSearch = searchQuery
      ? entry.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.actions.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.targets.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    return matchesStudent && matchesSection && matchesStatus && matchesSearch
  })

  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Print log entries
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")

    printWindow.document.write(`
      <html>
        <head>
          <title>Student Log Entries</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .entry { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .header { display: flex; justify-content: space-between; }
            .status-completed { color: green; font-weight: bold; }
            .status-in-progress { color: orange; font-weight: bold; }
            .status-not-started { color: red; font-weight: bold; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Student Log Entries</h1>
          <p>Generated on ${format(new Date(), "PPP")}</p>
          <button onclick="window.print()">Print Report</button>
          <div>
    `)

    sortedEntries.forEach((entry) => {
      const section = neaSections.find((s) => s.id === entry.section)?.name || entry.section
      const statusClass =
        entry.targetStatus === "completed"
          ? "status-completed"
          : entry.targetStatus === "in-progress"
            ? "status-in-progress"
            : "status-not-started"
      const statusText =
        entry.targetStatus === "completed"
          ? "Completed"
          : entry.targetStatus === "in-progress"
            ? "In Progress"
            : "Not Started"

      printWindow.document.write(`
        <div class="entry">
          <div class="header">
            <h2>${entry.studentName} (${entry.studentClass})</h2>
            <h3>Date: ${format(new Date(entry.date), "PPP")}</h3>
          </div>
          <p><strong>NEA Section:</strong> ${section}</p>
          <p><strong>Discussion Notes:</strong></p>
          <p>${entry.notes.replace(/\n/g, "<br>")}</p>
          ${
            entry.actions
              ? `
            <p><strong>Actions Taken:</strong></p>
            <p>${entry.actions.replace(/\n/g, "<br>")}</p>
          `
              : ""
          }
          ${
            entry.targets
              ? `
            <p><strong>Targets Set:</strong></p>
            <p>${entry.targets.replace(/\n/g, "<br>")}</p>
            <p><strong>Target Status:</strong> <span class="${statusClass}">${statusText}</span></p>
          `
              : ""
          }
        </div>
      `)
    })

    printWindow.document.write(`
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Student Log</h1>
      <p className="text-muted-foreground mb-6">
        Track and document discussions with students about their NEA work, set targets, and monitor progress.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View Log Entries</TabsTrigger>
          <TabsTrigger value="add">{isEditMode ? "Edit Log Entry" : "Add New Log Entry"}</TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Log Entries</CardTitle>
              <CardDescription>View and manage all discussions with students about their NEA work.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search log entries..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <h4 className="font-medium">Filter Log Entries</h4>
                        <div className="space-y-2">
                          <Label htmlFor="filter-student">Student</Label>
                          <Select value={filterStudent} onValueChange={setFilterStudent}>
                            <SelectTrigger id="filter-student">
                              <SelectValue placeholder="All students" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All students</SelectItem>
                              {students.map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name} ({student.class})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="filter-section">NEA Section</Label>
                          <Select value={filterSection} onValueChange={setFilterSection}>
                            <SelectTrigger id="filter-section">
                              <SelectValue placeholder="All sections" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All sections</SelectItem>
                              {neaSections.map((section) => (
                                <SelectItem key={section.id} value={section.id}>
                                  {section.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="filter-status">Target Status</Label>
                          <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger id="filter-status">
                              <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All statuses</SelectItem>
                              {targetStatusOptions.map((status) => (
                                <SelectItem key={status.id} value={status.id}>
                                  {status.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setFilterStudent("")
                            setFilterSection("")
                            setFilterStatus("")
                            setSearchQuery("")
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
              </div>

              {sortedEntries.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>NEA Section</TableHead>
                        <TableHead>Target Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedEntries.map((entry) => {
                        const section = neaSections.find((s) => s.id === entry.section)
                        const status = targetStatusOptions.find((s) => s.id === entry.targetStatus)

                        return (
                          <TableRow key={entry.id}>
                            <TableCell>{format(new Date(entry.date), "PP")}</TableCell>
                            <TableCell>
                              <div className="font-medium">{entry.studentName}</div>
                              <div className="text-sm text-muted-foreground">{entry.studentClass}</div>
                            </TableCell>
                            <TableCell>{section ? section.name.split(":")[0] : entry.section}</TableCell>
                            <TableCell>
                              {status && (
                                <Badge variant="outline" className={`${status.color} text-white`}>
                                  {status.name}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Log Entry Details</DialogTitle>
                                    <DialogDescription>
                                      Viewing log entry for {entry.studentName} on {format(new Date(entry.date), "PPP")}
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label className="text-right">Student</Label>
                                      <div className="col-span-3">
                                        <p className="font-medium">{entry.studentName}</p>
                                        <p className="text-sm text-muted-foreground">{entry.studentClass}</p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label className="text-right">Date</Label>
                                      <div className="col-span-3">{format(new Date(entry.date), "PPP")}</div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label className="text-right">NEA Section</Label>
                                      <div className="col-span-3">{section ? section.name : entry.section}</div>
                                    </div>

                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <Label className="text-right pt-2">Discussion Notes</Label>
                                      <div className="col-span-3 whitespace-pre-line border p-3 rounded-md bg-muted/50">
                                        {entry.notes}
                                      </div>
                                    </div>

                                    {entry.actions && (
                                      <div className="grid grid-cols-4 items-start gap-4">
                                        <Label className="text-right pt-2">Actions Taken</Label>
                                        <div className="col-span-3 whitespace-pre-line border p-3 rounded-md bg-muted/50">
                                          {entry.actions}
                                        </div>
                                      </div>
                                    )}

                                    {entry.targets && (
                                      <>
                                        <div className="grid grid-cols-4 items-start gap-4">
                                          <Label className="text-right pt-2">Targets Set</Label>
                                          <div className="col-span-3 whitespace-pre-line border p-3 rounded-md bg-muted/50">
                                            {entry.targets}
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <Label className="text-right">Target Status</Label>
                                          <div className="col-span-3">
                                            <Select
                                              value={entry.targetStatus}
                                              onValueChange={(value) => handleUpdateStatus(entry.id, value)}
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {targetStatusOptions.map((status) => (
                                                  <SelectItem key={status.id} value={status.id}>
                                                    {status.name}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      </>
                                    )}

                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label className="text-right">Last Updated</Label>
                                      <div className="col-span-3 text-sm text-muted-foreground">
                                        {format(new Date(entry.updatedAt), "PPP p")}
                                      </div>
                                    </div>
                                  </div>

                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => handleEdit(entry)}>
                                      Edit Entry
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    ...
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleEdit(entry)}>Edit</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      if (confirm("Are you sure you want to delete this log entry?")) {
                                        handleDelete(entry.id)
                                      }
                                    }}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium">No log entries found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    {searchQuery || filterStudent || filterSection || filterStatus
                      ? "No entries match your current filters. Try adjusting your search or filters."
                      : "Start by adding your first student log entry."}
                  </p>
                  {searchQuery || filterStudent || filterSection || filterStatus ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterStudent("")
                        setFilterSection("")
                        setFilterStatus("")
                        setSearchQuery("")
                      }}
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Button onClick={() => setActiveTab("add")}>Add Log Entry</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{isEditMode ? "Edit Log Entry" : "Add New Log Entry"}</CardTitle>
              <CardDescription>
                {isEditMode
                  ? "Update the details of an existing log entry."
                  : "Record a new discussion with a student about their NEA work."}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Student</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent} required>
                      <SelectTrigger id="student">
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.length > 0 ? (
                          students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} ({student.class})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-students" disabled>
                            No students available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {students.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-1">Add students in the Students tab first.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date of Discussion</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => setSelectedDate(date || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">NEA Section</Label>
                  <Select value={selectedSection} onValueChange={setSelectedSection} required>
                    <SelectTrigger id="section">
                      <SelectValue placeholder="Select an NEA section" />
                    </SelectTrigger>
                    <SelectContent>
                      {neaSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Discussion Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter detailed notes about the discussion..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actions">Actions Taken</Label>
                  <Textarea
                    id="actions"
                    placeholder="What actions were taken during this discussion? (optional)"
                    value={actions}
                    onChange={(e) => setActions(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targets">Targets Set</Label>
                  <Textarea
                    id="targets"
                    placeholder="What targets were set for the student? (optional)"
                    value={targets}
                    onChange={(e) => setTargets(e.target.value)}
                    rows={3}
                  />
                </div>

                {targets && (
                  <div className="space-y-2">
                    <Label htmlFor="target-status">Target Status</Label>
                    <Select value={targetStatus} onValueChange={setTargetStatus}>
                      <SelectTrigger id="target-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {targetStatusOptions.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    if (isEditMode) {
                      setActiveTab("view")
                    }
                  }}
                >
                  {isEditMode ? "Cancel" : "Reset"}
                </Button>
                <Button type="submit">{isEditMode ? "Update Log Entry" : "Add Log Entry"}</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
