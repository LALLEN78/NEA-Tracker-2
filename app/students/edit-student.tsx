"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Save } from "lucide-react"

export function EditStudent({ isOpen, onClose, student, onSave }) {
  const [editedStudent, setEditedStudent] = useState(null)

  // Add the challenges state at the top of the component:
  const [challenges, setChallenges] = useState(() => {
    if (typeof window !== "undefined") {
      const savedChallenges = localStorage.getItem("nea-tracker-challenges")
      if (savedChallenges) {
        return JSON.parse(savedChallenges)
      }
    }
    return []
  })

  // Update editedStudent when student prop changes
  useEffect(() => {
    if (student) {
      setEditedStudent({ ...student })
    } else {
      // Initialize with empty values for new student
      setEditedStudent({
        name: "",
        email: "",
        class: "",
        gender: "",
        target: "",
        avatar: "",
        contextualChallengeId: "",
        projectIdea: "",
      })
    }
  }, [student])

  // If no editedStudent, don't render the form content
  if (!editedStudent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Loading student data...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{student ? "Edit Student Details" : "Add New Student"}</DialogTitle>
          <DialogDescription>
            {student ? "Update student information and academic targets" : "Enter details for the new student"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={editedStudent.name || ""}
              onChange={(e) => setEditedStudent({ ...editedStudent, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={editedStudent.email || ""}
              onChange={(e) => setEditedStudent({ ...editedStudent, email: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="class" className="text-right">
              Class
            </Label>
            <Select
              value={editedStudent.class || ""}
              onValueChange={(value) => setEditedStudent({ ...editedStudent, class: value })}
            >
              <SelectTrigger id="class" className="col-span-3">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="11A">11A</SelectItem>
                <SelectItem value="11B">11B</SelectItem>
                <SelectItem value="11C">11C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Select
              value={editedStudent.gender || ""}
              onValueChange={(value) => setEditedStudent({ ...editedStudent, gender: value })}
            >
              <SelectTrigger id="gender" className="col-span-3">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">
              Target Grade
            </Label>
            <Select
              value={(editedStudent.target || "").toString()}
              onValueChange={(value) => setEditedStudent({ ...editedStudent, target: Number.parseInt(value) })}
            >
              <SelectTrigger id="target" className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              Avatar Initials
            </Label>
            <Input
              id="avatar"
              value={editedStudent.avatar || ""}
              onChange={(e) => setEditedStudent({ ...editedStudent, avatar: e.target.value.slice(0, 2).toUpperCase() })}
              className="col-span-3"
              maxLength={2}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contextualChallenge" className="text-right">
              Contextual Challenge
            </Label>
            <div className="col-span-3">
              <select
                id="contextualChallenge"
                value={editedStudent.contextualChallengeId || ""}
                onChange={(e) => {
                  const value = e.target.value || null
                  setEditedStudent({
                    ...editedStudent,
                    contextualChallengeId: value,
                  })
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- Select a challenge --</option>
                {challenges.map((challenge) => (
                  <option key={challenge.id} value={challenge.id}>
                    {challenge.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="projectIdea" className="text-right pt-2">
              Project Idea
            </Label>
            <textarea
              id="projectIdea"
              value={editedStudent.projectIdea || ""}
              onChange={(e) => setEditedStudent({ ...editedStudent, projectIdea: e.target.value })}
              className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe the student's project idea..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editedStudent)}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
