"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Save, RefreshCw, Download, Upload } from "lucide-react"

// Default grade boundaries
const defaultGradeBoundaries = {
  nea: {
    9: 90,
    8: 80,
    7: 70,
    6: 60,
    5: 50,
    4: 40,
    3: 30,
    2: 20,
    1: 10,
  },
  exam: {
    9: 90,
    8: 80,
    7: 70,
    6: 60,
    5: 50,
    4: 40,
    3: 30,
    2: 20,
    1: 10,
  },
  overall: {
    9: 90,
    8: 80,
    7: 70,
    6: 60,
    5: 50,
    4: 40,
    3: 30,
    2: 20,
    1: 10,
  },
}

export default function GradeBoundariesPage() {
  const [gradeBoundaries, setGradeBoundaries] = useState(() => {
    if (typeof window !== "undefined") {
      const savedBoundaries = localStorage.getItem("nea-tracker-grade-boundaries")
      if (savedBoundaries) {
        return JSON.parse(savedBoundaries)
      }
    }
    return defaultGradeBoundaries
  })

  const [activeTab, setActiveTab] = useState("nea")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [year, setYear] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nea-tracker-boundaries-year") || new Date().getFullYear().toString()
    }
    return new Date().getFullYear().toString()
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nea-tracker-grade-boundaries", JSON.stringify(gradeBoundaries))
    }
  }, [gradeBoundaries])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nea-tracker-boundaries-year", year)
    }
  }, [year])

  const handleBoundaryChange = (grade, value, type) => {
    const numValue = Number.parseInt(value, 10) || 0
    setGradeBoundaries((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [grade]: numValue,
      },
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    // Already saved to localStorage via useEffect
    setHasUnsavedChanges(false)
    toast({
      title: "Grade boundaries saved",
      description: `Grade boundaries for ${year} have been saved.`,
    })
  }

  const handleReset = (type) => {
    if (confirm(`Are you sure you want to reset the ${type.toUpperCase()} grade boundaries to default values?`)) {
      setGradeBoundaries((prev) => ({
        ...prev,
        [type]: defaultGradeBoundaries[type],
      }))
      setHasUnsavedChanges(true)
      toast({
        title: "Grade boundaries reset",
        description: `${type.toUpperCase()} grade boundaries have been reset to default values.`,
      })
    }
  }

  const handleExport = () => {
    const data = {
      year,
      gradeBoundaries,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `nea-tracker-grade-boundaries-${year}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Grade boundaries exported",
      description: "Grade boundaries have been exported as a JSON file.",
    })
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)

          if (!data.gradeBoundaries || !data.year) {
            throw new Error("Invalid grade boundaries file")
          }

          setGradeBoundaries(data.gradeBoundaries)
          setYear(data.year)
          setHasUnsavedChanges(true)

          toast({
            title: "Grade boundaries imported",
            description: `Grade boundaries for ${data.year} have been imported.`,
          })
        } catch (error) {
          toast({
            title: "Import failed",
            description: "The selected file contains invalid data.",
            variant: "destructive",
          })
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grade Boundaries</h1>
          <p className="text-muted-foreground">Manage AQA GCSE Design & Technology grade boundaries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>AQA GCSE Design & Technology Boundaries</CardTitle>
              <CardDescription>Set grade boundaries for NEA, exam, and overall grades</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="year">Academic Year:</Label>
              <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} className="w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="nea" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="nea">NEA (50%)</TabsTrigger>
              <TabsTrigger value="exam">Exam (50%)</TabsTrigger>
              <TabsTrigger value="overall">Overall</TabsTrigger>
            </TabsList>

            <TabsContent value="nea">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">NEA Grade Boundaries</h3>
                <Button variant="outline" size="sm" onClick={() => handleReset("nea")}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade</TableHead>
                      <TableHead>Minimum Percentage</TableHead>
                      <TableHead>Minimum Marks (out of 100)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(gradeBoundaries.nea)
                      .sort((a, b) => Number(b) - Number(a))
                      .map((grade) => (
                        <TableRow key={`nea-${grade}`}>
                          <TableCell className="font-medium">{grade}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={gradeBoundaries.nea[grade]}
                              onChange={(e) => handleBoundaryChange(grade, e.target.value, "nea")}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>{gradeBoundaries.nea[grade]}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="exam">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Exam Grade Boundaries</h3>
                <Button variant="outline" size="sm" onClick={() => handleReset("exam")}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade</TableHead>
                      <TableHead>Minimum Percentage</TableHead>
                      <TableHead>Minimum Marks (out of 100)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(gradeBoundaries.exam)
                      .sort((a, b) => Number(b) - Number(a))
                      .map((grade) => (
                        <TableRow key={`exam-${grade}`}>
                          <TableCell className="font-medium">{grade}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={gradeBoundaries.exam[grade]}
                              onChange={(e) => handleBoundaryChange(grade, e.target.value, "exam")}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>{gradeBoundaries.exam[grade]}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="overall">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Overall Grade Boundaries</h3>
                <Button variant="outline" size="sm" onClick={() => handleReset("overall")}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade</TableHead>
                      <TableHead>Minimum Percentage</TableHead>
                      <TableHead>Minimum Marks (out of 200)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(gradeBoundaries.overall)
                      .sort((a, b) => Number(b) - Number(a))
                      .map((grade) => (
                        <TableRow key={`overall-${grade}`}>
                          <TableCell className="font-medium">{grade}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={gradeBoundaries.overall[grade]}
                              onChange={(e) => handleBoundaryChange(grade, e.target.value, "overall")}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>{gradeBoundaries.overall[grade] * 2}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Note: Grade boundaries typically change each year. Update these values when new boundaries are published.
          </p>
          {hasUnsavedChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
