"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, Plus, Users, Calculator, BarChart3, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getStudents } from "../data"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import StudentReport from "./print-helper"

const neaSections = [
  { id: "section-a", name: "Section A", maxMarks: 10 },
  { id: "section-b", name: "Section B", maxMarks: 10 },
  { id: "section-c", name: "Section C", maxMarks: 20 },
  { id: "section-d", name: "Section D", maxMarks: 20 },
  { id: "section-e", name: "Section E", maxMarks: 20 },
  { id: "section-f", name: "Section F", maxMarks: 20 },
]

const mockExamSections = [
  { id: "paper-1-section-a", name: "Paper 1: Section A", maxMarks: 20, paper: "paper-1" },
  { id: "paper-1-section-b", name: "Paper 1: Section B", maxMarks: 30, paper: "paper-1" },
  { id: "paper-1-section-c", name: "Paper 1: Section C", maxMarks: 50, paper: "paper-1" },
  { id: "paper-2-section-a", name: "Paper 2: Section A", maxMarks: 20, paper: "paper-2" },
  { id: "paper-2-section-b", name: "Paper 2: Section B", maxMarks: 30, paper: "paper-2" },
  { id: "paper-2-section-c", name: "Paper 2: Section C", maxMarks: 50, paper: "paper-2" },
]

