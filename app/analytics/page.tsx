"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Download,
  FileSpreadsheet,
  Filter,
  PieChartIcon,
  BarChartIcon,
  LineChartIcon,
  GraduationCap,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Percent,
  Target,
  Calendar,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format, parseISO } from "date-fns"
import Link from "next/link"

// Default NEA and exam weights
const DEFAULT_NEA_WEIGHT = 50
const DEFAULT_EXAM_WEIGHT = 50

// Grade boundaries (simplified for demo)
// Update the grade boundaries to use raw scores from the AQA document
const GRADE_BOUNDARIES = {
  9: 174,
  8: 159,
  7: 145,
  6: 129,
  5: 112,
  4: 96,
  3: 71,
  2: 46,
  1: 21,
}

export default function AnalyticsPage() {
  const [gradeBoundaries, setGradeBoundaries] = useState(() => {
    if (typeof window !== "undefined") {
      const savedBoundaries = localStorage.getItem("nea-tracker-grade-boundaries")
      if (savedBoundaries) {
        return JSON.parse(savedBoundaries)
      }
    }
    return {
      nea: GRADE_BOUNDARIES,
      exam: GRADE_BOUNDARIES,
      overall: GRADE_BOUNDARIES,
    }
  })

  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState("all")
  const [neaWeight, setNeaWeight] = useState(DEFAULT_NEA_WEIGHT)
  const [examWeight, setExamWeight] = useState(DEFAULT_EXAM_WEIGHT)
  const [showTargetComparison, setShowTargetComparison] = useState(true)
  // Add a toggle for showing levels or percentages
  // Add this after the showTargetComparison state
  const [showLevels, setShowLevels] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [chartType, setChartType] = useState("bar")
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditingBoundaries, setIsEditingBoundaries] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load students from localStorage
  useEffect(() => {
    setIsLoading(true)
    try {
      if (typeof window !== "undefined") {
        const savedStudents = localStorage.getItem("nea-tracker-students")
        const savedBoundaries = localStorage.getItem("nea-tracker-grade-boundaries")

        if (savedStudents) {
          try {
            const parsedStudents = JSON.parse(savedStudents)
            console.log("Loaded students:", parsedStudents) // Debug log
            setStudents(parsedStudents)
          } catch (error) {
            console.error("Error parsing students data:", error)
            setStudents([])
          }
        }

        if (savedBoundaries) {
          try {
            setGradeBoundaries(JSON.parse(savedBoundaries))
          } catch (error) {
            console.error("Error parsing grade boundaries:", error)
          }
        }
      }
    } catch (err) {
      setError("Failed to load student data")
      console.error("Error loading data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Calculate prediction for a student
  function calculatePrediction(student, neaWeightParam = DEFAULT_NEA_WEIGHT, examWeightParam = DEFAULT_EXAM_WEIGHT) {
    // Handle different data structures
    let neaPercentage = 0
    let mockPercentage = 0

    // Try to get NEA percentage from different possible sources
    if (student.neaPercentage !== undefined) {
      neaPercentage = student.neaPercentage
    } else if (student.sections && Array.isArray(student.sections) && student.sections.length > 0) {
      const totalMarks = student.sections.reduce((sum, section) => sum + (section.marks || 0), 0)
      const totalPossible = student.sections.reduce((sum, section) => sum + (section.total || section.maxMarks || 0), 0)
      neaPercentage = totalPossible > 0 ? Math.round((totalMarks / totalPossible) * 100) : 0
    } else if (student.progress !== undefined) {
      neaPercentage = student.progress
    }

    // Try to get mock percentage from different possible sources
    if (student.mockPercentage !== undefined) {
      mockPercentage = student.mockPercentage
    } else if (student.mockExam !== undefined) {
      mockPercentage = student.mockExam
    } else if (student.examScore !== undefined) {
      mockPercentage = student.examScore
    } else {
      // Default to NEA percentage if no mock data
      mockPercentage = neaPercentage
    }

    // Calculate overall percentage (weighted average)
    const overallPercentage = Math.round(
      neaPercentage * (neaWeightParam / 100) + mockPercentage * (examWeightParam / 100),
    )

    // Determine predicted grade based on overall percentage
    let predictedGrade = 1
    for (let grade = 9; grade >= 1; grade--) {
      if (overallPercentage >= gradeBoundaries.overall[grade] / 2) {
        // Convert to percentage
        predictedGrade = grade
        break
      }
    }

    // Determine NEA grade
    let neaGrade = 1
    for (let grade = 9; grade >= 1; grade--) {
      if (neaPercentage >= gradeBoundaries.nea[grade] / 2) {
        neaGrade = grade
        break
      }
    }

    // Determine exam grade
    let examGrade = 1
    for (let grade = 9; grade >= 1; grade--) {
      if (mockPercentage >= gradeBoundaries.exam[grade] / 2) {
        examGrade = grade
        break
      }
    }

    return {
      ...student,
      neaPercentage,
      mockPercentage,
      overallPercentage,
      predictedGrade,
      neaGrade,
      examGrade,
    }
  }

  // Filter students based on selected class and search query
  const filteredStudents = students
    .filter((student) => {
      const matchesClass = selectedClass === "all" || student.class === selectedClass
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesClass && matchesSearch
    })
    .map((student) => calculatePrediction(student, neaWeight, examWeight))

  // Calculate class statistics
  const classStats = {
    averageNEA: Math.round(
      filteredStudents.reduce((sum, student) => sum + student.neaPercentage, 0) / filteredStudents.length || 0,
    ),
    averageMock: Math.round(
      filteredStudents.reduce((sum, student) => sum + student.mockPercentage, 0) / filteredStudents.length || 0,
    ),
    averageOverall: Math.round(
      filteredStudents.reduce((sum, student) => sum + student.overallPercentage, 0) / filteredStudents.length || 0,
    ),
    averagePredicted: Math.round(
      filteredStudents.reduce((sum, student) => sum + student.predictedGrade, 0) / filteredStudents.length || 0,
    ),
    totalStudents: filteredStudents.length,
    onTarget: filteredStudents.filter((student) => student.predictedGrade >= student.target).length || 0,
    belowTarget: filteredStudents.filter((student) => student.predictedGrade < student.target).length || 0,
  }

  // Calculate grade distribution
  const gradeDistribution = Array.from({ length: 9 }, (_, i) => ({
    grade: 9 - i,
    count: filteredStudents.filter((student) => student.predictedGrade === 9 - i).length,
    percentage:
      Math.round(
        (filteredStudents.filter((student) => student.predictedGrade === 9 - i).length / filteredStudents.length) * 100,
      ) || 0,
  }))

  // Calculate target vs predicted
  const targetVsPredicted = [
    {
      name: "Above Target",
      value: filteredStudents.filter((student) => student.predictedGrade > student.target).length,
    },
    {
      name: "On Target",
      value: filteredStudents.filter((student) => student.predictedGrade === student.target).length,
    },
    {
      name: "Below Target",
      value: filteredStudents.filter((student) => student.predictedGrade < student.target).length,
    },
  ]

  // Calculate section performance
  const sectionPerformance = []
  if (filteredStudents.length > 0 && filteredStudents[0].sections) {
    // Get all unique section names
    const sectionNames = [
      ...new Set(
        filteredStudents.flatMap((student) =>
          student.sections ? student.sections.map((section) => section.name) : [],
        ),
      ),
    ].sort()

    // Calculate average performance for each section
    sectionNames.forEach((sectionName) => {
      let totalProgress = 0
      let count = 0

      filteredStudents.forEach((student) => {
        if (student.sections) {
          const section = student.sections.find((s) => s.name === sectionName)
          if (section) {
            totalProgress += section.progress
            count++
          }
        }
      })

      const averageProgress = count > 0 ? Math.round(totalProgress / count) : 0

      // Get the deadline for this section (assuming all students have the same deadline for a section)
      let deadline = null
      for (const student of filteredStudents) {
        if (student.sections) {
          const section = student.sections.find((s) => s.name === sectionName)
          if (section && section.deadline) {
            deadline = section.deadline
            break
          }
        }
      }

      sectionPerformance.push({
        name: `Section ${sectionName}`,
        average: averageProgress,
        deadline: deadline,
      })
    })
  }

  // Colors for charts
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]
  const TARGET_COLORS = {
    "Above Target": "#10b981",
    "On Target": "#4f46e5",
    "Below Target": "#ef4444",
  }

  // Handle weight change
  const handleWeightChange = (value, type) => {
    if (type === "nea") {
      setNeaWeight(value)
      setExamWeight(100 - value)
    } else {
      setExamWeight(value)
      setNeaWeight(100 - value)
    }
  }

  // Handle export to CSV
  const exportToCSV = () => {
    // Create CSV header
    const header = [
      "ID",
      "Name",
      "Class",
      "Target Grade",
      "NEA %",
      "Mock Exam %",
      "Overall %",
      "Predicted Grade",
      "On Target",
    ].join(",")

    // Create CSV rows
    const rows = filteredStudents.map((student) => {
      return [
        student.id,
        student.name,
        student.class,
        student.target,
        student.neaPercentage,
        student.mockPercentage,
        student.overallPercentage,
        student.predictedGrade,
        student.predictedGrade >= student.target ? "Yes" : "No",
      ].join(",")
    })

    // Combine header and rows
    const csv = [header, ...rows].join("\n")

    // Create a blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `class_predictions_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: "The data has been exported to CSV.",
    })
  }

  // Update grade boundaries
  const updateGradeBoundary = (grade, value) => {
    setGradeBoundaries((prev) => ({
      ...prev,
      [grade]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Predictions</h1>
          <p className="text-muted-foreground">Analyze student performance and predict grades</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading student data...</p>
          </div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p>{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Student Data Found</h3>
              <p className="text-muted-foreground mb-4">Add some students first to see analytics and predictions.</p>
              <Button asChild>
                <Link href="/students">Add Students</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Predicted Grade</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classStats.averagePredicted.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Based on {classStats.totalStudents} students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average NEA Score</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classStats.averageNEA}%</div>
                <p className="text-xs text-muted-foreground">Weighted at {neaWeight}% of final grade</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students On/Above Target</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classStats.onTarget}</div>
                <p className="text-xs text-muted-foreground">
                  {classStats.totalStudents > 0
                    ? `${Math.round((classStats.onTarget / classStats.totalStudents) * 100)}% of class`
                    : "No students"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Below Target</CardTitle>
                <ArrowDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classStats.belowTarget}</div>
                <p className="text-xs text-muted-foreground">
                  {classStats.totalStudents > 0
                    ? `${Math.round((classStats.belowTarget / classStats.totalStudents) * 100)}% of class`
                    : "No students"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-5">
              <CardHeader>
                <CardTitle>Grade Predictions</CardTitle>
                <CardDescription>Analysis of predicted grades based on NEA and mock exam performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[200px]"
                    />
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="11A">Class 11A</SelectItem>
                        <SelectItem value="11B">Class 11B</SelectItem>
                        <SelectItem value="11C">Class 11C</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={chartType === "bar" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setChartType("bar")}
                    >
                      <BarChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "pie" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setChartType("pie")}
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "line" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setChartType("line")}
                    >
                      <LineChartIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="h-[300px]">
                  {chartType === "bar" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={gradeDistribution}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grade" label={{ value: "Grade", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "Number of Students", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Number of Students" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {chartType === "pie" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={targetVsPredicted}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {targetVsPredicted.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={TARGET_COLORS[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}

                  {chartType === "line" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={sectionPerformance}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          domain={[0, 100]}
                          label={{ value: "Average Progress (%)", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="average"
                          name="Average Progress"
                          stroke="#4f46e5"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Prediction Settings</CardTitle>
                <CardDescription>Adjust weights and parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>NEA Weight: {neaWeight}%</Label>
                    </div>
                    <Slider
                      value={[neaWeight]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleWeightChange(value[0], "nea")}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Exam Weight: {examWeight}%</Label>
                    </div>
                    <Slider
                      value={[examWeight]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleWeightChange(value[0], "exam")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="target-comparison"
                      checked={showTargetComparison}
                      onCheckedChange={setShowTargetComparison}
                    />
                    <Label htmlFor="target-comparison">Show target comparison</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch id="show-levels" checked={showLevels} onCheckedChange={setShowLevels} />
                    <Label htmlFor="show-levels">Show {showLevels ? "Levels" : "Percentages"}</Label>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setNeaWeight(DEFAULT_NEA_WEIGHT)
                      setExamWeight(DEFAULT_EXAM_WEIGHT)
                    }}
                  >
                    Reset to Defaults
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsEditingBoundaries(!isEditingBoundaries)}
                  >
                    {isEditingBoundaries ? "Hide Grade Boundaries" : "Edit Grade Boundaries"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {process.env.NODE_ENV === "development" && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Debug Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total students loaded: {students.length}</p>
                <p>Filtered students: {filteredStudents.length}</p>
                <p>Selected class: {selectedClass}</p>
                {students.length > 0 && (
                  <details>
                    <summary>Sample student data:</summary>
                    <pre className="text-xs mt-2 p-2 bg-muted rounded">{JSON.stringify(students[0], null, 2)}</pre>
                  </details>
                )}
              </CardContent>
            </Card>
          )}

          {isEditingBoundaries && (
            <Card>
              <CardHeader>
                <CardTitle>Grade Boundaries</CardTitle>
                <CardDescription>Adjust grade boundaries for predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {Object.entries(gradeBoundaries.overall)
                    .sort(([, valueA], [, valueB]) => valueB - valueA)
                    .map(([grade, marks]) => (
                      <div key={grade} className="space-y-2">
                        <Label htmlFor={`grade-${grade}`}>Grade {grade}</Label>
                        <Input
                          id={`grade-${grade}`}
                          type="number"
                          value={marks}
                          onChange={(e) => {
                            const newMarks = Number(e.target.value)
                            setGradeBoundaries((prev) => ({
                              ...prev,
                              overall: {
                                ...prev.overall,
                                [grade]: newMarks,
                              },
                              nea: {
                                ...prev.nea,
                                [grade]: newMarks,
                              },
                              exam: {
                                ...prev.exam,
                                [grade]: newMarks,
                              },
                            }))
                          }}
                          min={0}
                          max={200}
                        />
                        <p className="text-xs text-muted-foreground">{Math.round(marks / 2)}% required</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Section Performance Analysis</CardTitle>
              <CardDescription>Average progress across NEA sections with deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Average Progress</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectionPerformance.map((section, index) => {
                      // Determine status based on average progress
                      let status = "In Progress"
                      let variant = "outline"

                      if (section.average >= 90) {
                        status = "Excellent"
                        variant = "success"
                      } else if (section.average >= 70) {
                        status = "Good"
                        variant = "success"
                      } else if (section.average >= 50) {
                        status = "Satisfactory"
                        variant = "outline"
                      } else if (section.average >= 30) {
                        status = "Needs Improvement"
                        variant = "warning"
                      } else {
                        status = "Concerning"
                        variant = "destructive"
                      }

                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{section.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-[100px] bg-muted rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: `${section.average}%` }}
                                ></div>
                              </div>
                              <span>{section.average}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {section.deadline ? (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{format(parseISO(section.deadline), "MMM d, yyyy")}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No deadline set</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={variant}>{status}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Predictions</CardTitle>
              <CardDescription>Individual student grade predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          NEA %
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>NEA Grade</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Mock %
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Mock Grade</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Overall %
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Predicted
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.neaPercentage}%</TableCell>
                        <TableCell>{student.neaGrade}</TableCell>
                        <TableCell>{student.mockPercentage}%</TableCell>
                        <TableCell>{student.examGrade}</TableCell>
                        <TableCell>{student.overallPercentage}%</TableCell>
                        <TableCell>{student.predictedGrade}</TableCell>
                        <TableCell>{student.target}</TableCell>
                        <TableCell>
                          {student.predictedGrade > student.target ? (
                            <Badge variant="success" className="flex items-center gap-1">
                              <ArrowUp className="h-3 w-3" /> Above Target
                            </Badge>
                          ) : student.predictedGrade === student.target ? (
                            <Badge variant="outline" className="flex items-center gap-1">
                              On Target
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <ArrowDown className="h-3 w-3" /> Below Target
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
