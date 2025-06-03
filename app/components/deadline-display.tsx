"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, isPast, isToday } from "date-fns"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { neaSections } from "../data"

export type Deadline = {
  id: string
  sectionId: string
  date: string // ISO date string
  description: string
}

export function DeadlineDisplay({ showAll = false }: { showAll?: boolean }) {
  const [deadlines, setDeadlines] = useState<Deadline[]>([])

  useEffect(() => {
    try {
      // Load deadlines from localStorage
      const savedDeadlines = localStorage.getItem("nea-tracker-deadlines")
      if (savedDeadlines) {
        const parsedDeadlines = JSON.parse(savedDeadlines)
        // Ensure we have the correct data structure
        const validDeadlines = Array.isArray(parsedDeadlines)
          ? parsedDeadlines.filter((d) => d && d.sectionId && d.date)
          : []
        setDeadlines(validDeadlines)
      }
    } catch (error) {
      console.error("Error loading deadlines:", error)
      setDeadlines([])
    }
  }, [])

  // Sort deadlines by date (ascending)
  const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Filter deadlines based on showAll prop
  const now = new Date()
  const twoWeeksFromNow = new Date()
  twoWeeksFromNow.setDate(now.getDate() + 14)

  const filteredDeadlines = showAll
    ? sortedDeadlines
    : sortedDeadlines.filter((deadline) => {
        const deadlineDate = new Date(deadline.date)
        return deadlineDate >= now && deadlineDate <= twoWeeksFromNow
      })

  if (filteredDeadlines.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          {showAll ? "All NEA Deadlines" : "Upcoming NEA Deadlines"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredDeadlines.map((deadline) => {
            const deadlineDate = new Date(deadline.date)
            const isPastDeadline = isPast(deadlineDate) && !isToday(deadlineDate)
            const isTodayDeadline = isToday(deadlineDate)
            const section = neaSections.find((s) => s.id === deadline.sectionId)

            return (
              <div
                key={deadline.id}
                className={cn(
                  "p-3 border rounded-md flex items-start space-x-3",
                  isPastDeadline && "border-destructive/50 bg-destructive/5",
                  isTodayDeadline && "border-warning/50 bg-warning/5",
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-full",
                    isPastDeadline ? "bg-destructive/10" : isTodayDeadline ? "bg-warning/10" : "bg-primary/10",
                  )}
                >
                  {isPastDeadline ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : isTodayDeadline ? (
                    <Clock className="h-4 w-4 text-warning" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <p className="font-medium">{section?.name || "Unknown Section"}</p>
                    <p
                      className={cn(
                        "text-sm",
                        isPastDeadline
                          ? "text-destructive"
                          : isTodayDeadline
                            ? "text-warning font-medium"
                            : "text-muted-foreground",
                      )}
                    >
                      {isPastDeadline ? "Overdue: " : isTodayDeadline ? "Due today: " : ""}
                      {format(deadlineDate, "PPP")}
                    </p>
                  </div>
                  <p className="text-sm mt-1">{deadline.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
