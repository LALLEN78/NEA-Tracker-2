"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Upload, Users } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [studentCount, setStudentCount] = useState(0)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    // Check if we have any student data
    try {
      const students = JSON.parse(localStorage.getItem("nea-tracker-students") || "[]")
      setStudentCount(students.length)
      setHasData(students.length > 0)
    } catch (error) {
      console.error("Error loading student data:", error)
      setStudentCount(0)
      setHasData(false)
    }
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the NEA Coursework Tracker</p>
        </div>
        <Button asChild>
          <Link href="/progress">View Progress</Link>
        </Button>
      </div>

      {/* Always show zero values until data is imported */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{studentCount}</div>
            <p className="text-xs text-muted-foreground">
              {hasData ? `Students imported` : "No students imported yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">No progress data yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Students On Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0/{studentCount}</div>
            <p className="text-xs text-muted-foreground">No target data yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Improvement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">No comparison data yet</p>
          </CardContent>
        </Card>
      </div>

      {!hasData ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Import your student data to begin tracking NEA progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Upload className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No student data yet</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                Import your student data to see dashboard analytics and track NEA progress.
              </p>
              <Button asChild>
                <Link href="/data-import">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Import Students
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
            <CardDescription>Your imported students are ready for progress tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">{studentCount} Students Imported</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                Start entering NEA scores and tracking progress for your students.
              </p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/progress">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Enter Scores
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/students">View Students</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Progress by NEA Section</CardTitle>
          <CardDescription>Average completion percentage across all students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No progress data yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
              {hasData
                ? "Enter NEA scores to see section progress analytics."
                : "Import students and enter NEA scores to see section progress analytics."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
