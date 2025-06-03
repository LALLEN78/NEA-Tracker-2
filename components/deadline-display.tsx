"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, AlertTriangle, CheckCircle } from "lucide-react"

// Define the deadline type
type Deadline = {
  sectionId: string
  date: string // ISO date string
  description?: string
}

export function DeadlineDisplay() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])

  // Load deadlines from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDeadlines = localStorage.getItem("nea-tracker-deadlines")
      if (savedDeadlines) {
        try {
          setDeadlines(JSON.parse(savedDeadlines))
        } catch (error) {
          console.error("Error parsing deadlines:", error)
          setDeadlines([])
        }
      } else {
        // Set some example deadlines if none exist
        const exampleDeadlines: Deadline[] = [
          {
            sectionId: "section-a",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            description: "Complete Section A research",
          },
          {
            sectionId: "section-b",
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
            description: "Submit design brief and specification",
          },
          {
            sectionId: "section-c",
            date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
            description: "Complete initial design ideas",
          },
        ]
        setDeadlines(exampleDeadlines)
        localStorage.setItem("nea-tracker-deadlines", JSON.stringify(exampleDeadlines))
      }
    }
  }, [])

  // Function to get the status of a deadline
  const getDeadlineStatus = (deadline: Deadline) => {
    const now = new Date()
    const deadlineDate = new Date(deadline.date)
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return {
        status: "overdue",
        text: "Overdue",
        icon: AlertTriangle,
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      }
    } else if (diffDays <= 7) {
      return {
        status: "upcoming",
        text: `${diffDays} day${diffDays !== 1 ? "s" : ""} left`,
        icon: CalendarDays,
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      }
    } else {
      return {
        status: "future",
        text: `${diffDays} days left`,
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      }
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get section name from ID
  const getSectionName = (sectionId: string) => {
    const sectionMap = {
      "section-a": "Section A: Identifying & Investigating Design Possibilities",
      "section-b": "Section B: Producing a Design Brief & Specification",
      "section-c": "Section C: Generating Design Ideas",
      "section-d": "Section D: Developing Design Ideas",
      "section-e": "Section E: Realising Design Ideas",
      "section-f": "Section F: Analysing & Evaluating",
    }
    return sectionMap[sectionId as keyof typeof sectionMap] || sectionId
  }

  // Sort deadlines by date
  const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedDeadlines.length > 0 ? (
          <div className="space-y-4">
            {sortedDeadlines.map((deadline, index) => {
              const { status, text, icon: Icon, color } = getDeadlineStatus(deadline)
              return (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-medium">{getSectionName(deadline.sectionId)}</h3>
                    <p className="text-sm text-muted-foreground">{deadline.description}</p>
                    <p className="text-sm mt-1">{formatDate(deadline.date)}</p>
                  </div>
                  <Badge variant="outline" className={`flex items-center ${color}`}>
                    <Icon className="mr-1 h-3 w-3" />
                    {text}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No deadlines set. Add deadlines from the settings page.</p>
        )}
      </CardContent>
    </Card>
  )
}
