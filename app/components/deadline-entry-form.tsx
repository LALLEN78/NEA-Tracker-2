"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { addDeadline, neaCriteria } from "../data"

export function DeadlineEntryForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    section: "",
    date: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, section: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.section || !formData.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addDeadline({
        id: Date.now().toString(),
        section: formData.section,
        date: new Date(formData.date).toISOString(),
        description: formData.description || "No description provided",
      })

      toast({
        title: "Success",
        description: "Deadline added successfully",
      })

      // Reset form
      setFormData({
        section: "",
        date: "",
        description: "",
      })

      // Notify parent component of success
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add deadline",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format today's date for the min attribute of the date input
  const today = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="section">NEA Section</Label>
        <Select value={formData.section} onValueChange={handleSelectChange}>
          <SelectTrigger id="section">
            <SelectValue placeholder="Select NEA section" />
          </SelectTrigger>
          <SelectContent>
            {neaCriteria.map((criteria) => (
              <SelectItem key={criteria.id} value={criteria.id}>
                {criteria.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Deadline Date</Label>
        <Input id="date" name="date" type="date" min={today} value={formData.date} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter additional details about this deadline"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Deadline"}
      </Button>
    </form>
  )
}
