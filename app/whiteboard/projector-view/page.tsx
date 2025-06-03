"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Trophy,
  Star,
  Crown,
  Target,
  Award,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  FileText,
  Lightbulb,
  Cog,
  TestTube,
  BarChart3,
  Clock,
} from "lucide-react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export default function ProjectorView() {
  const [students, setStudents] = useState<any[]>([])
  const [studentScores, setStudentScores] = useState<any>({})
  const [activeTab, setActiveTab] = useState("leaderboard")
  const [showPercentage, setShowPercentage] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoSlide, setAutoSlide] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedUnit, setSelectedUnit] = useState("section-a")
  const searchParams = useSearchParams()

  // NEA Unit Details for Projector View
  const neaUnits = [
    {
      id: "section-a",
      title: "Section A: Identifying & Investigating",
      marks: 10,
      icon: BookOpen,
      color: "bg-green-500",
      timeframe: "2-3 weeks",
      pages: "4-6 pages",
      whatToInclude: [
        "Clear identification of a design problem or opportunity",
        "Research into existing products and solutions",
        "User needs analysis and target market identification",
        "Analysis of design requirements and constraints",
        "Primary and secondary research evidence",
        "Clear justification for the chosen design context",
      ],
      keyTips: [
        "Start with a real problem that affects real people",
        "Use variety of research methods (surveys, interviews)",
        "Include images and examples of existing products",
        "Show clear analysis, don't just describe",
        "Make sure research leads to design opportunities",
      ],
      assessmentFocus: "Research quality, analysis depth, problem identification",
    },
    {
      id: "section-b",
      title: "Section B: Producing a Design Brief",
      marks: 10,
      icon: FileText,
      color: "bg-blue-500",
      timeframe: "1-2 weeks",
      pages: "3-4 pages",
      whatToInclude: [
        "Clear, concise design brief based on Section A research",
        "Detailed design specification with measurable criteria",
        "Prioritized list of design requirements",
        "Consideration of constraints and limitations",
        "Success criteria for evaluation",
        "Clear link back to user needs identified in Section A",
      ],
      keyTips: [
        "Keep the brief concise but comprehensive",
        "Make specification points measurable where possible",
        "Prioritize requirements (essential vs. desirable)",
        "Consider all constraints (time, materials, skills, cost)",
        "Think about how you'll test each specification point",
      ],
      assessmentFocus: "Brief clarity, specification detail, justified priorities",
    },
    {
      id: "section-c",
      title: "Section C: Generating Design Ideas",
      marks: 20,
      icon: Lightbulb,
      color: "bg-purple-500",
      timeframe: "3-4 weeks",
      pages: "8-12 pages",
      whatToInclude: [
        "Wide range of initial design ideas (minimum 6-8 concepts)",
        "Clear sketches with annotations explaining key features",
        "Evidence of creative thinking and innovation",
        "Ideas that address the design brief and specification",
        "Initial evaluation against specification criteria",
        "Selection and justification of ideas to develop further",
      ],
      keyTips: [
        "Generate quantity first, then focus on quality",
        "Use different ideation techniques (mind mapping, SCAMPER)",
        "Annotate sketches clearly to explain your thinking",
        "Don't be afraid of 'crazy' ideas - they lead to innovation",
        "Show how ideas meet different specification points",
      ],
      assessmentFocus: "Creativity, range of ideas, sketch quality, evaluation",
    },
    {
      id: "section-d",
      title: "Section D: Developing Design Ideas",
      marks: 20,
      icon: Cog,
      color: "bg-orange-500",
      timeframe: "4-5 weeks",
      pages: "8-12 pages",
      whatToInclude: [
        "Detailed development of selected design ideas",
        "Technical drawings and detailed sketches",
        "Material and component selection with justification",
        "Manufacturing considerations and processes",
        "Modeling and testing of key features",
        "Final design solution with full specifications",
      ],
      keyTips: [
        "Show clear progression from initial ideas to final design",
        "Include technical details like dimensions and materials",
        "Test ideas through modeling (physical or digital)",
        "Consider manufacturing methods and feasibility",
        "Document all design decisions and justifications",
      ],
      assessmentFocus: "Development quality, technical detail, justification",
    },
    {
      id: "section-e",
      title: "Section E: Realising Design Ideas",
      marks: 20,
      icon: TestTube,
      color: "bg-yellow-500",
      timeframe: "4-6 weeks",
      pages: "6-10 pages",
      whatToInclude: [
        "Detailed manufacturing plan with timeline",
        "Step-by-step documentation of making process",
        "Photos showing key stages of manufacture",
        "Problems encountered and solutions implemented",
        "Quality control checks and modifications made",
        "Final prototype with evaluation against specification",
      ],
      keyTips: [
        "Plan your making carefully before starting",
        "Document everything with photos and notes",
        "Don't hide problems - show how you solved them",
        "Check quality regularly during making",
        "Be prepared to modify your design if needed",
      ],
      assessmentFocus: "Planning, manufacturing skills, problem solving",
    },
    {
      id: "section-f",
      title: "Section F: Analysing & Evaluating",
      marks: 20,
      icon: BarChart3,
      color: "bg-red-500",
      timeframe: "2-3 weeks",
      pages: "6-8 pages",
      whatToInclude: [
        "Comprehensive testing of prototype against specification",
        "User testing with target audience",
        "Analysis of test results with data and evidence",
        "Evaluation of design decisions made throughout project",
        "Identification of improvements and modifications",
        "Reflection on the design process and learning",
      ],
      keyTips: [
        "Test every specification point systematically",
        "Get feedback from real users in your target market",
        "Use data and evidence to support your evaluation",
        "Be honest about what worked and what didn't",
        "Suggest realistic improvements based on findings",
      ],
      assessmentFocus: "Testing thoroughness, analysis quality, reflection",
    },
  ]

  // Load real student data and scores
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get tab from URL if present
      const tabParam = searchParams.get("tab")
      if (tabParam) {
        setActiveTab(tabParam)
      }

      // Load students from localStorage
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
  }, [searchParams])

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide) return

    const slideInterval = setInterval(() => {
      const tabs = ["leaderboard", "achievements", "nea-breakdown", "unit-guides", "class-progress"]
      const nextIndex = (tabs.indexOf(activeTab) + 1) % tabs.length
      setActiveTab(tabs[nextIndex])
    }, 25000) // Change slide every 25 seconds

    return () => clearInterval(slideInterval)
  }, [activeTab, autoSlide])

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

    return studentsWithProgress.slice(0, 10).map((student, index) => ({
      ...student,
      rank: index + 1,
    }))
  }

  // Get recent achievements (based on target progress)
  const getRecentAchievements = () => {
    const achievers = students
      .map((student) => ({ student, progress: calculateTargetProgress(student) }))
      .filter(({ progress }) => progress.status === "exceeding" || progress.percentage > 80)
      .slice(0, 10)

    return achievers.map(({ student, progress }, index) => ({
      name: student.name,
      achievement: progress.status === "exceeding" ? "Target Exceeded!" : "Close to Target!",
      icon: progress.status === "exceeding" ? Crown : Star,
      color: progress.status === "exceeding" ? "text-yellow-600" : "text-blue-600",
      bgColor: progress.status === "exceeding" ? "bg-yellow-100" : "bg-blue-100",
    }))
  }

  // Get NEA section breakdown
  const getNeaSectionBreakdown = () => {
    return [
      {
        section: "A",
        title: "Identifying & Investigating",
        marks: 10,
        progress:
          students.length > 0
            ? Math.round(
                students.reduce((sum, s) => {
                  const sectionScore = studentScores[s.id]?.["section-a"] || 0
                  return sum + (sectionScore / 10) * 100
                }, 0) / students.length,
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
                students.reduce((sum, s) => {
                  const sectionScore = studentScores[s.id]?.["section-b"] || 0
                  return sum + (sectionScore / 10) * 100
                }, 0) / students.length,
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
                students.reduce((sum, s) => {
                  const sectionScore = studentScores[s.id]?.["section-c"] || 0
                  return sum + (sectionScore / 20) * 100
                }, 0) / students.length,
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
                students.reduce((sum, s) => {
                  const sectionScore = studentScores[s.id]?.["section-d"] || 0
                  return sum + (sectionScore / 20) * 100
                }, 0) / students.length,
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
                students.reduce((sum, s) => {
                  const sectionScore = studentScores[s.id]?.["section-e"] || 0
                  return sum + (sectionScore / 20) * 100
                }, 0) / students.length,
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
                students.reduce((sum, s) => {
                  const sectionScore = studentScores[s.id]?.["section-f"] || 0
                  return sum + (sectionScore / 20) * 100
                }, 0) / students.length,
              )
            : 0,
        description: "Analysing and evaluating design decisions and prototypes",
        color: "bg-gradient-to-r from-red-400 to-red-500",
      },
    ]
  }

  const classProgress = getClassProgress()
  const topPerformers = getTopPerformers()
  const recentAchievements = getRecentAchievements()
  const neaSectionBreakdown = getNeaSectionBreakdown()
  const selectedUnitData = neaUnits.find((unit) => unit.id === selectedUnit)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative">
            <Image
              src="/images/school-logo.webp"
              alt="John Flamsteed Community School"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">John Flamsteed Community School</h1>
            <p className="text-xl opacity-90">Design & Technology - Student Progress</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="text-lg opacity-80">
            {currentTime.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-full p-1">
          {[
            { id: "leaderboard", label: "Target Progress", icon: Target },
            { id: "achievements", label: "Achievements", icon: Trophy },
            { id: "nea-breakdown", label: "NEA Breakdown", icon: CheckCircle2 },
            { id: "unit-guides", label: "Unit Guides", icon: BookOpen },
            { id: "class-progress", label: "Class Progress", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                activeTab === tab.id ? "bg-white text-blue-900 shadow-lg" : "text-white/80 hover:bg-white/20"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto"
        >
          {/* Target Progress Leaderboard */}
          {activeTab === "leaderboard" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Target Progress Leaderboard</h2>
                <p className="text-xl text-blue-200">Students ranked by progress toward their individual targets</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topPerformers.length > 0 ? (
                  topPerformers.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="bg-white/10 backdrop-blur-md border-none shadow-xl overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
                                index === 0
                                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950"
                                  : index === 1
                                    ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
                                    : index === 2
                                      ? "bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100"
                                      : "bg-white/20 text-white"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <Avatar className="h-12 w-12 border-2 border-white/50">
                              <AvatarFallback className="bg-blue-600 text-white">{student.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-bold text-lg">{student.name}</p>
                                  <p className="text-blue-200">
                                    Class {student.class || student.regGroup} • Target: Grade {student.target}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-2xl">{student.targetProgress.percentage}%</p>
                                  <p className="text-blue-200">
                                    Current: Grade {calculateOverallGrade(student.neaTotal, student.mockTotal)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 space-y-1">
                                <div className="h-3 w-full rounded-full bg-white/20 overflow-hidden">
                                  <motion.div
                                    className={`h-full rounded-full ${student.targetProgress.color}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${student.targetProgress.percentage}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                  />
                                </div>
                                <p className="text-sm text-blue-200">{student.targetProgress.message}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 bg-white/10 backdrop-blur-sm rounded-xl">
                    <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-2xl font-medium">No students available</p>
                    <p className="text-blue-200">Import student data to see target progress.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Achievements */}
          {activeTab === "achievements" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Student Achievements</h2>
                <p className="text-xl text-blue-200">Celebrating student success and progress</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Target Achievers",
                    description: "Students who have reached or exceeded their target grade",
                    icon: Target,
                    color: "bg-gradient-to-r from-green-400 to-green-600",
                    borderColor: "border-green-400",
                    students: students.filter((s) => calculateTargetProgress(s).status === "exceeding"),
                  },
                  {
                    title: "On Track Students",
                    description: "Students within 1 grade of their target",
                    icon: TrendingUp,
                    color: "bg-gradient-to-r from-blue-400 to-blue-600",
                    borderColor: "border-blue-400",
                    students: students.filter((s) => calculateTargetProgress(s).status === "on-track"),
                  },
                  {
                    title: "Top NEA Scores",
                    description: "Students with highest NEA scores",
                    icon: Award,
                    color: "bg-gradient-to-r from-purple-400 to-purple-600",
                    borderColor: "border-purple-400",
                    students: [...students]
                      .sort((a, b) => calculateTotalNea(b.id) - calculateTotalNea(a.id))
                      .slice(0, 3),
                  },
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.2 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-md border-none shadow-xl overflow-hidden h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`rounded-full p-3 ${achievement.color}`}>
                            <achievement.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{achievement.title}</h3>
                            <p className="text-blue-200">{achievement.description}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {achievement.students.length > 0 ? (
                            achievement.students.slice(0, 5).map((student, idx) => (
                              <div key={student.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                                <Avatar className="h-10 w-10 border border-white/30">
                                  <AvatarFallback className="bg-blue-600 text-white">
                                    {student.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-blue-200">Class {student.class || student.regGroup}</p>
                                </div>
                                <Badge
                                  className={`${
                                    index === 0 ? "bg-green-500" : index === 1 ? "bg-blue-500" : "bg-purple-500"
                                  } text-white border-none`}
                                >
                                  {index === 0
                                    ? `Grade ${calculateOverallGrade(
                                        calculateTotalNea(student.id),
                                        calculateTotalMock(student.id),
                                      )}`
                                    : index === 1
                                      ? `${calculateTargetProgress(student).percentage}%`
                                      : `${calculateTotalNea(student.id)}/100`}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-lg opacity-70">No students in this category yet</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* NEA Breakdown */}
          {activeTab === "nea-breakdown" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">NEA Section Breakdown</h2>
                <p className="text-xl text-blue-200">Class performance across all NEA sections</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {neaSectionBreakdown.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-md border-none shadow-xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white`}
                          >
                            {section.section}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{section.title}</h3>
                            <p className="text-blue-200">Max marks: {section.marks}</p>
                          </div>
                        </div>

                        <p className="mb-4">{section.description}</p>

                        <div className="flex items-center justify-between mb-2">
                          <div className="text-lg">Class average:</div>
                          <div className="text-2xl font-bold">
                            {showPercentage
                              ? `${section.progress}%`
                              : `${Math.round((section.progress * section.marks) / 100)} / ${section.marks}`}
                          </div>
                        </div>

                        <div className="h-4 w-full rounded-full bg-white/20 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${section.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${section.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Unit Guides */}
          {activeTab === "unit-guides" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">NEA Unit Guides</h2>
                <p className="text-xl text-blue-200">Detailed breakdown of what goes into each NEA section</p>
              </div>

              {/* Unit Selector */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-full p-1 flex-wrap">
                  {neaUnits.map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnit(unit.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all m-1 ${
                        selectedUnit === unit.id
                          ? "bg-white text-blue-900 shadow-lg"
                          : "text-white/80 hover:bg-white/20"
                      }`}
                    >
                      <unit.icon className="h-4 w-4" />
                      <span className="font-medium text-sm">Section {unit.id.split("-")[1].toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Unit Details */}
              {selectedUnitData && (
                <motion.div
                  key={selectedUnit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Unit Header */}
                  <Card className="bg-white/10 backdrop-blur-md border-none shadow-xl">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className={`rounded-full p-4 ${selectedUnitData.color} text-white`}>
                          <selectedUnitData.icon className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-3xl">{selectedUnitData.title}</CardTitle>
                          <div className="flex items-center gap-6 mt-2 text-blue-200">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{selectedUnitData.timeframe}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>{selectedUnitData.pages}</span>
                            </div>
                            <Badge variant="secondary" className="text-lg px-3 py-1">
                              {selectedUnitData.marks} marks
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* What to Include */}
                    <Card className="bg-white/10 backdrop-blur-md border-none shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <CheckCircle2 className="h-6 w-6 text-green-400" />
                          What to Include
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {selectedUnitData.whatToInclude.map((item, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Key Tips */}
                    <Card className="bg-white/10 backdrop-blur-md border-none shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Lightbulb className="h-6 w-6 text-yellow-400" />
                          Key Tips for Success
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {selectedUnitData.keyTips.map((tip, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <Lightbulb className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                              <span className="text-sm">{tip}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Assessment Focus */}
                  <Card className="bg-white/10 backdrop-blur-md border-none shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <BarChart3 className="h-6 w-6 text-purple-400" />
                        Assessment Focus
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white/5 p-4 rounded-lg">
                        <p className="text-lg font-medium text-center">{selectedUnitData.assessmentFocus}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          )}

          {/* Class Progress */}
          {activeTab === "class-progress" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Class Progress Overview</h2>
                <p className="text-xl text-blue-200">How each class is progressing toward targets</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {classProgress.length > 0 ? (
                  classProgress.map((classItem, index) => (
                    <motion.div
                      key={classItem.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.2 }}
                    >
                      <Card className="bg-white/10 backdrop-blur-md border-none shadow-xl overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold">Class {classItem.name}</h3>
                              <p className="text-blue-200">
                                {classItem.onTrackCount}/{classItem.studentCount} students on track or exceeding targets
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold">{classItem.progress}%</p>
                              <p className="text-blue-200">Average progress to target</p>
                            </div>
                          </div>

                          <div className="h-6 w-full rounded-full bg-white/20 overflow-hidden mb-4">
                            <motion.div
                              className={`h-full rounded-full ${classItem.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${classItem.progress}%` }}
                              transition={{ duration: 1.5, delay: index * 0.2 }}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="bg-white/5 rounded-lg p-4 text-center">
                              <p className="text-3xl font-bold">
                                {Math.round((classItem.onTrackCount / classItem.studentCount) * 100)}%
                              </p>
                              <p className="text-sm text-blue-200">On Track</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 text-center">
                              <p className="text-3xl font-bold">
                                {students
                                  .filter((s) => (s.class || s.regGroup) === classItem.name)
                                  .reduce((sum, s) => {
                                    const neaTotal = calculateTotalNea(s.id)
                                    return sum + Math.round((neaTotal / 100) * 100)
                                  }, 0) / classItem.studentCount}
                                %
                              </p>
                              <p className="text-sm text-blue-200">NEA Completion</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 text-center">
                              <p className="text-3xl font-bold">
                                {
                                  students
                                    .filter((s) => (s.class || s.regGroup) === classItem.name)
                                    .filter((s) => calculateTargetProgress(s).status === "exceeding").length
                                }
                              </p>
                              <p className="text-sm text-blue-200">Exceeding Target</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-xl">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-2xl font-medium">No class data available</p>
                    <p className="text-blue-200">Import student data with class information to see progress.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-blue-200 opacity-70">
        <p>Press ESC to exit projector view • Auto-slide is {autoSlide ? "ON" : "OFF"}</p>
      </div>
    </div>
  )
}
