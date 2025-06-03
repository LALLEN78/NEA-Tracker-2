"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Star, Crown, Plus, Edit, Trash2, Projector, ArrowRight, Target } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function WhiteboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [animateProgress, setAnimateProgress] = useState(false)
  const [showPercentage, setShowPercentage] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [studentScores, setStudentScores] = useState<any>({})

  // Load real student data and scores
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load students from localStorage (your imported data)
      const savedStudents = localStorage.getItem("nea-tracker-students")
      if (savedStudents) {
        try {
          const loadedStudents = JSON.parse(savedStudents)
          setStudents(loadedStudents)
        } catch (error) {
          console.error("Error parsing students:", error)
          setStudents([])
        }
      }

      // Load scores from localStorage
      const savedScores = localStorage.getItem("nea-tracker-scores")
      if (savedScores) {
        try {
          setStudentScores(JSON.parse(savedScores))
        } catch (error) {
          console.error("Error parsing scores:", error)
          setStudentScores({})
        }
      }
    }
  }, [])

  // Trigger animations when tab changes
  useEffect(() => {
    setAnimateProgress(true)
    const timer = setTimeout(() => setAnimateProgress(false), 2000)
    return () => clearTimeout(timer)
  }, [activeTab])

  // Calculate NEA grade from score
  const calculateNeaGrade = (marks: number) => {
    const neaBoundaries = {
      9: 87,
      8: 80,
      7: 75,
      6: 67,
      5: 58,
      4: 50,
      3: 37,
      2: 24,
      1: 11,
      U: 0,
    }
    const grades = Object.keys(neaBoundaries).sort((a, b) => neaBoundaries[b] - neaBoundaries[a])
    for (const grade of grades) {
      if (marks >= neaBoundaries[grade]) {
        return grade === "U" ? 0 : Number.parseInt(grade)
      }
    }
    return 0
  }

  // Calculate exam grade from score
  const calculateExamGrade = (marks: number) => {
    const examBoundaries = {
      9: 87,
      8: 80,
      7: 75,
      6: 67,
      5: 58,
      4: 50,
      3: 37,
      2: 24,
      1: 11,
      U: 0,
    }
    const grades = Object.keys(examBoundaries).sort((a, b) => examBoundaries[b] - examBoundaries[a])
    for (const grade of grades) {
      if (marks >= examBoundaries[grade]) {
        return grade === "U" ? 0 : Number.parseInt(grade)
      }
    }
    return 0
  }

  // Calculate overall grade
  const calculateOverallGrade = (neaMarks: number, examMarks: number) => {
    const neaPercentage = (neaMarks / 100) * 100
    const examPercentage = (examMarks / 200) * 100
    const weightedPercentage = neaPercentage * 0.5 + examPercentage * 0.5
    return calculateNeaGrade(weightedPercentage)
  }

  // Calculate total NEA score
  const calculateTotalNea = (studentId: string) => {
    if (!studentScores[studentId]) return 0
    const neaSections = ["section-a", "section-b", "section-c", "section-d", "section-e", "section-f"]
    return neaSections.reduce((total, section) => {
      return total + (studentScores[studentId][section] || 0)
    }, 0)
  }

  // Calculate total mock score
  const calculateTotalMock = (studentId: string) => {
    if (!studentScores[studentId]) return 0
    const mockSections = [
      "paper-1-section-a",
      "paper-1-section-b",
      "paper-1-section-c",
      "paper-2-section-a",
      "paper-2-section-b",
      "paper-2-section-c",
    ]
    return mockSections.reduce((total, section) => {
      return total + (studentScores[studentId][section] || 0)
    }, 0)
  }

  // Calculate target progress
  const calculateTargetProgress = (student: any) => {
    const neaTotal = calculateTotalNea(student.id)
    const mockTotal = calculateTotalMock(student.id)
    const currentGrade = calculateOverallGrade(neaTotal, mockTotal)
    const targetGrade = student.target || 5

    if (currentGrade >= targetGrade) {
      return {
        percentage: 100,
        status: "exceeding",
        message: `🎉 Exceeding target by ${currentGrade - targetGrade} grade${currentGrade - targetGrade > 1 ? "s" : ""}!`,
        color: "bg-gradient-to-r from-green-400 to-green-500",
        position: 1,
      }
    }

    const gradeGap = targetGrade - currentGrade
    const progressPercentage = Math.max(0, ((9 - gradeGap) / 9) * 100)

    let status = "needs-focus"
    let message = `Need ${gradeGap} more grade${gradeGap > 1 ? "s" : ""} to reach target`
    let color = "bg-gradient-to-r from-red-400 to-red-500"

    if (gradeGap <= 1) {
      status = "on-track"
      message = `So close! Just ${gradeGap} grade to target!`
      color = "bg-gradient-to-r from-blue-400 to-blue-500"
    } else if (gradeGap <= 2) {
      status = "close"
      message = `Getting there! ${gradeGap} grades to target`
      color = "bg-gradient-to-r from-orange-400 to-orange-500"
    }

    return {
      percentage: Math.round(progressPercentage),
      status,
      message,
      color,
      currentGrade,
      targetGrade,
      gradeGap,
    }
  }

  // Get class progress with target tracking
  const getClassProgress = () => {
    if (students.length === 0) return []

    const classes = [...new Set(students.map((s) => s.class || s.regGroup).filter(Boolean))]
    return classes.map((className, index) => {
      const classStudents = students.filter((s) => (s.class || s.regGroup) === className)
      const totalProgress = classStudents.reduce((sum, student) => {
        return sum + calculateTargetProgress(student).percentage
      }, 0)
      const averageProgress = classStudents.length > 0 ? Math.round(totalProgress / classStudents.length) : 0

      return {
        name: className,
        progress: averageProgress,
        color:
          index === 0
            ? "bg-gradient-to-r from-green-400 to-green-500"
            : index === 1
              ? "bg-gradient-to-r from-blue-400 to-blue-500"
              : "bg-gradient-to-r from-purple-400 to-purple-500",
        studentCount: classStudents.length,
        onTrackCount: classStudents.filter(
          (s) => calculateTargetProgress(s).status === "on-track" || calculateTargetProgress(s).status === "exceeding",
        ).length,
      }
    })
  }

  // Get top performers by target progress
  const getTopPerformers = () => {
    if (students.length === 0) return []

    const studentsWithProgress = students.map((student) => ({
      ...student,
      targetProgress: calculateTargetProgress(student),
      neaTotal: calculateTotalNea(student.id),
      mockTotal: calculateTotalMock(student.id),
      avatar: student.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase(),
    }))

    // Sort by target progress percentage (descending)
    studentsWithProgress.sort((a, b) => b.targetProgress.percentage - a.targetProgress.percentage)

    return studentsWithProgress.slice(0, 6).map((student, index) => ({
      ...student,
      rank: index + 1,
    }))
  }

  // Get recent achievements (based on target progress)
  const getRecentAchievements = () => {
    const achievers = students
      .map((student) => ({ student, progress: calculateTargetProgress(student) }))
      .filter(({ progress }) => progress.status === "exceeding" || progress.percentage > 80)
      .slice(0, 5)

    return achievers.map(({ student, progress }, index) => ({
      name: student.name,
      achievement: progress.status === "exceeding" ? "Target Exceeded!" : "Close to Target!",
      icon: progress.status === "exceeding" ? Crown : Star,
      color: progress.status === "exceeding" ? "text-yellow-600" : "text-blue-600",
      bgColor: progress.status === "exceeding" ? "bg-yellow-100" : "bg-blue-100",
    }))
  }

  const classProgress = getClassProgress()
  const topPerformers = getTopPerformers()
  const recentAchievements = getRecentAchievements()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Whiteboard</h1>
          <p className="text-muted-foreground">Track student achievements and display class progress</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center space-x-2 mr-4">
            <Switch id="show-percentage" checked={showPercentage} onCheckedChange={setShowPercentage} />
            <Label htmlFor="show-percentage">Show {showPercentage ? "Percentages" : "Grades"}</Label>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Link href="/whiteboard/projector-view">
              <Projector className="mr-2 h-4 w-4" />
              Projector View
            </Link>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Achievement
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
          >
            Target Progress
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
          >
            Achievements
          </TabsTrigger>
          <TabsTrigger
            value="nea-breakdown"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
          >
            NEA Breakdown
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-blue-200 dark:border-blue-800 shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                <CardTitle>Class Target Progress</CardTitle>
                <CardDescription>How close each class is to their targets</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {classProgress.length > 0 ? (
                    classProgress.map((classItem, index) => (
                      <motion.div
                        key={classItem.name}
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Class {classItem.name}</div>
                          <div className="text-sm text-muted-foreground">{classItem.progress}% to target</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${classItem.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${classItem.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {classItem.onTrackCount}/{classItem.studentCount} students on track
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No student data available. Import students to see class progress.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 dark:border-indigo-800 shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Students closest to or exceeding targets</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {topPerformers.length > 0 ? (
                    topPerformers.slice(0, 3).map((student, index) => (
                      <motion.div
                        key={student.id}
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-white font-bold ${
                            index === 0
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                              : index === 1
                                ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                : "bg-gradient-to-r from-amber-600 to-amber-700"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <Avatar>
                          <AvatarFallback>{student.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.targetProgress.message}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${student.targetProgress.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${student.targetProgress.percentage}%` }}
                                transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                              />
                            </div>
                            <Badge
                              variant={student.targetProgress.status === "exceeding" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              Target: {student.target}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No students available. Import student data to see top performers.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Students making great progress</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {recentAchievements.length > 0 ? (
                    recentAchievements.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className={`h-8 w-8 rounded-full ${item.bgColor} flex items-center justify-center`}>
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.achievement}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No achievements yet!</p>
                      <p className="text-xs">Students will appear here as they progress toward targets.</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link href="/whiteboard/projector-view">
                    View All Progress
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="border-blue-200 dark:border-blue-800 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardTitle>Target Progress Leaderboard</CardTitle>
              <CardDescription>Students ranked by progress toward their individual targets</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {topPerformers.length > 0 ? (
                  topPerformers.map((student, index) => (
                    <motion.div
                      key={student.id}
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                            : index === 1
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                              : index === 2
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{student.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Class {student.class || student.regGroup} • Target: Grade {student.target}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{student.targetProgress.percentage}%</p>
                            <p className="text-sm text-muted-foreground">
                              Current: Grade {calculateOverallGrade(student.neaTotal, student.mockTotal)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${student.targetProgress.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${student.targetProgress.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">{student.targetProgress.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No students available</p>
                    <p>Import student data to see target progress.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <Button variant="outline" asChild className="w-full">
                <Link href="/whiteboard/projector-view?tab=leaderboard">
                  <Projector className="mr-2 h-4 w-4" />
                  Show Target Progress on Projector
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Target Achiever",
                description: "Reached or exceeded their target grade",
                icon: Target,
                color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
                borderColor: "border-green-200 dark:border-green-800",
                students: students.filter((s) => calculateTargetProgress(s).status === "exceeding").length,
              },
              {
                title: "On Track",
                description: "Within 1 grade of their target",
                icon: Star,
                color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
                borderColor: "border-blue-200 dark:border-blue-800",
                students: students.filter((s) => calculateTargetProgress(s).status === "on-track").length,
              },
              {
                title: "Most Improved",
                description: "Greatest improvement in grades",
                icon: Medal,
                color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
                borderColor: "border-purple-200 dark:border-purple-800",
                students: 0,
              },
              {
                title: "Perfect Score",
                description: "Achieved 100% in any section",
                icon: Trophy,
                color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
                borderColor: "border-yellow-200 dark:border-yellow-800",
                students: 0,
              },
              {
                title: "Team Leader",
                description: "Exceptional leadership in group work",
                icon: Crown,
                color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
                borderColor: "border-red-200 dark:border-red-800",
                students: 0,
              },
              {
                title: "Innovation Award",
                description: "Created an innovative solution",
                icon: Star,
                color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200",
                borderColor: "border-indigo-200 dark:border-indigo-800",
                students: 0,
              },
            ].map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`shadow-md border-2 ${achievement.borderColor} hover:shadow-lg transition-shadow`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{achievement.title}</CardTitle>
                      <div className={`rounded-full p-2 ${achievement.color}`}>
                        <achievement.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Awarded to:</div>
                      <Badge variant="outline" className={achievement.borderColor}>
                        {achievement.students} students
                      </Badge>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nea-breakdown" className="space-y-4">
          <Card className="border-blue-200 dark:border-blue-800 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardTitle>NEA Section Breakdown</CardTitle>
              <CardDescription>Detailed overview of each NEA section</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {[
                  {
                    section: "A",
                    title: "Identifying & Investigating",
                    marks: 10,
                    progress:
                      students.length > 0
                        ? Math.round(
                            students.reduce((sum, s) => sum + (calculateTotalNea(s.id) > 0 ? 60 : 0), 0) /
                              students.length,
                          )
                        : 0,
                    description: "Identifying design possibilities and investigating user needs",
                    color: "bg-gradient-to-r from-green-400 to-green-500",
                  },
                  {
                    section: "B",
                    title: "Producing a Design Brief",
                    marks: 10,
                    progress:
                      students.length > 0
                        ? Math.round(
                            students.reduce((sum, s) => sum + (calculateTotalNea(s.id) > 0 ? 45 : 0), 0) /
                              students.length,
                          )
                        : 0,
                    description: "Developing a design brief and specification",
                    color: "bg-gradient-to-r from-blue-400 to-blue-500",
                  },
                  {
                    section: "C",
                    title: "Generating Design Ideas",
                    marks: 20,
                    progress:
                      students.length > 0
                        ? Math.round(
                            students.reduce((sum, s) => sum + (calculateTotalNea(s.id) > 0 ? 35 : 0), 0) /
                              students.length,
                          )
                        : 0,
                    description: "Generating and developing design ideas",
                    color: "bg-gradient-to-r from-purple-400 to-purple-500",
                  },
                  {
                    section: "D",
                    title: "Developing Design Ideas",
                    marks: 20,
                    progress:
                      students.length > 0
                        ? Math.round(
                            students.reduce((sum, s) => sum + (calculateTotalNea(s.id) > 0 ? 25 : 0), 0) /
                              students.length,
                          )
                        : 0,
                    description: "Developing design ideas into a final design solution",
                    color: "bg-gradient-to-r from-pink-400 to-pink-500",
                  },
                  {
                    section: "E",
                    title: "Realising Design Ideas",
                    marks: 20,
                    progress:
                      students.length > 0
                        ? Math.round(
                            students.reduce((sum, s) => sum + (calculateTotalNea(s.id) > 0 ? 15 : 0), 0) /
                              students.length,
                          )
                        : 0,
                    description: "Manufacturing a prototype",
                    color: "bg-gradient-to-r from-yellow-400 to-yellow-500",
                  },
                  {
                    section: "F",
                    title: "Analysing & Evaluating",
                    marks: 20,
                    progress:
                      students.length > 0
                        ? Math.round(
                            students.reduce((sum, s) => sum + (calculateTotalNea(s.id) > 0 ? 10 : 0), 0) /
                              students.length,
                          )
                        : 0,
                    description: "Analysing and evaluating design decisions and prototypes",
                    color: "bg-gradient-to-r from-red-400 to-red-500",
                  },
                ].map((section, index) => (
                  <motion.div
                    key={index}
                    className="space-y-2 p-4 rounded-lg border border-muted hover:bg-muted/5 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white font-bold bg-gradient-to-r from-blue-500 to-indigo-500`}
                      >
                        {section.section}
                      </div>
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-sm text-muted-foreground">Max marks: {section.marks}</p>
                      </div>
                    </div>
                    <p className="text-sm">{section.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Class average:</div>
                      <div className="font-medium">
                        {showPercentage
                          ? `${section.progress}%`
                          : `${Math.round((section.progress * section.marks) / 100)} / ${section.marks}`}
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${section.color}`}
                        initial={{ width: animateProgress ? 0 : `${section.progress}%` }}
                        animate={{ width: `${section.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
