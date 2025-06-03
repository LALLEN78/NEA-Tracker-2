"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export function ScoreEntryForm({ initialData = {}, onSubmit = () => {}, onSuccess = () => {} }) {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [scores, setScores] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Load students from localStorage
  useEffect(() => {
    const storedStudents = localStorage.getItem("nea-tracker-students")
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents))
    }
  }, [])

  // Define NEA sections
  const neaSections = [
    { id: "analysis", name: "Analysis", maxScore: 10 },
    { id: "design", name: "Design", maxScore: 15 },
    { id: "implementation", name: "Implementation", maxScore: 25 },
    { id: "evaluation", name: "Evaluation", maxScore: 20 },
    { id: "testing", name: "Testing", maxScore: 15 },
    { id: "documentation", name: "Documentation", maxScore: 15 },
  ]

  // Handle student selection
  const handleStudentChange = (studentId) => {
    const student = students.find((s) => s.id.toString() === studentId)
    setSelectedStudent(student)

    // Initialize scores from student data if available
    if (student && student.scores) {
      setScores(student.scores)
    } else {
      // Reset scores
      const initialScores = {}
      neaSections.forEach((section) => {
        initialScores[section.id] = ""
      })
      setScores(initialScores)
    }
  }

  // Handle score change
  const handleScoreChange = (sectionId, value) => {
    // Validate input is a number and within range
    const numValue = value === "" ? "" : Number.parseInt(value)
    const section = neaSections.find((s) => s.id === sectionId)

    if (value === "" || (numValue >= 0 && numValue <= section.maxScore)) {
      setScores((prev) => ({
        ...prev,
        [sectionId]: value,
      }))
    }
  }

  // Calculate total score
  const calculateTotal = () => {
    return neaSections.reduce((total, section) => {
      const score = scores[section.id] === "" ? 0 : Number.parseInt(scores[section.id])
      return total + score
    }, 0)
  }

  // Calculate maximum possible score
  const calculateMaxScore = () => {
    return neaSections.reduce((total, section) => total + section.maxScore, 0)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      if (!selectedStudent) {
        throw new Error("Please select a student")
      }

      // Validate all scores are entered
      const missingScores = neaSections.filter((section) => scores[section.id] === "")
      if (missingScores.length > 0) {
        throw new Error(`Please enter scores for: ${missingScores.map((s) => s.name).join(", ")}`)
      }

      // Update student with scores
      const updatedStudents = students.map((student) => {
        if (student.id === selectedStudent.id) {
          return {
            ...student,
            scores: scores,
          }
        }
        return student
      })

      // Save to localStorage
      localStorage.setItem("nea-tracker-students", JSON.stringify(updatedStudents))

      // Call callbacks
      onSubmit({ studentId: selectedStudent.id, scores })
      onSuccess()

      // Show success message
      setSuccess(`Scores saved for ${selectedStudent.name}`)

      // Reset form
      setSelectedStudent(null)
      setScores({})
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

      <div className="space-y-2">
        <Label htmlFor="student">Select Student</Label>
        <Select onValueChange={handleStudentChange} value={selectedStudent?.id?.toString() || ""}>
          <SelectTrigger id="student">
            <SelectValue placeholder="Choose a student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id.toString()}>
                {student.name} ({student.class})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedStudent && (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {neaSections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <Label htmlFor={section.id}>
                      {section.name} (0-{section.maxScore})
                    </Label>
                    <Input
                      id={section.id}
                      type="number"
                      min="0"
                      max={section.maxScore}
                      value={scores[section.id] || ""}
                      onChange={(e) => handleScoreChange(section.id, e.target.value)}
                      placeholder={`Enter score (max: ${section.maxScore})`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="text-sm font-medium">Total Score</p>
              <p className="text-2xl font-bold">
                {calculateTotal()} / {calculateMaxScore()}
              </p>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Scores"}
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
