"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, Circle, FileText, Users, BarChart3, ExternalLink, Edit, LinkIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getStudents } from "../data"
import Link from "next/link"

const neaPortfolioPages = {
  "section-a": [
    { id: "a1", name: "Design Context", description: "Analysis of the contextual challenge" },
    { id: "a2", name: "User Identification", description: "Identification and analysis of user/client needs" },
    { id: "a3", name: "Research Plan", description: "Strategy for primary and secondary research" },
    { id: "a4", name: "Existing Products", description: "Analysis of existing products/solutions" },
    { id: "a5", name: "Primary Research", description: "Interviews, surveys, or observations with users" },
    { id: "a6", name: "Research Analysis", description: "Summary of key findings from research" },
  ],
  "section-b": [
    { id: "b1", name: "Design Brief", description: "Clear statement of design problem to be solved" },
    { id: "b2", name: "Specification", description: "Detailed list of measurable requirements" },
    { id: "b3", name: "Justification", description: "Links between specification and research" },
  ],
  "section-c": [
    { id: "c1", name: "Initial Ideas", description: "First round of concept sketches" },
    { id: "c2", name: "Design Strategies", description: "Different approaches to idea generation" },
    { id: "c3", name: "Further Ideas", description: "Development of initial concepts" },
    { id: "c4", name: "Idea Evaluation", description: "Assessment of ideas against specification" },
    { id: "c5", name: "Chosen Concept", description: "Selection and justification of concept to develop" },
  ],
  "section-d": [
    { id: "d1", name: "Development Plan", description: "Strategy for developing chosen concept" },
    { id: "d2", name: "Modeling - Iteration 1", description: "First prototype/model and testing" },
    { id: "d3", name: "Modeling - Iteration 2", description: "Second prototype/model and testing" },
    { id: "d4", name: "Final Design", description: "Detailed drawings of final design" },
    { id: "d5", name: "Materials Research", description: "Investigation of suitable materials" },
    { id: "d6", name: "Manufacturing Spec", description: "Detailed plan for making the product" },
  ],
  "section-e": [
    { id: "e1", name: "Production Plan", description: "Step-by-step making plan with quality control" },
    { id: "e2", name: "Making Process", description: "Documentation of manufacturing process" },
    { id: "e3", name: "Quality Control", description: "Checks and measurements during making" },
    { id: "e4", name: "Final Product", description: "Photographs of completed product" },
  ],
  "section-f": [
    { id: "f1", name: "Testing Plan", description: "Strategy for testing against specification" },
    { id: "f2", name: "User Testing", description: "Feedback from users/clients" },
    { id: "f3", name: "Specification Testing", description: "Evaluation against each specification point" },
    { id: "f4", name: "Modifications", description: "Suggested and implemented improvements" },
    { id: "f5", name: "Final Evaluation", description: "Overall assessment of project success" },
  ],
}

const neaSections = [
  { id: "section-a", name: "Section A: Identifying & Investigating Design Possibilities", maxMarks: 10 },
  { id: "section-b", name: "Section B: Producing a Design Brief & Specification", maxMarks: 10 },
  { id: "section-c", name: "Section C: Generating Design Ideas", maxMarks: 20 },
  { id: "section-d", name: "Section D: Developing Design Ideas", maxMarks: 20 },
  { id: "section-e", name: "Section E: Realising Design Ideas", maxMarks: 20 },
  { id: "section-f", name: "Section F: Analysing & Evaluating", maxMarks: 20 },
]

