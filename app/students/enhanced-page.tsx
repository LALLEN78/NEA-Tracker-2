"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Search, UserPlus, AlertTriangle, Heart, Brain, TrendingUp } from "lucide-react"

interface StudentData {
  id: string
  name: string
  surname: string
  forename: string
  regGroup: string
  sex: string
  fsm: string
  examNo: string
  senStatus: string
  class: string
  lookedAfter: string
  pupilPremium: string
  priorAttainment: string
  catScore: string
  readingAge: string
  y9Grade: string
  ks4Target: string
  neaScores: {
    sectionA: number
    sectionB: number
    sectionC: number
    sectionD: number
    sectionE: number
    sectionF: number
  }
  neaProgress: {
    sectionA: number
    sectionB: number
    sectionC: number
    sectionD: number
    sectionE: number
    sectionF: number
  }
}

export default function EnhancedStudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [senFilter, setSenFilter] = useState("all")
  const [fsmFilter, setFsmFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)

  useEffect(() => {
    const savedStudents = localStorage.getItem("nea-tracker-students")
    if (savedStudents) {
      const parsedStudents = JSON.parse(savedStudents)
      setStudents(parsedStudents)
      setFilteredStudents(parsedStudents)
    }
  }, [])

  useEffect(() => {
    let filtered = students

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.examNo.includes(searchTerm),
      )
    }

    // Class filter
    if (classFilter !== "all") {
      filtered = filtered.filter((student) => student.class === classFilter)
    }

    // SEN filter
    if (senFilter !== "all") {
      if (senFilter === "sen") {
        filtered = filtered.filter((student) => student.senStatus && student.senStatus !== "")
      } else if (senFilter === "no-sen") {
        filtered = filtered.filter((student) => !student.senStatus || student.senStatus === "")
      }
    }

    // FSM filter
    if (fsmFilter !== "all") {
      filtered = filtered.filter((student) => student.fsm === fsmFilter)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, classFilter, senFilter, fsmFilter])

  const getUniqueClasses = () => {
    return [...new Set(students.map((s) => s.class).filter(Boolean))]
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getGradeColor = (grade: string) => {
    const gradeNum = Number.parseInt(grade)
    if (gradeNum >= 7) return "bg-green-500"
    if (gradeNum >= 5) return "bg-yellow-500"
    if (gradeNum >= 4) return "bg-orange-500"
    return "bg-red-500"
  }

  const calculateNEATotal = (scores: any) => {
    return Object.values(scores).reduce((sum: number, score: any) => sum + (score || 0), 0)
  }

  const calculateNEAProgress = (progress: any) => {
    const values = Object.values(progress) as number[]
    return values.reduce((sum, prog) => sum + prog, 0) / values.length
  }

  const getSupportNeeds = (student: StudentData) => {
    const needs = []
    if (student.fsm === "Y") needs.push({ type: "FSM", color: "bg-blue-500", icon: Heart })
    if (student.senStatus && student.senStatus !== "") needs.push({ type: "SEN", color: "bg-purple-500", icon: Brain })
    if (student.pupilPremium === "Y") needs.push({ type: "PP", color: "bg-green-500", icon: TrendingUp })
    if (student.lookedAfter === "Y") needs.push({ type: "LAC", color: "bg-red-500", icon: Heart })
    return needs
  }

  const getReadingAgeStatus = (readingAge: string, chronologicalAge = 16) => {
    if (!readingAge) return null

    const [years, months] = readingAge.split(":").map(Number)
    const readingAgeInYears = years + months / 12

    if (readingAgeInYears >= chronologicalAge) return "on-track"
    if (readingAgeInYears >= chronologicalAge - 1) return "below"
    return "concern"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Comprehensive student management with demographics, prior attainment, and progress tracking
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">FSM Students</p>
                <p className="text-2xl font-bold">{students.filter((s) => s.fsm === "Y").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">SEN Students</p>
                <p className="text-2xl font-bold">{students.filter((s) => s.senStatus && s.senStatus !== "").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pupil Premium</p>
                <p className="text-2xl font-bold">{students.filter((s) => s.pupilPremium === "Y").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {getUniqueClasses().map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={senFilter} onValueChange={setSenFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="SEN Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SEN</SelectItem>
                <SelectItem value="sen">SEN Only</SelectItem>
                <SelectItem value="no-sen">No SEN</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fsmFilter} onValueChange={setFsmFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="FSM Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All FSM</SelectItem>
                <SelectItem value="Y">FSM Yes</SelectItem>
                <SelectItem value="N">FSM No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student List ({filteredStudents.length})</CardTitle>
          <CardDescription>
            Comprehensive view of all students with key information and progress indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Support Needs</TableHead>
                  <TableHead>Prior Attainment</TableHead>
                  <TableHead>Reading Age</TableHead>
                  <TableHead>KS4 Target</TableHead>
                  <TableHead>NEA Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const supportNeeds = getSupportNeeds(student)
                  const neaProgress = calculateNEAProgress(student.neaProgress)
                  const readingStatus = getReadingAgeStatus(student.readingAge)

                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.regGroup} • {student.examNo}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">{student.class}</Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-1">
                          {supportNeeds.map((need, index) => (
                            <Badge key={index} className={`${need.color} text-white text-xs`}>
                              {need.type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            student.priorAttainment === "HPA"
                              ? "default"
                              : student.priorAttainment === "MPA"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {student.priorAttainment}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{student.readingAge}</span>
                          {readingStatus === "concern" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getGradeColor(student.ks4Target)}`}
                        >
                          {student.ks4Target}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={neaProgress} className="w-16" />
                          <span className="text-sm">{Math.round(neaProgress)}%</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
