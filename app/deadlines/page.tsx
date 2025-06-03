"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Clock, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { neaSections } from "../data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type Deadline = {
  id: string
  sectionId: string
  date: string // ISO date string
  description: string
}

export default function DeadlinesPage() {
  const { toast } = useToast()
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [newDeadline, setNewDeadline] = useState<{
    sectionId: string
    date: Date | undefined
    description: string
  }>({
    sectionId: "",
    date: undefined,
    description: "",
  })

  // Load deadlines from localStorage on component mount
  useEffect(() => {
    try {
      const savedDeadlines = localStorage.getItem("nea-tracker-deadlines")
      if (savedDeadlines) {
        const parsedDeadlines = JSON.parse(savedDeadlines)
        // Ensure we have the correct data structure
        const validDeadlines = Array.isArray(parsedDeadlines)
          ? parsedDeadlines.filter((d) => d && d.sectionId && d.date)
          : []
        setDeadlines(validDeadlines)

        if (validDeadlines.length !== parsedDeadlines.length) {
          // Some deadlines were filtered out due to invalid structure
          localStorage.setItem("nea-tracker-deadlines", JSON.stringify(validDeadlines))
        }
      }
    } catch (error) {
      console.error("Error loading deadlines:", error)
      toast({
        title: "Error loading deadlines",
        description: "There was a problem loading your deadlines. Please try refreshing the page.",
        variant: "destructive",
      })
      // Reset to empty array on error
      setDeadlines([])
    }
  }, [toast])

  // Save deadlines to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("nea-tracker-deadlines", JSON.stringify(deadlines))
    } catch (error) {
      console.error("Error saving deadlines:", error)
      toast({
        title: "Error saving deadlines",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      })
    }
  }, [deadlines, toast])

  const handleAddDeadline = () => {
    if (!newDeadline.sectionId || !newDeadline.date || !newDeadline.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to add a deadline.",
        variant: "destructive",
      })
      return
    }

    try {
      const deadline: Deadline = {
        id: Date.now().toString(),
        sectionId: newDeadline.sectionId,
        date: newDeadline.date.toISOString(),
        description: newDeadline.description,
      }

      setDeadlines([...deadlines, deadline])
      setNewDeadline({
        sectionId: "",
        date: undefined,
        description: "",
      })

      toast({
        title: "Deadline added",
        description: "The deadline has been successfully added.",
      })
    } catch (error) {
      console.error("Error adding deadline:", error)
      toast({
        title: "Error adding deadline",
        description: "There was a problem adding the deadline. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDeadline = (id: string) => {
    try {
      setDeadlines(deadlines.filter((deadline) => deadline.id !== id))
      toast({
        title: "Deadline deleted",
        description: "The deadline has been successfully removed.",
      })
    } catch (error) {
      console.error("Error deleting deadline:", error)
      toast({
        title: "Error deleting deadline",
        description: "There was a problem deleting the deadline. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Group deadlines by section
  const deadlinesBySection = deadlines.reduce(
    (acc, deadline) => {
      const section = acc.find((s) => s.id === deadline.sectionId)
      if (section) {
        section.deadlines.push(deadline)
      } else {
        const neaSection = neaSections.find((s) => s.id === deadline.sectionId)
        if (neaSection) {
          acc.push({
            id: deadline.sectionId,
            name: neaSection.name,
            deadlines: [deadline],
          })
        }
      }
      return acc
    },
    [] as { id: string; name: string; deadlines: Deadline[] }[],
  )

  // Sort deadlines by date (ascending)
  const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get upcoming deadlines (next 7 days)
  const now = new Date()
  const oneWeekFromNow = new Date()
  oneWeekFromNow.setDate(now.getDate() + 7)

  const upcomingDeadlines = sortedDeadlines.filter((deadline) => {
    const deadlineDate = new Date(deadline.date)
    return deadlineDate >= now && deadlineDate <= oneWeekFromNow
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">NEA Deadlines Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Deadline</CardTitle>
            <CardDescription>Set deadlines for NEA sections to help students stay on track</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="section">NEA Section</Label>
              <Select
                value={newDeadline.sectionId}
                onValueChange={(value) => setNewDeadline({ ...newDeadline, sectionId: value })}
              >
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
              <Label htmlFor="date">Deadline Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newDeadline.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newDeadline.date ? format(newDeadline.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newDeadline.date}
                    onSelect={(date) => setNewDeadline({ ...newDeadline, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="E.g., Submit initial design ideas"
                value={newDeadline.description}
                onChange={(e) => setNewDeadline({ ...newDeadline, description: e.target.value })}
              />
            </div>

            <Button onClick={handleAddDeadline} className="w-full">
              Add Deadline
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Deadlines due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => {
                  const section = neaSections.find((s) => s.id === deadline.sectionId)
                  return (
                    <div key={deadline.id} className="flex items-start space-x-4 p-3 border rounded-md">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{section?.name || "Unknown Section"}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(deadline.date), "PPP")}</p>
                        <p className="text-sm mt-1">{deadline.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming deadlines in the next 7 days.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Deadlines</CardTitle>
          <CardDescription>Manage all NEA section deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          {deadlines.length > 0 ? (
            <div className="space-y-6">
              {deadlinesBySection.map((section) => (
                <div key={section.id} className="space-y-3">
                  <h3 className="text-lg font-medium">{section.name}</h3>
                  <div className="space-y-2">
                    {section.deadlines
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((deadline) => (
                        <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{format(new Date(deadline.date), "PPP")}</span>
                            </div>
                            <p className="text-sm mt-1">{deadline.description}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteDeadline(deadline.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No deadlines have been set yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
