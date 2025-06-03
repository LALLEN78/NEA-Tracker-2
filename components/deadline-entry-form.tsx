"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { neaSections } from "@/app/data"

export function DeadlineEntryForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    sectionId: "",
    date: undefined as Date | undefined,
    description: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error("Deadline title is required")
      }

      if (!formData.sectionId) {
        throw new Error("Please select a section")
      }

      if (!formData.date) {
        throw new Error("Please select a date")
      }

      // Get existing deadlines
      const existingDeadlines = JSON.parse(localStorage.getItem("nea-tracker-deadlines") || "[]")

      // Create new deadline
      const newDeadline = {
        id: Date.now().toString(),
        sectionId: formData.sectionId,
        date: formData.date.toISOString(),
        description: formData.description || "No description provided",
      }

      // Add to deadlines array
      const updatedDeadlines = [...existingDeadlines, newDeadline]

      // Save to localStorage
      localStorage.setItem("nea-tracker-deadlines", JSON.stringify(updatedDeadlines))

      // Show success message
      toast({
        title: "Success",
        description: "Deadline added successfully!",
      })

      // Reset form
      setFormData({
        title: "",
        sectionId: "",
        date: undefined,
        description: "",
      })

      // Call callback
      if (onSuccess) {
        onSuccess()
      }

      // Notify parent window if in secondary screen
      if (window.opener) {
        window.opener.postMessage({ type: "DEADLINE_ADDED", deadline: newDeadline }, "*")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add deadline",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Deadline Title</Label>
        <input
          id="title"
          className="w-full p-2 border rounded-md"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Complete Analysis Section"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="section">NEA Section</Label>
        <Select value={formData.sectionId} onValueChange={(value) => setFormData({ ...formData, sectionId: value })}>
          <SelectTrigger id="section">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            {neaSections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? format(formData.date, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => setFormData({ ...formData, date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add details about this deadline..."
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding Deadline..." : "Add Deadline"}
      </Button>
    </form>
  )
}
