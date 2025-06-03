"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { neaSections } from "../data"
import { Plus, Save, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

type ModerationStudent = {
  id: string
  name: string
  class: string
}

type ModerationMark = {
  studentId: string
  sectionId: string
  mark: number
  notes: string
}

export default function ModerationPage() {
  const { toast } = useToast()
  const [students, setStudents] = useState<ModerationStudent[]>([])
  const [marks, setMarks] = useState<ModerationMark[]>([])
  const [newStudent, setNewStudent] = useState<ModerationStudent>({
    id: "",
    name: "",
    class: "",
  })
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("students")

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem("nea-moderation-students")
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents))
      }

      const storedMarks = localStorage.getItem("nea-moderation-marks")
      if (storedMarks) {
        setMarks(JSON.parse(storedMarks))
      }
    } catch (error) {
      console.error("Error loading moderation data:", error)
      toast({
        title: "Error",
        description: "Failed to load moderation data",
        variant: "destructive",
      })
    }
  }, [toast])

  // Save students to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("nea-moderation-students", JSON.stringify(students))
    } catch (error) {
      console.error("Error saving moderation students:", error)
    }
  }, [students])

  // Save marks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("nea-moderation-marks", JSON.stringify(marks))
    } catch (error) {
      console.error("Error saving moderation marks:", error)
    }
  }, [marks])

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.class) {
      toast({
        title: "Missing information",
        description: "Please enter a name and class for the student",
        variant: "destructive",
      })
      return
    }

    // Student limit removed - can add any number of students now

    const id = `mod-${Date.now()}`
    const student = { ...newStudent, id }

    setStudents([...students, student])
    setNewStudent({ id: "", name: "", class: "" })

    toast({
      title: "Student added",
      description: "Student has been added for moderation",
    })
  }

  const handleRemoveStudent = (id: string) => {
    // Remove student
    setStudents(students.filter((student) => student.id !== id))

    // Remove all marks for this student
    setMarks(marks.filter((mark) => mark.studentId !== id))

    // If this was the selected student, clear selection
    if (selectedStudent === id) {
      setSelectedStudent(null)
    }

    toast({
      title: "Student removed",
      description: "Student and all associated marks have been removed",
    })
  }

  const handleMarkChange = (studentId: string, sectionId: string, value: number) => {
    const existingMarkIndex = marks.findIndex((mark) => mark.studentId === studentId && mark.sectionId === sectionId)

    const section = neaSections.find((section) => section.id === sectionId)
    if (!section) return

    // Validate mark is within range
    if (value < 0) value = 0
    if (value > section.maxMarks) value = section.maxMarks

    if (existingMarkIndex >= 0) {
      // Update existing mark
      const updatedMarks = [...marks]
      updatedMarks[existingMarkIndex] = {
        ...updatedMarks[existingMarkIndex],
        mark: value,
      }
      setMarks(updatedMarks)
    } else {
      // Add new mark
      setMarks([
        ...marks,
        {
          studentId,
          sectionId,
          mark: value,
          notes: "",
        },
      ])
    }
  }

  const handleNotesChange = (studentId: string, sectionId: string, notes: string) => {
    const existingMarkIndex = marks.findIndex((mark) => mark.studentId === studentId && mark.sectionId === sectionId)

    if (existingMarkIndex >= 0) {
      // Update existing mark notes
      const updatedMarks = [...marks]
      updatedMarks[existingMarkIndex] = {
        ...updatedMarks[existingMarkIndex],
        notes,
      }
      setMarks(updatedMarks)
    } else {
      // Add new mark with notes
      setMarks([
        ...marks,
        {
          studentId,
          sectionId,
          mark: 0,
          notes,
        },
      ])
    }
  }

  const getStudentMark = (studentId: string, sectionId: string): number => {
    const mark = marks.find((mark) => mark.studentId === studentId && mark.sectionId === sectionId)
    return mark ? mark.mark : 0
  }

  const getStudentNotes = (studentId: string, sectionId: string): string => {
    const mark = marks.find((mark) => mark.studentId === studentId && mark.sectionId === sectionId)
    return mark ? mark.notes : ""
  }

  const getTotalMarks = (studentId: string): number => {
    return marks.filter((mark) => mark.studentId === studentId).reduce((total, mark) => total + mark.mark, 0)
  }

  const getMaxPossibleMarks = (): number => {
    return neaSections.reduce((total, section) => total + section.maxMarks, 0)
  }

  const getPercentage = (studentId: string): number => {
    const total = getTotalMarks(studentId)
    const max = getMaxPossibleMarks()
    return Math.round((total / max) * 100)
  }

  const getGrade = (percentage: number): string => {
    if (percentage >= 80) return "A*"
    if (percentage >= 70) return "A"
    if (percentage >= 60) return "B"
    if (percentage >= 50) return "C"
    if (percentage >= 40) return "D"
    if (percentage >= 30) return "E"
    return "U"
  }

  const getImprovementSuggestions = (studentId: string): { sectionId: string; suggestion: string }[] => {
    const suggestions: { sectionId: string; suggestion: string }[] = []

    neaSections.forEach((section) => {
      const mark = getStudentMark(studentId, section.id)
      const percentage = (mark / section.maxMarks) * 100

      if (percentage < 40) {
        suggestions.push({
          sectionId: section.id,
          suggestion: `Major improvement needed in ${section.name}. Consider revisiting the core requirements.`,
        })
      } else if (percentage < 60) {
        suggestions.push({
          sectionId: section.id,
          suggestion: `Moderate improvement needed in ${section.name}. Focus on adding more detail and depth.`,
        })
      } else if (percentage < 80) {
        suggestions.push({
          sectionId: section.id,
          suggestion: `Minor improvements in ${section.name} could raise the grade significantly.`,
        })
      }
    })

    return suggestions
  }

  const handleSaveAll = () => {
    try {
      localStorage.setItem("nea-moderation-students", JSON.stringify(students))
      localStorage.setItem("nea-moderation-marks", JSON.stringify(marks))

      toast({
        title: "Moderation saved",
        description: "All moderation data has been saved successfully",
      })
    } catch (error) {
      console.error("Error saving moderation data:", error)
      toast({
        title: "Error",
        description: "Failed to save moderation data",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Cross-Moderation</h1>
      <p className="text-muted-foreground mb-6">
        Use this page to moderate another teacher's students. Add students, enter marks for each NEA section, and add
        notes for your reasoning.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="marking">Marking</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Students</CardTitle>
              <CardDescription>
                Add students for cross-moderation. These students are separate from your main student database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="name">Student Name</Label>
                  <Input
                    id="name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Input
                    id="class"
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                    placeholder="Enter class"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddStudent} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Student
                  </Button>
                </div>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-12 bg-muted p-3 rounded-t-md">
                  <div className="col-span-1 font-medium">#</div>
                  <div className="col-span-5 font-medium">Name</div>
                  <div className="col-span-4 font-medium">Class</div>
                  <div className="col-span-2 font-medium text-right">Actions</div>
                </div>

                {students.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No students added for moderation yet</div>
                ) : (
                  students.map((student, index) => (
                    <div key={student.id} className="grid grid-cols-12 p-3 border-t">
                      <div className="col-span-1">{index + 1}</div>
                      <div className="col-span-5">{student.name}</div>
                      <div className="col-span-4">{student.class}</div>
                      <div className="col-span-2 text-right">
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveStudent(student.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enter Moderation Marks</CardTitle>
              <CardDescription>
                Select a student and enter marks for each NEA section. Add notes to explain your reasoning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center p-6">
                  <p className="text-muted-foreground mb-4">No students added for moderation yet</p>
                  <Button onClick={() => setActiveTab("students")}>Add Students</Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <Label htmlFor="select-student">Select Student</Label>
                    <select
                      id="select-student"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedStudent || ""}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                      <option value="">Select a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.class})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedStudent && (
                    <>
                      <div className="border rounded-md mb-4">
                        <div className="grid grid-cols-12 bg-muted p-3 rounded-t-md">
                          <div className="col-span-5 font-medium">NEA Section</div>
                          <div className="col-span-2 font-medium text-center">Max Marks</div>
                          <div className="col-span-2 font-medium text-center">Mark</div>
                          <div className="col-span-3 font-medium">Notes</div>
                        </div>

                        {neaSections.map((section) => (
                          <div key={section.id} className="grid grid-cols-12 p-3 border-t">
                            <div className="col-span-5">{section.name}</div>
                            <div className="col-span-2 text-center">{section.maxMarks}</div>
                            <div className="col-span-2 text-center">
                              <Input
                                type="number"
                                min={0}
                                max={section.maxMarks}
                                value={getStudentMark(selectedStudent, section.id)}
                                onChange={(e) =>
                                  handleMarkChange(selectedStudent, section.id, Number.parseInt(e.target.value) || 0)
                                }
                                className="text-center"
                              />
                            </div>
                            <div className="col-span-3">
                              <Textarea
                                placeholder="Add notes..."
                                value={getStudentNotes(selectedStudent, section.id)}
                                onChange={(e) => handleNotesChange(selectedStudent, section.id, e.target.value)}
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">Total: </span>
                          {getTotalMarks(selectedStudent)} / {getMaxPossibleMarks()}
                          <span className="ml-2">
                            ({getPercentage(selectedStudent)}% - Grade {getGrade(getPercentage(selectedStudent))})
                          </span>
                        </div>
                        <Button onClick={handleSaveAll}>
                          <Save className="mr-2 h-4 w-4" /> Save All
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Summary</CardTitle>
              <CardDescription>
                Review the progress of all moderated students and see suggestions for improvement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center p-6">
                  <p className="text-muted-foreground mb-4">No students added for moderation yet</p>
                  <Button onClick={() => setActiveTab("students")}>Add Students</Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {students.map((student) => {
                    const percentage = getPercentage(student.id)
                    const grade = getGrade(percentage)
                    const suggestions = getImprovementSuggestions(student.id)

                    return (
                      <div key={student.id} className="border rounded-md p-4">
                        <h3 className="text-xl font-medium mb-2">
                          {student.name} <span className="text-muted-foreground">({student.class})</span>
                        </h3>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="font-medium">
                            {getTotalMarks(student.id)} / {getMaxPossibleMarks()}
                          </div>
                          <Progress value={percentage} className="h-2 flex-1" />
                          <div className="font-medium">
                            {percentage}% - Grade {grade}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {neaSections.map((section) => {
                            const mark = getStudentMark(student.id, section.id)
                            const sectionPercentage = Math.round((mark / section.maxMarks) * 100)

                            return (
                              <div key={section.id} className="border rounded-md p-3">
                                <div className="flex justify-between mb-1">
                                  <div className="font-medium">{section.name}</div>
                                  <div>
                                    {mark} / {section.maxMarks} ({sectionPercentage}%)
                                  </div>
                                </div>
                                <Progress value={sectionPercentage} className="h-1 mb-2" />
                                {getStudentNotes(student.id, section.id) && (
                                  <div className="text-sm mt-2 text-muted-foreground">
                                    <span className="font-medium">Notes:</span>{" "}
                                    {getStudentNotes(student.id, section.id)}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {suggestions.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Suggested Improvements:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion.suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
