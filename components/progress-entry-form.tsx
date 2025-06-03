"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function ProgressEntryForm({ onSuccess = () => {}, onClose = () => {} }) {
  const { toast } = useToast()
  const [students, setStudents] = useState([])
  const [activeTab, setActiveTab] = useState("nea-progress")
  const [studentScores, setStudentScores] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // NEA sections with max marks
  const neaSections = [
    { id: "section-a", name: "Section A", maxMarks: 10 },
    { id: "section-b", name: "Section B", maxMarks: 10 },
    { id: "section-c", name: "Section C", maxMarks: 20 },
    { id: "section-d", name: "Section D", maxMarks: 20 },
    { id: "section-e", name: "Section E", maxMarks: 20 },
    { id: "section-f", name: "Section F", maxMarks: 20 },
  ]

  // Mock exam sections
  const mockExamSections = [
    { id: "paper-1-section-a", name: "Paper 1: Section A", maxMarks: 20, paper: "paper-1" },
    { id: "paper-1-section-b", name: "Paper 1: Section B", maxMarks: 30, paper: "paper-1" },
    { id: "paper-1-section-c", name: "Paper 1: Section C", maxMarks: 50, paper: "paper-1" },
    { id: "paper-2-section-a", name: "Paper 2: Section A", maxMarks: 20, paper: "paper-2" },
    { id: "paper-2-section-b", name: "Paper 2: Section B", maxMarks: 30, paper: "paper-2" },
    { id: "paper-2-section-c", name: "Paper 2: Section C", maxMarks: 50, paper: "paper-2" },
  ]

  // Helper function to group sections by paper
  const getPaperSections = (paperId) => {
    return mockExamSections.filter((section) => section.paper === paperId)
  }

  const paperIds = ["paper-1", "paper-2"]

  // Calculate total max marks for NEA
  const totalNeaMarks = neaSections.reduce((total, section) => total + section.maxMarks, 0)

  // Calculate total max marks for mock exams
  const totalMockMarks = mockExamSections.reduce((total, section) => total + section.maxMarks, 0)

  // Load students and scores from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load students
      const savedStudents = localStorage.getItem("nea-tracker-students")
      if (savedStudents) {
        try {
          const parsedStudents = JSON.parse(savedStudents)
          setStudents(parsedStudents)
          console.log("Loaded students:", parsedStudents)
        } catch (error) {
          console.error("Error parsing students:", error)
          // Add sample students if none exist
          const sampleStudents = [
            { id: 1, name: "Alice Smith", class: "10C", target: 7, avatar: "AS" },
            { id: 2, name: "Bob Johnson", class: "10C", target: 6, avatar: "BJ" },
            { id: 3, name: "Charlie Brown", class: "11B", target: 8, avatar: "CB" },
            { id: 4, name: "Diana Prince", class: "11B", target: 9, avatar: "DP" },
            { id: 5, name: "Edward Stark", class: "10C", target: 5, avatar: "ES" },
          ]
          setStudents(sampleStudents)
          localStorage.setItem("nea-tracker-students", JSON.stringify(sampleStudents))
        }
      } else {
        // Add sample students if none exist
        const sampleStudents = [
          { id: 1, name: "Alice Smith", class: "10C", target: 7, avatar: "AS" },
          { id: 2, name: "Bob Johnson", class: "10C", target: 6, avatar: "BJ" },
          { id: 3, name: "Charlie Brown", class: "11B", target: 8, avatar: "CB" },
          { id: 4, name: "Diana Prince", class: "11B", target: 9, avatar: "DP" },
          { id: 5, name: "Edward Stark", class: "10C", target: 5, avatar: "ES" },
        ]
        setStudents(sampleStudents)
        localStorage.setItem("nea-tracker-students", JSON.stringify(sampleStudents))
      }

      // Load scores
      const savedScores = localStorage.getItem("nea-tracker-scores")
      if (savedScores) {
        try {
          const parsedScores = JSON.parse(savedScores)
          console.log("Loaded scores:", parsedScores)
          setStudentScores(parsedScores)
        } catch (error) {
          console.error("Error parsing scores:", error)
          setStudentScores({})
        }
      }
    }
  }, [])

  // Handle score change
  const handleScoreChange = (studentId, sectionId, value) => {
    const numValue = Number.parseInt(value) || 0
    const section = [...neaSections, ...mockExamSections].find((s) => s.id === sectionId)

    if (!section) return

    // Ensure score doesn't exceed max marks
    const validScore = Math.min(numValue, section.maxMarks)

    setStudentScores((prev) => {
      const updated = {
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          [sectionId]: validScore,
        },
      }

      // Save to localStorage immediately for real-time sync
      localStorage.setItem("nea-tracker-scores", JSON.stringify(updated))

      return updated
    })
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
    // Default AQA grade boundaries for GCSE Design & Technology
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

    // Find the grade based on raw score and boundaries
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
    // Default AQA grade boundaries for GCSE Design & Technology
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

    // Find the grade based on raw score and boundaries
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
    // Convert to percentages for weighting
    const neaPercentage = (neaMarks / totalNeaMarks) * 100
    const examPercentage = (examMarks / totalMockMarks) * 100

    // Apply 50/50 weighting
    const weightedPercentage = neaPercentage * 0.5 + examPercentage * 0.5

    // Convert back to a score out of 100
    const weightedScore = (weightedPercentage / 100) * 100

    // Use exam boundaries for overall grade
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    try {
      // Data is already saved in localStorage during handleScoreChange
      // Just notify the parent window
      if (window.opener) {
        window.opener.postMessage({ type: "update-data", contentType: "progress" }, "*")
      }

      // Show success message
      setMessage({
        type: "success",
        text: "Progress marks saved successfully",
      })

      toast({
        title: "Progress saved",
        description: "Student progress marks have been saved successfully.",
      })

      // Call onSuccess callback
      onSuccess()
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      })

      toast({
        title: "Error saving progress",
        description: "There was a problem saving the progress marks.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">NEA Tracker - Data Entry</h1>
        <Button variant="destructive" onClick={onClose} className="flex items-center gap-1">
          <X className="h-4 w-4" />
          Close Secondary Screen
        </Button>
      </div>

      {message.text && (
        <div
          className={`p-3 mb-4 rounded-md ${
            message.type === "error" ? "bg-red-900 text-red-100" : "bg-green-900 text-green-100"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-lg overflow-hidden mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-slate-800 rounded-none p-0 h-auto">
            <TabsTrigger
              value="nea-progress"
              className={cn(
                "rounded-none py-2 px-4 data-[state=active]:bg-slate-900 data-[state=active]:shadow-none",
                activeTab === "nea-progress" ? "bg-slate-900 text-white" : "text-slate-400",
              )}
            >
              NEA Progress
            </TabsTrigger>
            <TabsTrigger
              value="mock-exams"
              className={cn(
                "rounded-none py-2 px-4 data-[state=active]:bg-slate-900 data-[state=active]:shadow-none",
                activeTab === "mock-exams" ? "bg-slate-900 text-white" : "text-slate-400",
              )}
            >
              Mock Exams
            </TabsTrigger>
            <TabsTrigger
              value="overall-progress"
              className={cn(
                "rounded-none py-2 px-4 data-[state=active]:bg-slate-900 data-[state=active]:shadow-none",
                activeTab === "overall-progress" ? "bg-slate-900 text-white" : "text-slate-400",
              )}
            >
              Overall Progress
            </TabsTrigger>
            <TabsTrigger
              value="nea-criteria"
              className={cn(
                "rounded-none py-2 px-4 data-[state=active]:bg-slate-900 data-[state=active]:shadow-none",
                activeTab === "nea-criteria" ? "bg-slate-900 text-white" : "text-slate-400",
              )}
            >
              NEA Criteria
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nea-progress" className="mt-0">
            <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="p-3 text-slate-300 font-medium">Student</th>
                      {neaSections.map((section) => (
                        <th key={section.id} className="p-3 text-slate-300 font-medium">
                          {section.name}
                          <div className="text-xs font-normal text-slate-400">Max: {section.maxMarks}</div>
                        </th>
                      ))}
                      <th className="p-3 text-slate-300 font-medium">
                        Total
                        <div className="text-xs font-normal text-slate-400">Max: {totalNeaMarks}</div>
                      </th>
                      <th className="p-3 text-slate-300 font-medium">Grade</th>
                      <th className="p-3 text-slate-300 font-medium">Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const totalScore = calculateTotalNea(student.id)
                      const grade = calculateNeaGrade(totalScore)

                      return (
                        <tr key={student.id} className="border-b border-slate-800">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 bg-slate-800">
                                <AvatarFallback className="bg-slate-800 text-white">
                                  {student.avatar || student.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-white">{student.name}</div>
                                <div className="text-sm text-slate-400">{student.class}</div>
                              </div>
                            </div>
                          </td>
                          {neaSections.map((section) => (
                            <td key={`${student.id}-${section.id}`} className="p-3">
                              <Input
                                type="number"
                                min="0"
                                max={section.maxMarks}
                                value={studentScores[student.id]?.[section.id] || 0}
                                onChange={(e) => handleScoreChange(student.id, section.id, e.target.value)}
                                className="w-16 bg-slate-800 border-slate-700 text-white text-center"
                              />
                            </td>
                          ))}
                          <td className="p-3 font-medium text-white">{totalScore}</td>
                          <td className="p-3 font-medium text-white">{grade}</td>
                          <td className="p-3">
                            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-white">
                              <FileText className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? "Saving..." : "Save All Marks"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="mock-exams" className="mt-0">
            <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="p-3 text-slate-300 font-medium">Student</th>
                      {paperIds.map((paperId) => (
                        <React.Fragment key={paperId}>
                          {getPaperSections(paperId).map((section) => (
                            <th key={section.id} className="p-3 text-slate-300 font-medium">
                              {section.name}
                              <div className="text-xs font-normal text-slate-400">Max: {section.maxMarks}</div>
                            </th>
                          ))}
                          <th className="p-3 text-slate-300 font-medium">
                            {paperId === "paper-1" ? "Paper 1 Total" : "Paper 2 Total"}
                            <div className="text-xs font-normal text-slate-400">Max: 100</div>
                          </th>
                        </React.Fragment>
                      ))}
                      <th className="p-3 text-slate-300 font-medium">
                        Total
                        <div className="text-xs font-normal text-slate-400">Max: {totalMockMarks}</div>
                      </th>
                      <th className="p-3 text-slate-300 font-medium">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const totalScore = calculateTotalMock(student.id)
                      const grade = calculateExamGrade(totalScore)

                      return (
                        <tr key={student.id} className="border-b border-slate-800">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 bg-slate-800">
                                <AvatarFallback className="bg-slate-800 text-white">
                                  {student.avatar || student.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-white">{student.name}</div>
                                <div className="text-sm text-slate-400">{student.class}</div>
                              </div>
                            </div>
                          </td>
                          {paperIds.map((paperId) => (
                            <React.Fragment key={paperId}>
                              {getPaperSections(paperId).map((section) => (
                                <td key={`${student.id}-${section.id}`} className="p-3">
                                  <Input
                                    type="number"
                                    min="0"
                                    max={section.maxMarks}
                                    value={studentScores[student.id]?.[section.id] || 0}
                                    onChange={(e) => handleScoreChange(student.id, section.id, e.target.value)}
                                    className="w-16 bg-slate-800 border-slate-700 text-white text-center"
                                  />
                                </td>
                              ))}
                              <td className="p-3 font-medium text-white">{calculatePaperTotal(student.id, paperId)}</td>
                            </React.Fragment>
                          ))}
                          <td className="p-3 font-medium text-white">{totalScore}</td>
                          <td className="p-3 font-medium text-white">{grade}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? "Saving..." : "Save All Marks"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="overall-progress" className="mt-0">
            <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
              <div className="bg-slate-900 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="p-3 text-slate-300 font-medium">Student</th>
                      <th className="p-3 text-slate-300 font-medium">NEA Total</th>
                      <th className="p-3 text-slate-300 font-medium">NEA Grade</th>
                      <th className="p-3 text-slate-300 font-medium">Mock Total</th>
                      <th className="p-3 text-slate-300 font-medium">Mock Grade</th>
                      <th className="p-3 text-slate-300 font-medium">Overall Grade</th>
                      <th className="p-3 text-slate-300 font-medium">Target</th>
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
                        <tr key={student.id} className="border-b border-slate-800">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 bg-slate-800">
                                <AvatarFallback className="bg-slate-800 text-white">
                                  {student.avatar || student.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-white">{student.name}</div>
                                <div className="text-sm text-slate-400">{student.class}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-medium text-white">
                            {neaTotal}/{totalNeaMarks}
                          </td>
                          <td className="p-3 font-medium text-white">{neaGrade}</td>
                          <td className="p-3 font-medium text-white">
                            {mockTotal}/{totalMockMarks}
                          </td>
                          <td className="p-3 font-medium text-white">{mockGrade}</td>
                          <td className="p-3 font-medium text-white">{overallGrade}</td>
                          <td className="p-3 font-medium text-white">{student.target}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? "Saving..." : "Save All Marks"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="nea-criteria" className="mt-0">
            <div className="bg-slate-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">NEA Assessment Criteria</h3>
              <p className="mb-4">
                This tab provides reference information about the NEA assessment criteria. Use the NEA Progress tab to
                enter marks.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {neaSections.map((section) => (
                  <div key={section.id} className="border border-slate-800 rounded-lg p-4">
                    <h4 className="font-medium mb-2">{section.name}</h4>
                    <p className="text-sm text-slate-400">Maximum marks: {section.maxMarks}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
