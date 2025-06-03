"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Upload, FileText, Users, CheckCircle, AlertCircle, Download } from "lucide-react"
import { useRouter } from "next/navigation"

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
  currentPredicted: string
  behaviour: string
  effort: string
  homework: string
  additionalSupport: string
  mockExamResult: string
  updatedPredicted: string
  // NEA specific fields
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
  contextualChallengeId?: string
  projectIdea?: string
  lastChecked?: string
}

export default function DataImportPage() {
  const [importStep, setImportStep] = useState(1)
  const [csvData, setCsvData] = useState<string>("")
  const [parsedStudents, setParsedStudents] = useState<StudentData[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "complete" | "error">("idle")
  const [importErrors, setImportErrors] = useState<string[]>([])
  const [previewData, setPreviewData] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({})
  const [selectAll, setSelectAll] = useState(true)

  const router = useRouter()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setCsvData(text)
      parseCSVPreview(text)
      setImportStep(2)
    }
    reader.readAsText(file)
  }

  const parseCSVPreview = (csvText: string) => {
    try {
      const lines = csvText.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

      // Get up to 100 rows for preview (instead of just 5)
      const previewRows = lines
        .slice(1, 101)
        .map((line) => {
          if (!line.trim()) return null
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ""
          })
          return row
        })
        .filter(Boolean)

      setPreviewData(previewRows)

      // Initialize all rows as selected
      const initialSelection: Record<number, boolean> = {}
      previewRows.forEach((_, index) => {
        initialSelection[index] = true
      })
      setSelectedRows(initialSelection)
      setSelectAll(true)
    } catch (error) {
      console.error("Error parsing CSV preview:", error)
      setImportErrors(["Error parsing CSV file. Please check the format."])
    }
  }

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    const newSelectedRows = { ...selectedRows }
    Object.keys(newSelectedRows).forEach((key) => {
      newSelectedRows[Number.parseInt(key)] = newSelectAll
    })
    setSelectedRows(newSelectedRows)
  }

  const toggleRowSelection = (index: number) => {
    const newSelectedRows = { ...selectedRows }
    newSelectedRows[index] = !newSelectedRows[index]
    setSelectedRows(newSelectedRows)

    // Update selectAll state based on whether all rows are selected
    const allSelected = Object.values(newSelectedRows).every(Boolean)
    setSelectAll(allSelected)
  }

  const getSelectedRowCount = () => {
    return Object.values(selectedRows).filter(Boolean).length
  }

  const processCSVData = async () => {
    setImportStatus("processing")
    setImportProgress(0)
    const errors: string[] = []
    const students: StudentData[] = []

    try {
      const lines = csvData.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

      // Find header indices
      const headerMap = {
        name: headers.findIndex((h) => h.includes("Surname Forename")),
        regGroup: headers.findIndex((h) => h.includes("Reg Group")),
        sex: headers.findIndex((h) => h.includes("Sex")),
        fsm: headers.findIndex((h) => h.includes("FSM")),
        examNo: headers.findIndex((h) => h.includes("Exam No")),
        senStatus: headers.findIndex((h) => h.includes("SEN Status")),
        class: headers.findIndex((h) => h.includes("Class")),
        lookedAfter: headers.findIndex((h) => h.includes("Looked After")),
        pupilPremium: headers.findIndex((h) => h.includes("Pupil Premium")),
        priorAttainment: headers.findIndex((h) => h.includes("Prior Attainment")),
        catScore: headers.findIndex((h) => h.includes("CAT")),
        readingAge: headers.findIndex((h) => h.includes("Reading Age")),
        y9Grade: headers.findIndex((h) => h.includes("Y9 EOY")),
        ks4Target: headers.findIndex((h) => h.includes("End of KS4 Target")),
        mockExamResult: headers.findIndex((h) => h.includes("Mock Exam Result")),
      }

      const dataLines = lines
        .slice(1)
        .filter(
          (line) => line.trim() && !line.includes("Template Notes") && !line.includes(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"),
        )

      // Get only the selected rows from preview data
      const selectedIndices = Object.entries(selectedRows)
        .filter(([_, isSelected]) => isSelected)
        .map(([index]) => Number.parseInt(index))

      // Only process the selected rows
      let processedCount = 0
      for (let i = 0; i < selectedIndices.length; i++) {
        const lineIndex = selectedIndices[i]
        if (lineIndex >= dataLines.length) continue

        const line = dataLines[lineIndex]
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))

        try {
          const fullName = values[headerMap.name] || ""
          const nameParts = fullName.split(" ")
          const surname = nameParts[0] || ""
          const forename = nameParts.slice(1).join(" ") || ""

          if (!fullName || fullName === "") {
            continue // Skip empty rows
          }

          const student: StudentData = {
            id: `student_${Date.now()}_${i}`,
            name: fullName,
            surname,
            forename,
            regGroup: values[headerMap.regGroup] || "",
            sex: values[headerMap.sex] || "",
            fsm: values[headerMap.fsm] || "",
            examNo: values[headerMap.examNo] || "",
            senStatus: values[headerMap.senStatus] || "",
            class: values[headerMap.class] || "",
            lookedAfter: values[headerMap.lookedAfter] || "",
            pupilPremium: values[headerMap.pupilPremium] || "",
            priorAttainment: values[headerMap.priorAttainment] || "",
            catScore: values[headerMap.catScore] || "",
            readingAge: values[headerMap.readingAge] || "",
            y9Grade: values[headerMap.y9Grade] || "",
            ks4Target: values[headerMap.ks4Target] || "",
            currentPredicted: "",
            behaviour: "",
            effort: "",
            homework: "",
            additionalSupport: "",
            mockExamResult: values[headerMap.mockExamResult] || "",
            updatedPredicted: "",
            neaScores: {
              sectionA: 0,
              sectionB: 0,
              sectionC: 0,
              sectionD: 0,
              sectionE: 0,
              sectionF: 0,
            },
            neaProgress: {
              sectionA: 0,
              sectionB: 0,
              sectionC: 0,
              sectionD: 0,
              sectionE: 0,
              sectionF: 0,
            },
            lastChecked: new Date().toISOString(),
          }

          students.push(student)
          processedCount++
        } catch (error) {
          errors.push(`Error processing row ${lineIndex + 2}: ${error}`)
        }

        setImportProgress(((i + 1) / selectedIndices.length) * 100)

        // Add small delay to show progress
        if (i % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }

      setParsedStudents(students)
      setImportErrors(errors)

      if (students.length > 0) {
        setImportStatus("complete")
        setImportStep(3)
      } else {
        setImportStatus("error")
        setImportErrors(["No valid student data found in the CSV file."])
      }
    } catch (error) {
      setImportStatus("error")
      setImportErrors([`Import failed: ${error}`])
    }
  }

  const saveStudentsToApp = () => {
    try {
      // Save to localStorage
      localStorage.setItem("nea-tracker-students", JSON.stringify(parsedStudents))

      // Also save additional analytics data
      const analyticsData = {
        totalStudents: parsedStudents.length,
        sexDistribution: parsedStudents.reduce(
          (acc, student) => {
            acc[student.sex] = (acc[student.sex] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
        fsmDistribution: parsedStudents.reduce(
          (acc, student) => {
            acc[student.fsm] = (acc[student.fsm] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
        senDistribution: parsedStudents.reduce(
          (acc, student) => {
            acc[student.senStatus] = (acc[student.senStatus] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
        priorAttainmentDistribution: parsedStudents.reduce(
          (acc, student) => {
            acc[student.priorAttainment] = (acc[student.priorAttainment] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
        classDistribution: parsedStudents.reduce(
          (acc, student) => {
            acc[student.class] = (acc[student.class] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
        importDate: new Date().toISOString(),
      }

      localStorage.setItem("nea-tracker-analytics", JSON.stringify(analyticsData))

      toast({
        title: "Import Successful",
        description: `${parsedStudents.length} students imported successfully.`,
      })

      setImportStep(4)
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save student data to the application.",
        variant: "destructive",
      })
    }
  }

  const downloadTemplate = () => {
    const templateHeaders = [
      "Surname Forename",
      "Reg Group",
      "Sex",
      "FSM",
      "Exam No.",
      "SEN Status",
      "Class",
      "Looked After",
      "Pupil Premium Indicator",
      "H/M/L Prior Attainment",
      "CAT: Mean SAS CAT Results",
      "Current Reading Age Reading Test",
      "Y9 EOY 09 Summer Term",
      "End of KS4 Target *KS4 End of KS4 Target",
      "Mock Exam Result Y10 EXAM",
    ]

    const templateRow = [
      "Smith John",
      "10R",
      "M",
      "N",
      "6112",
      "K",
      "10C/Gr1 24/25",
      "",
      "Y",
      "MPA",
      "98",
      "10:05",
      "2+",
      "5",
      "",
    ]

    const csvContent = [templateHeaders.join(","), templateRow.join(",")].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "nea-tracker-import-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Import</h1>
        <p className="text-muted-foreground">
          Import your comprehensive student data including demographics, prior attainment, and assessment information
        </p>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                importStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {importStep > step ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {step < 4 && <div className={`w-12 h-0.5 ${importStep > step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <Tabs value={`step-${importStep}`} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="step-1">Upload File</TabsTrigger>
          <TabsTrigger value="step-2">Preview Data</TabsTrigger>
          <TabsTrigger value="step-3">Process & Review</TabsTrigger>
          <TabsTrigger value="step-4">Complete</TabsTrigger>
        </TabsList>

        <TabsContent value="step-1" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Student Data
              </CardTitle>
              <CardDescription>Upload your CSV file containing comprehensive student information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="csv-upload" className="text-lg font-medium cursor-pointer">
                    Choose CSV File
                  </Label>
                  <p className="text-sm text-muted-foreground">Select your student data CSV file to import</p>
                </div>
                <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="mt-4" />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your CSV should include: Student names, registration groups, demographics (sex, FSM, SEN status),
                  prior attainment data, reading ages, target grades, and any existing assessment results.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step-2" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview Data</CardTitle>
              <CardDescription>Review the first few rows to ensure data is being read correctly</CardDescription>
            </CardHeader>
            <CardContent>
              {previewData.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="select-all"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="select-all" className="text-sm font-medium">
                        Select All
                      </label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getSelectedRowCount()} of {previewData.length} rows selected
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <div className="overflow-auto max-h-[400px]">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead className="w-[50px]">Select</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Reg Group</TableHead>
                            <TableHead>Sex</TableHead>
                            <TableHead>FSM</TableHead>
                            <TableHead>SEN Status</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Prior Attainment</TableHead>
                            <TableHead>KS4 Target</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((row, index) => (
                            <TableRow key={index} className={selectedRows[index] ? "" : "opacity-50"}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedRows[index] || false}
                                  onChange={() => toggleRowSelection(index)}
                                  className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              </TableCell>
                              <TableCell className="font-medium">{row["Surname Forename"]}</TableCell>
                              <TableCell>{row["Reg Group"]}</TableCell>
                              <TableCell>{row["Sex"]}</TableCell>
                              <TableCell>{row["FSM"]}</TableCell>
                              <TableCell>{row["SEN Status"]}</TableCell>
                              <TableCell>{row["Class"]}</TableCell>
                              <TableCell>{row["H/M/L Prior Attainment"]}</TableCell>
                              <TableCell>{row["End of KS4 Target *KS4 End of KS4 Target"]}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setImportStep(1)}>
                      Back
                    </Button>
                    <Button onClick={processCSVData}>Process {getSelectedRowCount()} Selected Rows</Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No preview data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step-3" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processing Results</CardTitle>
              <CardDescription>Review the processed student data before importing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {importStatus === "processing" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Processing students...</span>
                    <span>{Math.round(importProgress)}%</span>
                  </div>
                  <Progress value={importProgress} />
                </div>
              )}

              {importStatus === "complete" && (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Successfully processed {parsedStudents.length} students from {getSelectedRowCount()} selected rows
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{parsedStudents.length}</div>
                        <div className="text-sm text-muted-foreground">Total Students</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{parsedStudents.filter((s) => s.fsm === "Y").length}</div>
                        <div className="text-sm text-muted-foreground">FSM Students</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                          {parsedStudents.filter((s) => s.senStatus && s.senStatus !== "").length}
                        </div>
                        <div className="text-sm text-muted-foreground">SEN Students</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                          {parsedStudents.filter((s) => s.pupilPremium === "Y").length}
                        </div>
                        <div className="text-sm text-muted-foreground">Pupil Premium</div>
                      </CardContent>
                    </Card>
                  </div>

                  {importErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {importErrors.length} errors occurred during import:
                        <ul className="mt-2 list-disc list-inside">
                          {importErrors.slice(0, 5).map((error, index) => (
                            <li key={index} className="text-sm">
                              {error}
                            </li>
                          ))}
                        </ul>
                        {importErrors.length > 5 && (
                          <p className="text-sm mt-1">...and {importErrors.length - 5} more</p>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setImportStep(2)}>
                      Back
                    </Button>
                    <Button onClick={saveStudentsToApp}>Import Students</Button>
                  </div>
                </div>
              )}

              {importStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Import failed. Please check your CSV file and try again.
                    {importErrors.length > 0 && (
                      <ul className="mt-2 list-disc list-inside">
                        {importErrors.map((error, index) => (
                          <li key={index} className="text-sm">
                            {error}
                          </li>
                        ))}
                      </ul>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step-4" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Import Complete
              </CardTitle>
              <CardDescription>Your student data has been successfully imported into the NEA Tracker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {parsedStudents.length} students have been imported with comprehensive data including: demographics,
                  prior attainment, SEN information, and target grades.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="font-medium">What's Available Now:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Complete student profiles with demographics and support needs</li>
                  <li>Prior attainment data for targeted intervention</li>
                  <li>Reading ages for differentiated support</li>
                  <li>Target grades for progress tracking</li>
                  <li>SEN and FSM indicators for inclusive planning</li>
                  <li>Class groupings for organization</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => router.push("/students")}>
                  <Users className="w-4 h-4 mr-2" />
                  View Students
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
