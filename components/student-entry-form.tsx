"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StudentEntryForm({ initialData = {}, onSubmit = () => {}, onSuccess = () => {} }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    class: "",
    gender: "",
    target: "5",
    avatar: "",
    ...initialData,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [availableClasses, setAvailableClasses] = useState([])

  useEffect(() => {
    // Get available classes from localStorage
    if (typeof window !== "undefined") {
      try {
        const classesData = localStorage.getItem("nea-tracker-classes")
        if (classesData) {
          const parsedClasses = JSON.parse(classesData)
          setAvailableClasses(parsedClasses)
          console.log("Loaded classes:", parsedClasses)
        } else {
          console.warn("No classes found in localStorage")
          // Set some default classes if none exist
          const defaultClasses = ["10C", "11A", "11B"]
          localStorage.setItem("nea-tracker-classes", JSON.stringify(defaultClasses))
          setAvailableClasses(defaultClasses)
        }
      } catch (error) {
        console.error("Error loading classes:", error)
        // Fallback to default classes
        setAvailableClasses(["10C", "11A", "11B"])
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Student name is required")
      }

      if (!formData.class) {
        throw new Error("Please select a class")
      }

      if (availableClasses.length === 0) {
        throw new Error("No classes available. Please add classes in the main screen first.")
      }

      // Get existing students
      const existingStudents = JSON.parse(localStorage.getItem("nea-tracker-students") || "[]")

      // Create new student
      const newStudent = {
        ...formData,
        id: Math.max(0, ...existingStudents.map((s) => s.id)) + 1,
        avatar:
          formData.avatar ||
          formData.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        target: Number.parseInt(formData.target) || 5,
        challenge: null,
        projectIdea: "",
      }

      // Add to students array
      const updatedStudents = [...existingStudents, newStudent]

      // Save to localStorage
      localStorage.setItem("nea-tracker-students", JSON.stringify(updatedStudents))

      // Call onSubmit callback
      onSubmit(newStudent)

      // Call onSuccess callback
      onSuccess()

      // Reset form
      setFormData({
        name: "",
        email: "",
        class: "",
        gender: "",
        target: "5",
        avatar: "",
      })

      // Show success message
      alert("Student added successfully!")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Student's full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="student@school.edu"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="class">Class</Label>
        <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
          <SelectTrigger id="class">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {availableClasses.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
          <SelectTrigger id="gender">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="M">Male</SelectItem>
            <SelectItem value="F">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="target">Target Grade</Label>
        <Select
          value={formData.target.toString()}
          onValueChange={(value) => setFormData({ ...formData, target: value })}
        >
          <SelectTrigger id="target">
            <SelectValue placeholder="Select target grade" />
          </SelectTrigger>
          <SelectContent>
            {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((grade) => (
              <SelectItem key={grade} value={grade.toString()}>
                Grade {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar Initials (optional)</Label>
        <Input
          id="avatar"
          value={formData.avatar}
          onChange={(e) => setFormData({ ...formData, avatar: e.target.value.slice(0, 2).toUpperCase() })}
          placeholder="e.g. AS"
          maxLength={2}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding Student..." : "Add Student"}
      </Button>
    </form>
  )
}
