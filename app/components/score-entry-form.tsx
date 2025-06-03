"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { getStudents, updateStudentScore, type Student, neaCriteria, mockExamSections } from "../data"

export function ScoreEntryForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [selectedCriteriaType, setSelectedCriteriaType] = useState<"nea" | "exam">("nea")
  const [selectedCriteria, setSelectedCriteria] = useState<string>("")
  const [score, setScore] = useState<string>("")
  const [maxScore, setMaxScore] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const loadedStudents = await getStudents()
        setStudents(loadedStudents)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load students:", error)
        toast({
          title: "Error",
          description: "Failed to load students",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    loadStudents()
  }, [toast])

  useEffect(() => {
    // Update max score when criteria changes
    if (selectedCriteriaType === "nea" && selectedCriteria) {
      const criteria = neaCriteria.find((c) => c.id === selectedCriteria)
      if (criteria) {
        setMaxScore(criteria.maxMarks)
      }
    } else if (selectedCriteriaType === "exam" && selectedCriteria) {
      const section = mockExamSections.find((s) => s.id === selectedCriteria)
      if (section) {
        setMaxScore(section.maxMarks)
      }
    }
  }, [selectedCriteriaType, selectedCriteria])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStudent || !selectedCriteria || !score) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const scoreNum = Number.parseInt(score)
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > maxScore) {
      toast({
        title: "Error",
        description: `Score must be between 0 and ${maxScore}`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await updateStudentScore(selectedStudent, selectedCriteria, scoreNum)

      toast({
        title: "Success",
        description: "Score updated successfully",
      })

      // Reset form
      setScore("")

      // Notify parent component of success
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update score",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading students...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="student">Student</Label>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger id="student">
            <SelectValue placeholder="Select student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name} ({student.class})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="criteriaType">Assessment Type</Label>
        <Select
          value={selectedCriteriaType}
          onValueChange={(value: "nea" | "exam") => {
            setSelectedCriteriaType(value)
            setSelectedCriteria("")
          }}
        >
          <SelectTrigger id="criteriaType">
            <SelectValue placeholder="Select assessment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nea">NEA Criteria</SelectItem>
            <SelectItem value="exam">Mock Exam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="criteria">Criteria</Label>
        <Select value={selectedCriteria} onValueChange={setSelectedCriteria} disabled={!selectedCriteriaType}>
          <SelectTrigger id="criteria">
            <SelectValue placeholder="Select criteria" />
          </SelectTrigger>
          <SelectContent>
            {selectedCriteriaType === "nea"
              ? neaCriteria.map((criteria) => (
                  <SelectItem key={criteria.id} value={criteria.id}>
                    {criteria.name} ({criteria.maxMarks} marks)
                  </SelectItem>
                ))
              : mockExamSections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name} ({section.maxMarks} marks)
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="score">Score (out of {maxScore})</Label>
        <Input
          id="score"
          type="number"
          min="0"
          max={maxScore.toString()}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder={`Enter score (0-${maxScore})`}
          disabled={!selectedCriteria}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Score"}
      </Button>
    </form>
  )
}