export default function NEAPageTracker() {
  const { toast } = useToast()
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentProgress, setStudentProgress] = useState({})
  const [portfolioLinks, setPortfolioLinks] = useState({})
  const [activeTab, setActiveTab] = useState("overview")
  const [editingLink, setEditingLink] = useState(null)
  const [linkInput, setLinkInput] = useState("")

  // Load students and progress data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadedStudents = getStudents()
      setStudents(loadedStudents)

      // Load progress data
      const savedProgress = localStorage.getItem("nea-tracker-portfolio-progress")
      if (savedProgress) {
        try {
          setStudentProgress(JSON.parse(savedProgress))
        } catch (error) {
          console.error("Error parsing progress data:", error)
          setStudentProgress({})
        }
      }

      // Load portfolio links
      const savedLinks = localStorage.getItem("nea-tracker-portfolio-links")
      if (savedLinks) {
        try {
          setPortfolioLinks(JSON.parse(savedLinks))
        } catch (error) {
          console.error("Error parsing portfolio links:", error)
          setPortfolioLinks({})
        }
      }

      // Set first student as selected if available
      if (loadedStudents.length > 0 && !selectedStudent) {
        setSelectedStudent(loadedStudents[0])
      }
    }
  }, [selectedStudent])

  // Save progress data
  const saveProgress = (updatedProgress) => {
    setStudentProgress(updatedProgress)
    localStorage.setItem("nea-tracker-portfolio-progress", JSON.stringify(updatedProgress))
  }

  // Save portfolio links
  const savePortfolioLinks = (updatedLinks) => {
    setPortfolioLinks(updatedLinks)
    localStorage.setItem("nea-tracker-portfolio-links", JSON.stringify(updatedLinks))
  }

  // Toggle page completion
  const togglePageCompletion = (studentId, sectionId, pageId) => {
    const updatedProgress = { ...studentProgress }

    if (!updatedProgress[studentId]) {
      updatedProgress[studentId] = {}
    }

    if (!updatedProgress[studentId][sectionId]) {
      updatedProgress[studentId][sectionId] = {}
    }

    updatedProgress[studentId][sectionId][pageId] = !updatedProgress[studentId][sectionId][pageId]

    saveProgress(updatedProgress)

    toast({
      title: updatedProgress[studentId][sectionId][pageId] ? "Page completed" : "Page marked incomplete",
      description: `${neaPortfolioPages[sectionId].find((p) => p.id === pageId)?.name} updated for ${selectedStudent?.name}`,
    })
  }

  // Handle portfolio link editing
  const handleEditLink = (studentId) => {
    setEditingLink(studentId)
    setLinkInput(portfolioLinks[studentId] || "")
  }

  const handleSaveLink = () => {
    if (editingLink) {
      const updatedLinks = { ...portfolioLinks }
      if (linkInput.trim()) {
        updatedLinks[editingLink] = linkInput.trim()
      } else {
        delete updatedLinks[editingLink]
      }
      savePortfolioLinks(updatedLinks)
      setEditingLink(null)
      setLinkInput("")
      toast({
        title: "Portfolio link updated",
        description: "Teams portfolio link has been saved.",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingLink(null)
    setLinkInput("")
  }

  // Calculate section progress
  const calculateSectionProgress = (studentId, sectionId) => {
    if (!studentProgress[studentId] || !studentProgress[studentId][sectionId]) return 0

    const pages = neaPortfolioPages[sectionId]
    const completedPages = pages.filter((page) => studentProgress[studentId][sectionId][page.id]).length

    return Math.round((completedPages / pages.length) * 100)
  }

  // Calculate overall progress
  const calculateOverallProgress = (studentId) => {
    const sections = Object.keys(neaPortfolioPages)
    const totalProgress = sections.reduce((acc, sectionId) => {
      return acc + calculateSectionProgress(studentId, sectionId)
    }, 0)

    return Math.round(totalProgress / sections.length)
  }

  // Get completed pages count
  const getCompletedPagesCount = (studentId, sectionId) => {
    if (!studentProgress[studentId] || !studentProgress[studentId][sectionId]) return 0

    const pages = neaPortfolioPages[sectionId]
    return pages.filter((page) => studentProgress[studentId][sectionId][page.id]).length
  }

  if (students.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">NEA Portfolio Tracker</h1>
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No students added yet</h3>
          <p className="mt-2 text-muted-foreground">Add students to start tracking their NEA portfolio progress.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button asChild>
              <Link href="/students">
                <Users className="mr-2 h-4 w-4" />
                Add Students
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/data-import">Import Students</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">NEA Portfolio Tracker</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Export Progress
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="student-tracker">Student Tracker</TabsTrigger>
          <TabsTrigger value="section-breakdown">Section Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {students.length > 0
                      ? Math.round(
                          students.reduce((acc, student) => acc + calculateOverallProgress(student.id), 0) /
                            students.length,
                        )
                      : 0}
                    %
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed NEAs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {students.filter((student) => calculateOverallProgress(student.id) === 100).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      students.filter((student) => {
                        const progress = calculateOverallProgress(student.id)
                        return progress > 0 && progress < 100
                      }).length
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Progress Overview</CardTitle>
                <CardDescription>Track portfolio completion across all students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => {
                    const overallProgress = calculateOverallProgress(student.id)
                    return (
                      <div key={student.id} className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-sm text-muted-foreground">{overallProgress}%</span>
                          </div>
                          <Progress value={overallProgress} className="h-2" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student)
                            setActiveTab("student-tracker")
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="student-tracker" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Student</CardTitle>
                <CardDescription>Choose a student to track their portfolio progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {students.map((student) => (
                    <Button
                      key={student.id}
                      variant={selectedStudent?.id === student.id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="text-xs">{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {student.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedStudent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {selectedStudent.name} - Portfolio Progress
                  </CardTitle>
                  <CardDescription>Overall Progress: {calculateOverallProgress(selectedStudent.id)}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(neaPortfolioPages).map(([sectionId, pages]) => {
                      const sectionProgress = calculateSectionProgress(selectedStudent.id, sectionId)
                      const completedCount = getCompletedPagesCount(selectedStudent.id, sectionId)
                      const sectionInfo = neaSections.find((s) => s.id === sectionId)

                      return (
                        <div key={sectionId} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">{sectionInfo?.name}</h3>
                            <Badge variant={sectionProgress === 100 ? "default" : "secondary"}>
                              {completedCount}/{pages.length} pages
                            </Badge>
                          </div>
                          <Progress value={sectionProgress} className="mb-4" />
                          <div className="grid gap-2">
                            {pages.map((page) => {
                              const isCompleted = studentProgress[selectedStudent.id]?.[sectionId]?.[page.id] || false
                              return (
                                <div
                                  key={page.id}
                                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                                  onClick={() => togglePageCompletion(selectedStudent.id, sectionId, page.id)}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium">{page.name}</div>
                                    <div className="text-sm text-muted-foreground">{page.description}</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="section-breakdown" className="mt-6">
          <div className="grid gap-6">
            {neaSections.map((section) => {
              const sectionId = section.id
              const pages = neaPortfolioPages[sectionId]

              return (
                <Card key={sectionId}>
                  <CardHeader>
                    <CardTitle>{section.name}</CardTitle>
                    <CardDescription>Max Marks: {section.maxMarks}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 font-medium">Student</th>
                            <th className="p-2 font-medium text-center">Teams Portfolio</th>
                            {pages.map((page) => (
                              <th key={page.id} className="p-2 font-medium text-center min-w-[100px]">
                                {page.name}
                              </th>
                            ))}
                            <th className="p-2 font-medium text-center">Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => {
                            const sectionProgress = calculateSectionProgress(student.id, sectionId)
                            const hasPortfolioLink = portfolioLinks[student.id]

                            return (
                              <tr key={student.id} className="border-b hover:bg-muted/50">
                                <td className="p-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs">{student.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{student.name}</span>
                                  </div>
                                </td>
                                <td className="p-2 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    {hasPortfolioLink ? (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => window.open(portfolioLinks[student.id], "_blank")}
                                      >
                                        <ExternalLink className="h-4 w-4 text-blue-600" />
                                      </Button>
                                    ) : (
                                      <div className="h-8 w-8 flex items-center justify-center">
                                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    )}
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => handleEditLink(student.id)}
                                        >
                                          <Edit className="h-3 w-3 text-muted-foreground" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Edit Teams Portfolio Link - {student.name}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div>
                                            <label className="text-sm font-medium">Teams Portfolio URL</label>
                                            <Input
                                              value={
                                                editingLink === student.id
                                                  ? linkInput
                                                  : portfolioLinks[student.id] || ""
                                              }
                                              onChange={(e) => {
                                                if (editingLink === student.id) {
                                                  setLinkInput(e.target.value)
                                                } else {
                                                  setEditingLink(student.id)
                                                  setLinkInput(e.target.value)
                                                }
                                              }}
                                              placeholder="https://teams.microsoft.com/..."
                                              className="mt-1"
                                            />
                                          </div>
                                          <div className="flex gap-2">
                                            <Button onClick={handleSaveLink} size="sm">
                                              Save Link
                                            </Button>
                                            <Button onClick={handleCancelEdit} variant="outline" size="sm">
                                              Cancel
                                            </Button>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </td>
                                {pages.map((page) => {
                                  const isCompleted = studentProgress[student.id]?.[sectionId]?.[page.id] || false
                                  return (
                                    <td key={page.id} className="p-2 text-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => togglePageCompletion(student.id, sectionId, page.id)}
                                      >
                                        {isCompleted ? (
                                          <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                          <Circle className="h-5 w-5 text-muted-foreground" />
                                        )}
                                      </Button>
                                    </td>
                                  )
                                })}
                                <td className="p-2 text-center">
                                  <Badge variant={sectionProgress === 100 ? "default" : "secondary"}>
                                    {sectionProgress}%
                                  </Badge>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
