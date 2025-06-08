"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Default contextual challenges
const defaultChallenges = [
  {
    id: "1",
    title: "Sustainable Living",
    description: "Design and develop a product that promotes sustainable living and reduces environmental impact.",
    releaseDate: "2025-06-01",
    academicYear: "2025-2026",
  },
  {
    id: "2",
    title: "Inclusive Design",
    description:
      "Design and develop a product that addresses the needs of users with disabilities or limited mobility.",
    releaseDate: "2025-06-01",
    academicYear: "2025-2026",
  },
  {
    id: "3",
    title: "Future Learning",
    description: "Design and develop a product that enhances learning experiences in educational environments.",
    releaseDate: "2025-06-01",
    academicYear: "2025-2026",
  },
]

export default function ContextualChallengesPage() {
  const { toast } = useToast()
  const [challenges, setChallenges] = useState(() => {
    if (typeof window !== "undefined") {
      const savedChallenges = localStorage.getItem("nea-tracker-challenges")
      if (savedChallenges) {
        return JSON.parse(savedChallenges)
      }
    }
    return defaultChallenges
  })

  const [students, setStudents] = useState(() => {
    if (typeof window !== "undefined") {
      const savedStudents = localStorage.getItem("nea-tracker-students")
      if (savedStudents) {
        return JSON.parse(savedStudents)
      }
    }
    return []
  })

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [currentStudent, setCurrentStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nea-tracker-challenges", JSON.stringify(challenges))
    }
  }, [challenges])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nea-tracker-students", JSON.stringify(students))
    }
  }, [students])

  const handleAddChallenge = () => {
    setCurrentChallenge({
      id: Date.now().toString(),
      title: "",
      description: "",
      releaseDate: new Date().toISOString().split("T")[0],
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    })
    setIsEditDialogOpen(true)
  }

  const handleEditChallenge = (challenge) => {
    setCurrentChallenge({ ...challenge })
    setIsEditDialogOpen(true)
  }

  const handleSaveChallenge = () => {
    if (!currentChallenge.title) {
      toast({
        title: "Error",
        description: "Please enter a title for the challenge",
        variant: "destructive",
      })
      return
    }

    let updatedChallenges
    if (challenges.find((c) => c.id === currentChallenge.id)) {
      // Edit existing challenge
      updatedChallenges = challenges.map((c) => (c.id === currentChallenge.id ? currentChallenge : c))
    } else {
      // Add new challenge
      updatedChallenges = [...challenges, currentChallenge]
    }

    setChallenges(updatedChallenges)
    setIsEditDialogOpen(false)
    toast({
      title: "Success",
      description: `Challenge "${currentChallenge.title}" has been saved`,
    })
  }

  const handleDeleteChallenge = (id) => {
    if (confirm("Are you sure you want to delete this contextual challenge?")) {
      // Check if any students are using this challenge
      const studentsUsingChallenge = students.filter((s) => s.contextualChallengeId === id)

      if (studentsUsingChallenge.length > 0) {
        if (
          confirm(
            `${studentsUsingChallenge.length} students are currently assigned to this challenge. Deleting it will remove the assignment. Continue?`,
          )
        ) {
          // Update students to remove the challenge assignment
          const updatedStudents = students.map((student) => {
            if (student.contextualChallengeId === id) {
              return {
                ...student,
                contextualChallengeId: null,
                projectIdea: student.projectIdea, // Preserve their project idea
              }
            }
            return student
          })
          setStudents(updatedStudents)

          // Delete the challenge
          setChallenges(challenges.filter((c) => c.id !== id))
          toast({
            title: "Challenge deleted",
            description: "The contextual challenge and student assignments have been removed",
          })
        }
      } else {
        // No students using this challenge, just delete it
        setChallenges(challenges.filter((c) => c.id !== id))
        toast({
          title: "Challenge deleted",
          description: "The contextual challenge has been deleted",
        })
      }
    }
  }

  const handleAssignToStudent = (challenge) => {
    setCurrentChallenge(challenge)
    setIsStudentDialogOpen(true)
  }

  const handleStudentSelection = (student) => {
    setCurrentStudent(student)
  }

  const handleSaveStudentAssignment = () => {
    if (!currentStudent) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive",
      })
      return
    }

    // Update the student with the selected challenge
    const updatedStudents = students.map((s) => {
      if (s.id === currentStudent.id) {
        return {
          ...s,
          contextualChallengeId: currentChallenge.id,
          // Preserve existing project idea if there is one
          projectIdea: s.projectIdea || "",
        }
      }
      return s
    })

    setStudents(updatedStudents)
    setIsStudentDialogOpen(false)
    setCurrentStudent(null)

    toast({
      title: "Challenge assigned",
      description: `"${currentChallenge.title}" has been assigned to ${currentStudent.name}`,
    })
  }

  const filteredStudents = students.filter((student) => {
    return student.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getStudentsForChallenge = (challengeId) => {
    return students.filter((s) => s.contextualChallengeId === challengeId)
  }

  const handleChallengeChange = (id: number, field: "title" | "description", value: string) => {
    setChallenges(challenges.map((challenge) => (challenge.id === id ? { ...challenge, [field]: value } : challenge)))
  }

  const handleSave = () => {
    // In a real app, save to database
    localStorage.setItem("contextualChallenges", JSON.stringify(challenges))
    toast({
      title: "Challenges saved",
      description: "The contextual challenges have been saved successfully.",
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AQA Contextual Challenges</h1>
        <Button onClick={handleSave}>Save Challenges</Button>
      </div>

      <p className="text-muted-foreground mb-6">
        Enter the three AQA contextual challenges released in June. These can be assigned to students for their NEA
        projects.
      </p>

      <div className="grid gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader>
              <CardTitle>Challenge {challenge.id}</CardTitle>
              <CardDescription>Enter the details for contextual challenge {challenge.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor={`title-${challenge.id}`} className="block text-sm font-medium mb-1">
                    Challenge Title
                  </label>
                  <Input
                    id={`title-${challenge.id}`}
                    value={challenge.title}
                    onChange={(e) => handleChallengeChange(challenge.id, "title", e.target.value)}
                    placeholder={`Enter title for challenge ${challenge.id}`}
                  />
                </div>
                <div>
                  <label htmlFor={`description-${challenge.id}`} className="block text-sm font-medium mb-1">
                    Challenge Description
                  </label>
                  <Textarea
                    id={`description-${challenge.id}`}
                    value={challenge.description}
                    onChange={(e) => handleChallengeChange(challenge.id, "description", e.target.value)}
                    placeholder={`Enter description for challenge ${challenge.id}`}
                    rows={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
