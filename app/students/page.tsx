"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Pencil, Trash2, Plus, UserPlus, Filter, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { StudentAvatar } from "../components/avatar-generator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Student {
  id: string
  name: string
  email?: string
  phone?: string
  class?: string
  targetGrade?: string
  regGroup?: string
  sex?: string
  fsm?: string
  examNo?: string
  senStatus?: string
  ks4Target?: string
  readingAge?: string
  priorAttainment?: string
  pupilPremium?: string
  surname?: string
  forename?: string
}

interface FilterState {
  targetGrade: string
  senStatus: string
  priorAttainment: string
  fsm: string
  pupilPremium: string
  readingAge: string
  sex: string
  class: string
  search: string
}

export default function Students() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    class: "",
    targetGrade: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    targetGrade: "",
    senStatus: "",
    priorAttainment: "",
    fsm: "",
    pupilPremium: "",
    readingAge: "",
    sex: "",
    class: "",
    search: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  // Load students from localStorage
  useEffect(() => {
    const loadStudents = () => {
      try {
        // Load from the correct localStorage key
        const importedStudents = localStorage.getItem("nea-tracker-students")
        if (importedStudents) {
          const parsed = JSON.parse(importedStudents)
          setStudents(parsed)
          setFilteredStudents(parsed)
          return
        }

        // Fallback to manual students
        const manualStudents = localStorage.getItem("students")
        if (manualStudents) {
          const parsed = JSON.parse(manualStudents)
          setStudents(parsed)
          setFilteredStudents(parsed)
        }
      } catch (error) {
        console.error("Error loading students:", error)
        setStudents([])
        setFilteredStudents([])
      }
    }

    loadStudents()
  }, [])

  // Apply filters whenever filters or students change
  useEffect(() => {
    let filtered = [...students]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          (student.examNo && student.examNo.toLowerCase().includes(filters.search.toLowerCase())) ||
          (student.regGroup && student.regGroup.toLowerCase().includes(filters.search.toLowerCase())),
      )
    }

    // Target grade filter
    if (filters.targetGrade) {
      if (filters.targetGrade === "high") {
        filtered = filtered.filter((student) => {
          const target = Number.parseInt(student.ks4Target || student.targetGrade || "0")
          return target >= 7
        })
      } else if (filters.targetGrade === "medium") {
        filtered = filtered.filter((student) => {
          const target = Number.parseInt(student.ks4Target || student.targetGrade || "0")
          return target >= 5 && target < 7
        })
      } else if (filters.targetGrade === "low") {
        filtered = filtered.filter((student) => {
          const target = Number.parseInt(student.ks4Target || student.targetGrade || "0")
          return target < 5 && target > 0
        })
      } else if (filters.targetGrade === "none") {
        filtered = filtered.filter((student) => !student.ks4Target && !student.targetGrade)
      }
    }

    // SEN status filter
    if (filters.senStatus) {
      if (filters.senStatus === "sen") {
        filtered = filtered.filter(
          (student) => student.senStatus && student.senStatus !== "" && student.senStatus !== "N",
        )
      } else if (filters.senStatus === "no-sen") {
        filtered = filtered.filter(
          (student) => !student.senStatus || student.senStatus === "" || student.senStatus === "N",
        )
      }
    }

    // Prior attainment filter
    if (filters.priorAttainment) {
      filtered = filtered.filter((student) => student.priorAttainment === filters.priorAttainment)
    }

    // FSM filter
    if (filters.fsm) {
      if (filters.fsm === "eligible") {
        filtered = filtered.filter((student) => student.fsm === "Y")
      } else if (filters.fsm === "not-eligible") {
        filtered = filtered.filter((student) => student.fsm !== "Y")
      }
    }

    // Pupil Premium filter
    if (filters.pupilPremium) {
      if (filters.pupilPremium === "eligible") {
        filtered = filtered.filter((student) => student.pupilPremium === "Y")
      } else if (filters.pupilPremium === "not-eligible") {
        filtered = filtered.filter((student) => student.pupilPremium !== "Y")
      }
    }

    // Sex filter
    if (filters.sex) {
      filtered = filtered.filter((student) => student.sex === filters.sex)
    }

    // Class filter
    if (filters.class) {
      filtered = filtered.filter(
        (student) =>
          (student.class && student.class.includes(filters.class)) ||
          (student.regGroup && student.regGroup.includes(filters.class)),
      )
    }

    // Reading age filter
    if (filters.readingAge) {
      if (filters.readingAge === "above") {
        filtered = filtered.filter((student) => {
          if (!student.readingAge) return false
          // Simple check - if reading age contains higher numbers, assume above chronological
          return (
            student.readingAge.includes("1") && (student.readingAge.includes("2") || student.readingAge.includes("3"))
          )
        })
      } else if (filters.readingAge === "below") {
        filtered = filtered.filter((student) => {
          if (!student.readingAge) return false
          // Simple check for lower reading ages
          return !student.readingAge.includes("1") || student.readingAge.includes("0")
        })
      } else if (filters.readingAge === "concern") {
        filtered = filtered.filter((student) => {
          if (!student.readingAge) return false
          // Check for significantly low reading ages
          return student.readingAge.includes("8") || student.readingAge.includes("9")
        })
      } else if (filters.readingAge === "no-data") {
        filtered = filtered.filter((student) => !student.readingAge || student.readingAge === "")
      }
    }

    setFilteredStudents(filtered)
  }, [filters, students])

  // Save students to localStorage
  const saveStudents = (updatedStudents: Student[]) => {
    try {
      localStorage.setItem("nea-tracker-students", JSON.stringify(updatedStudents))
      localStorage.setItem("nea-tracker-last-modified", new Date().toISOString())
    } catch (error) {
      console.error("Error saving students:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      class: "",
      targetGrade: "",
    })
    setIsEditing(false)
    setEditingStudentId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: "Error",
        description: "Student name is required",
        variant: "destructive",
      })
      return
    }

    let updatedStudents: Student[]

    if (isEditing && editingStudentId) {
      updatedStudents = students.map((student) => {
        if (student.id === editingStudentId) {
          return { ...student, ...formData }
        }
        return student
      })

      toast({
        title: "Success",
        description: "Student updated successfully",
      })
    } else {
      const newStudent: Student = {
        id: uuidv4(),
        ...formData,
      }

      updatedStudents = [...students, newStudent]

      toast({
        title: "Success",
        description: "Student added successfully",
      })
    }

    setStudents(updatedStudents)
    saveStudents(updatedStudents)
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDeleteStudent = (id: string) => {
    const updatedStudents = students.filter((student) => student.id !== id)
    setStudents(updatedStudents)
    saveStudents(updatedStudents)

    toast({
      title: "Success",
      description: "Student deleted successfully",
    })
  }

  const editStudent = (student: Student) => {
    setIsEditing(true)
    setEditingStudentId(student.id)
    setFormData({
      name: student.name,
      email: student.email || "",
      phone: student.phone || "",
      class: student.class || student.regGroup || "",
      targetGrade: student.targetGrade || student.ks4Target || "",
    })
    setIsDialogOpen(true)
  }

  const clearAllFilters = () => {
    setFilters({
      targetGrade: "",
      senStatus: "",
      priorAttainment: "",
      fsm: "",
      pupilPremium: "",
      readingAge: "",
      sex: "",
      class: "",
      search: "",
    })
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value !== "").length
  }

  const getPriorAttainmentVariant = (attainment: string) => {
    switch (attainment) {
      case "HPA":
        return "bg-green-100 text-green-800"
      case "MPA":
        return "bg-yellow-100 text-yellow-800"
      case "LPA":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage your student records ({filteredStudents.length} of {students.length} students)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Student" : "Add New Student"}</DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the student's information below."
                    : "Enter the student's details to add them to your records."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Input id="class" name="class" value={formData.class} onChange={handleChange} placeholder="11A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetGrade">Target Grade</Label>
                    <Input
                      id="targetGrade"
                      name="targetGrade"
                      value={formData.targetGrade}
                      onChange={handleChange}
                      placeholder="7"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setIsDialogOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{isEditing ? "Update Student" : "Add Student"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filter Students</CardTitle>
              <div className="flex gap-2">
                {getActiveFilterCount() > 0 && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Name, exam number, reg group..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Target Grade</Label>
                <Select
                  value={filters.targetGrade}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, targetGrade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All targets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All targets</SelectItem>
                    <SelectItem value="high">High (7-9)</SelectItem>
                    <SelectItem value="medium">Medium (5-6)</SelectItem>
                    <SelectItem value="low">Low (1-4)</SelectItem>
                    <SelectItem value="none">No target set</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>SEN Status</Label>
                <Select
                  value={filters.senStatus}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, senStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All students</SelectItem>
                    <SelectItem value="sen">SEN students</SelectItem>
                    <SelectItem value="no-sen">No SEN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prior Attainment</Label>
                <Select
                  value={filters.priorAttainment}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, priorAttainment: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    <SelectItem value="HPA">High Prior Attainment</SelectItem>
                    <SelectItem value="MPA">Middle Prior Attainment</SelectItem>
                    <SelectItem value="LPA">Low Prior Attainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>FSM Status</Label>
                <Select value={filters.fsm} onValueChange={(value) => setFilters((prev) => ({ ...prev, fsm: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All students</SelectItem>
                    <SelectItem value="eligible">FSM Eligible</SelectItem>
                    <SelectItem value="not-eligible">Not FSM Eligible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pupil Premium</Label>
                <Select
                  value={filters.pupilPremium}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, pupilPremium: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All students</SelectItem>
                    <SelectItem value="eligible">Pupil Premium</SelectItem>
                    <SelectItem value="not-eligible">Not Pupil Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={filters.sex} onValueChange={(value) => setFilters((prev) => ({ ...prev, sex: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All genders</SelectItem>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reading Age</Label>
                <Select
                  value={filters.readingAge}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, readingAge: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    <SelectItem value="above">Above chronological</SelectItem>
                    <SelectItem value="below">Below chronological</SelectItem>
                    <SelectItem value="concern">Significant concern</SelectItem>
                    <SelectItem value="no-data">No data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            {getActiveFilterCount() > 0
              ? `Showing ${filteredStudents.length} of ${students.length} students (${getActiveFilterCount()} filter${getActiveFilterCount() > 1 ? "s" : ""} applied)`
              : `You have ${students.length} students in your records.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Target Grade</TableHead>
                    <TableHead>Prior Attainment</TableHead>
                    <TableHead>Reading Age</TableHead>
                    <TableHead>SEN</TableHead>
                    <TableHead>FSM</TableHead>
                    <TableHead>PP</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <StudentAvatar name={student.name} size="sm" />
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class || student.regGroup || "-"}</TableCell>
                        <TableCell>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              student.targetGrade || student.ks4Target
                                ? Number.parseInt(student.targetGrade || student.ks4Target || "0") >= 7
                                  ? "bg-green-500"
                                  : Number.parseInt(student.targetGrade || student.ks4Target || "0") >= 5
                                    ? "bg-yellow-500"
                                    : Number.parseInt(student.targetGrade || student.ks4Target || "0") >= 4
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                                : "bg-gray-400"
                            }`}
                          >
                            {student.targetGrade || student.ks4Target || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.priorAttainment ? (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorAttainmentVariant(student.priorAttainment)}`}
                            >
                              {student.priorAttainment}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{student.readingAge || "-"}</span>
                        </TableCell>
                        <TableCell>
                          {student.senStatus && student.senStatus !== "" && student.senStatus !== "N" ? (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {student.senStatus}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {student.fsm === "Y" ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              FSM
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {student.pupilPremium === "Y" ? (
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                              PP
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => editStudent(student)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : students.length > 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3">
                <Filter className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No students match your filters</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                Try adjusting your filter criteria to see more students.
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3">
                <UserPlus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No students yet</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                Import your student data using the Data Import page, or add your first student manually.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student Manually
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/data-import")}>
                  Import Student Data
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