export default function ProgressPage() {
  const { toast } = useToast()
  const [students, setStudents] = useState([])
  const [activeTab, setActiveTab] = useState("nea-progress")
  const [studentScores, setStudentScores] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate total max marks for NEA
  const totalNeaMarks = neaSections.reduce((total, section) => total + section.maxMarks, 0)

  // Calculate total max marks for mock exams
  const totalMockMarks = mockExamSections.reduce((total, section) => total + section.maxMarks, 0)

  // Helper function to group sections by paper
  const getPaperSections = (paperId) => {
    return mockExamSections.filter((section) => section.paper === paperId)
  }

  const paperIds = ["paper-1", "paper-2"]

  // Load students and scores from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load students
      const loadedStudents = getStudents()
      setStudents(loadedStudents)

      // Load scores
      const savedScores = localStorage.getItem("nea-tracker-scores")
      if (savedScores) {
        try {
          const parsedScores = JSON.parse(savedScores)
          setStudentScores(parsedScores)
        } catch (error) {
          console.error("Error parsing scores:", error)
          setStudentScores({})
        }
      }
    }
  }, [])

  // Handle score change (including notes and portfolio links)
  const handleScoreChange = (studentId, field, value) => {
    if (field === "notes" || field === "portfolioLink") {
      // Handle text fields
      setStudentScores((prev) => {
        const updated = {
          ...prev,
          [studentId]: {
            ...(prev[studentId] || {}),
            [field]: value,
          },
        }
        localStorage.setItem("nea-tracker-scores", JSON.stringify(updated))
        return updated
      })
    } else {
      // Handle numeric score fields
      const numValue = Number.parseInt(value) || 0
      const section = [...neaSections, ...mockExamSections].find((s) => s.id === field)

      if (!section) return

      // Ensure score doesn't exceed max marks
      const validScore = Math.min(numValue, section.maxMarks)

      setStudentScores((prev) => {
        const updated = {
          ...prev,
          [studentId]: {
            ...(prev[studentId] || {}),
            [field]: validScore,
          },
        }

        // Save to localStorage immediately for real-time sync
        localStorage.setItem("nea-tracker-scores", JSON.stringify(updated))

        return updated
      })
    }
  }

  // Calculate total NEA score
  const calculateTotalNea = (studentId) => {
    if (!studentScores[studentId]) return 0

    return neaSections.reduce((total, section) => {
      return total + (studentScores[studentId][section.id] || 0)
    }, 0)
  }

  // Calculate total for a specific paper
  const calculatePaperTotal = (studentId, paperId) => {
    if (!studentScores[studentId]) return 0

    return getPaperSections(paperId).reduce((total, section) => {
      return total + (studentScores[studentId][section.id] || 0)
    }, 0)
  }

  // Calculate total mock exam score
  const calculateTotalMock = (studentId) => {
    if (!studentScores[studentId]) return 0

    return mockExamSections.reduce((total, section) => {
      return total + (studentScores[studentId][section.id] || 0)
    }, 0)
  }

  // Calculate NEA grade
  const calculateNeaGrade = (marks) => {
    const neaBoundaries = {
      9: 87,
      8: 80,
      7: 75,
      6: 67,
      5: 58,
      4: 50,
      3: 37,
      2: 24,
      1: 11,
      U: 0,
    }

    const grades = Object.keys(neaBoundaries).sort((a, b) => neaBoundaries[b] - neaBoundaries[a])

    for (const grade of grades) {
      if (marks >= neaBoundaries[grade]) {
        return grade
      }
    }

    return "U"
  }

  // Calculate exam grade
  const calculateExamGrade = (marks) => {
    const examBoundaries = {
      9: 87,
      8: 80,
      7: 75,
      6: 67,
      5: 58,
      4: 50,
      3: 37,
      2: 24,
      1: 11,
      U: 0,
    }

    const grades = Object.keys(examBoundaries).sort((a, b) => examBoundaries[b] - examBoundaries[a])

    for (const grade of grades) {
      if (marks >= examBoundaries[grade]) {
        return grade
      }
    }

    return "U"
  }

  // Calculate overall grade
  const calculateOverallGrade = (neaMarks, examMarks) => {
    const neaPercentage = (neaMarks / totalNeaMarks) * 100
    const examPercentage = (examMarks / totalMockMarks) * 100
    const weightedPercentage = neaPercentage * 0.5 + examPercentage * 0.5
    const weightedScore = (weightedPercentage / 100) * 100

    const examBoundaries = {
      9: 87,
      8: 80,
      7: 75,
      6: 67,
      5: 58,
      4: 50,
      3: 37,
      2: 24,
      1: 11,
      U: 0,
    }

    const grades = Object.keys(examBoundaries).sort((a, b) => examBoundaries[b] - examBoundaries[a])

    for (const grade of grades) {
      if (weightedScore >= examBoundaries[grade]) {
        return grade
      }
    }

    return "U"
  }

  // Calculate progress percentage for overview
  const calculateProgress = (student) => {
    if (!student.progress) {
      student.progress = {}
    }

    const stages = [
      "Research Question",
      "Initial Research",
      "Experiment Design",
      "Data Collection",
      "Data Analysis",
      "Drafting",
      "Final Submission",
    ]

    let completedStages = 0
    stages.forEach((stage) => {
      if (student.progress[stage]) {
        completedStages++
      }
    })
    return (completedStages / stages.length) * 100
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Data is already saved in localStorage during handleScoreChange
      toast({
        title: "Progress saved",
        description: "Student progress marks have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving progress",
        description: "There was a problem saving the progress marks.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (students.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">NEA Progress Tracker</h1>
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No students added yet</h3>
          <p className="mt-2 text-muted-foreground">Add students to start tracking their NEA progress.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button asChild>
              <Link href="/students">
                <Plus className="mr-2 h-4 w-4" />
                Add Students
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/data-import">Import Students</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">NEA Progress Tracker</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calculator className="mr-2 h-4 w-4" />
            Grade Calculator
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nea-progress">NEA Progress</TabsTrigger>
          <TabsTrigger value="mock-exams">Mock Exams</TabsTrigger>
          <TabsTrigger value="overall-progress">Overall Progress</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-2">Total Students</h3>
                <p className="text-3xl font-bold text-primary">{students.length}</p>
              </div>
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-2">Average NEA Progress</h3>
                <p className="text-3xl font-bold text-green-600">
                  {students.length > 0
                    ? Math.round(
                        students.reduce((acc, student) => acc + calculateProgress(student), 0) / students.length,
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-2">Completed NEAs</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {students.filter((student) => calculateProgress(student) === 100).length}
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Student Progress Overview</h3>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{student.avatar || student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-sm text-muted-foreground">{calculateProgress(student)}%</span>
                      </div>
                      <Progress value={calculateProgress(student)} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nea-progress" className="mt-6">
          <form onSubmit={handleSubmit}>
            <div className="bg-card rounded-lg overflow-hidden border">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 font-medium">Student</th>
                      {neaSections.map((section) => (
                        <th key={section.id} className="p-4 font-medium text-center">
                          {section.name}
                          <div className="text-xs font-normal text-muted-foreground">Max: {section.maxMarks}</div>
                        </th>
                      ))}
                      <th className="p-4 font-medium text-center">
                        Total
                        <div className="text-xs font-normal text-muted-foreground">Max: {totalNeaMarks}</div>
                      </th>
                      <th className="p-4 font-medium text-center">Grade</th>
                      <th className="p-4 font-medium text-center">Notes</th>
                      <th className="p-4 font-medium text-center">Portfolio Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const totalScore = calculateTotalNea(student.id)
                      const grade = calculateNeaGrade(totalScore)

                      return (
                        <tr key={student.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{student.avatar || student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.class}</div>
                              </div>
                            </div>
                          </td>
                          {neaSections.map((section) => (
                            <td key={`${student.id}-${section.id}`} className="p-4 text-center">
                              <Input
                                type="number"
                                min="0"
                                max={section.maxMarks}
                                value={studentScores[student.id]?.[section.id] || 0}
                                onChange={(e) => handleScoreChange(student.id, section.id, e.target.value)}
                                className="w-16 text-center"
                              />
                            </td>
                          ))}
                          <td className="p-4 text-center font-medium">{totalScore}</td>
                          <td className="p-4 text-center">
                            <Badge variant={grade === "U" ? "destructive" : "default"}>{grade}</Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Input
                              type="text"
                              placeholder="Add notes..."
                              value={studentScores[student.id]?.notes || ""}
                              onChange={(e) => handleScoreChange(student.id, "notes", e.target.value)}
                              className="w-32 text-sm"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center gap-2">
                              <Input
                                type="url"
                                placeholder="Paste portfolio link..."
                                value={studentScores[student.id]?.portfolioLink || ""}
                                onChange={(e) => handleScoreChange(student.id, "portfolioLink", e.target.value)}
                                className="w-40 text-sm"
                              />
                              {studentScores[student.id]?.portfolioLink && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(studentScores[student.id].portfolioLink, "_blank")}
                                  className="p-1 h-8 w-8"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save All Marks"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="mock-exams" className="mt-6">
          <form onSubmit={handleSubmit}>
            <div className="bg-card rounded-lg overflow-hidden border">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 font-medium">Student</th>
                      {paperIds.map((paperId) => (
                        <React.Fragment key={paperId}>
                          {getPaperSections(paperId).map((section) => (
                            <th key={section.id} className="p-4 font-medium text-center">
                              {section.name}
                              <div className="text-xs font-normal text-muted-foreground">Max: {section.maxMarks}</div>
                            </th>
                          ))}
                          <th className="p-4 font-medium text-center">
                            {paperId === "paper-1" ? "Paper 1 Total" : "Paper 2 Total"}
                            <div className="text-xs font-normal text-muted-foreground">Max: 100</div>
                          </th>
                        </React.Fragment>
                      ))}
                      <th className="p-4 font-medium text-center">
                        Total
                        <div className="text-xs font-normal text-muted-foreground">Max: {totalMockMarks}</div>
                      </th>
                      <th className="p-4 font-medium text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const totalScore = calculateTotalMock(student.id)
                      const grade = calculateExamGrade(totalScore)

                      return (
                        <tr key={student.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{student.avatar || student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.class}</div>
                              </div>
                            </div>
                          </td>
                          {paperIds.map((paperId) => (
                            <React.Fragment key={paperId}>
                              {getPaperSections(paperId).map((section) => (
                                <td key={`${student.id}-${section.id}`} className="p-4 text-center">
                                  <Input
                                    type="number"
                                    min="0"
                                    max={section.maxMarks}
                                    value={studentScores[student.id]?.[section.id] || 0}
                                    onChange={(e) => handleScoreChange(student.id, section.id, e.target.value)}
                                    className="w-16 text-center"
                                  />
                                </td>
                              ))}
                              <td className="p-4 text-center font-medium">
                                {calculatePaperTotal(student.id, paperId)}
                              </td>
                            </React.Fragment>
                          ))}
                          <td className="p-4 text-center font-medium">{totalScore}</td>
                          <td className="p-4 text-center">
                            <Badge variant={grade === "U" ? "destructive" : "default"}>{grade}</Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save All Marks"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="overall-progress" className="mt-6">
          <div className="bg-card rounded-lg overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 font-medium">Student</th>
                    <th className="p-4 font-medium text-center">NEA Total</th>
                    <th className="p-4 font-medium text-center">NEA Grade</th>
                    <th className="p-4 font-medium text-center">Mock Total</th>
                    <th className="p-4 font-medium text-center">Mock Grade</th>
                    <th className="p-4 font-medium text-center">Overall Grade</th>
                    <th className="p-4 font-medium text-center">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const neaTotal = calculateTotalNea(student.id)
                    const mockTotal = calculateTotalMock(student.id)
                    const neaGrade = calculateNeaGrade(neaTotal)
                    const mockGrade = calculateExamGrade(mockTotal)
                    const overallGrade = calculateOverallGrade(neaTotal, mockTotal)

                    return (
                      <tr key={student.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{student.avatar || student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-muted-foreground">{student.class}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center font-medium">
                          {neaTotal}/{totalNeaMarks}
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={neaGrade === "U" ? "destructive" : "default"}>{neaGrade}</Badge>
                        </td>
                        <td className="p-4 text-center font-medium">
                          {mockTotal}/{totalMockMarks}
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={mockGrade === "U" ? "destructive" : "default"}>{mockGrade}</Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant={overallGrade === "U" ? "destructive" : "default"}>{overallGrade}</Badge>
                        </td>
                        <td className="p-4 text-center font-medium">{student.target}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="grid gap-6">
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Individual Student Reports</h3>
              <div className="grid gap-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{student.avatar || student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.class}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <StudentReport
                        student={student}
                        studentScores={studentScores[student.id] || {}}
                        portfolioProgress={{}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Class Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Class Progress Summary
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Grade Distribution
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calculator className="h-6 w-6 mb-2" />
                  Mock Exam Analysis
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Student Comparison
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
