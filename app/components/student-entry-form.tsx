"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { addStudent } from "../data"

export function StudentEntryForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    targetGrade: "",
    class: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.targetGrade || !formData.class) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addStudent({
        id: Date.now().toString(),
        name: formData.name,
        targetGrade: formData.targetGrade,
        class: formData.class,
        scores: {},
      })

      toast({
        title: "Success",
        description: "Student added successfully",
      })

      // Reset form
      setFormData({
        name: "",
        targetGrade: "",
        class: "",
      })

      // Notify parent component of success
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Student Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter student name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetGrade">Target Grade</Label>
        <Select value={formData.targetGrade} onValueChange={(value) => handleSelectChange("targetGrade", value)}>
          <SelectTrigger id="targetGrade">
            <SelectValue placeholder="Select target grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9">9</SelectItem>
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="7">7</SelectItem>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="1">1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="class">Class</Label>
        <Input
          id="class"
          name="class"
          value={formData.class}
          onChange={handleChange}
          placeholder="Enter class (e.g., 11A)"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Student"}
      </Button>
    </form>
  )
}
