// This file contains all the data management functions for the application
// It uses localStorage for data persistence, which works offline

import { v4 as uuidv4 } from "uuid"
import Papa from "papaparse"

interface Student {
  id: string
  name: string
  class: string
  teamsLink?: string
  // Add other student properties as needed
  email: string
  gender: string
  target: number
  avatar: string
  contextualChallengeId?: string | null
  projectIdea?: string
  lastChecked?: string
  regGroup: string
  sex: string
  fsm: string
  pupilPremium: string
  examNo: string
  senStatus: string
  ks4Target: string
  readingAge: string
  priorAttainment: string
}

interface Score {
  studentId: string
  mockPaper1: number
  mockPaper2: number
  neaTotal: number
  // Add other score properties as needed
}

interface Deadline {
  id: string
  title: string
  date: string
  description: string
  // Add other deadline properties as needed
}

export interface Assessment {
  id: string
  studentId: string
  subject: string
  type: string
  date: string
  grade: string
  notes: string
}

export interface Subject {
  id: string
  name: string
}

// Helper function to safely access localStorage
const storage = {
  getItem: (key: string, defaultValue: any = null) => {
    if (typeof window === "undefined") return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return defaultValue
    }
  },
  setItem: (key: string, value: any) => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error)
    }
  },
}

export const neaSections = [
  { id: "section-a", name: "Section A: Identifying & Investigating Design Possibilities", maxMarks: 10 },
  { id: "section-b", name: "Section B: Producing a Design Brief & Specification", maxMarks: 10 },
  { id: "section-c", name: "Section C: Generating Design Ideas", maxMarks: 20 },
  { id: "section-d", name: "Section D: Developing Design Ideas", maxMarks: 20 },
  { id: "section-e", name: "Section E: Realising Design Ideas", maxMarks: 20 },
  { id: "section-f", name: "Section F: Analysing & Evaluating", maxMarks: 20 },
]

export const mockExamSections = [
  { id: "paper-1-section-a", name: "Paper 1: Section A", maxMarks: 20, paper: "paper-1" },
  { id: "paper-1-section-b", name: "Paper 1: Section B", maxMarks: 30, paper: "paper-1" },
  { id: "paper-1-section-c", name: "Paper 1: Section C", maxMarks: 50, paper: "paper-1" },
  { id: "paper-2-section-a", name: "Paper 2: Section A", maxMarks: 20, paper: "paper-2" },
  { id: "paper-2-section-b", name: "Paper 2: Section B", maxMarks: 30, paper: "paper-2" },
  { id: "paper-2-section-c", name: "Paper 2: Section C", maxMarks: 50, paper: "paper-2" },
]

// Student data functions
export const getStudents = (): Student[] => {
  const students = storage.getItem("nea-tracker-students", [])
  // Ensure all students have the pupilPremium field
  return students.map((student: any) => ({
    ...student,
    pupilPremium: student.pupilPremium || student.PP || "",
  }))
}

export const saveStudents = (students: Student[]) => {
  storage.setItem("nea-tracker-students", students)
}

export const addStudent = (student: Student) => {
  const students = getStudents()
  students.push(student)
  saveStudents(students)
}

export const updateStudent = (updatedStudent: Student) => {
  const students = getStudents()
  const index = students.findIndex((s) => s.id === updatedStudent.id)
  if (index !== -1) {
    students[index] = updatedStudent
    saveStudents(students)
  }
}

export const deleteStudent = (id: string) => {
  const students = getStudents()
  const filteredStudents = students.filter((s) => s.id !== id)
  saveStudents(filteredStudents)
}

export const getStudent = (id: string): Student | undefined => {
  const students = getStudents()
  return students.find((student) => student.id === id)
}

// Score data functions
export const getScores = (): Score[] => {
  return storage.getItem("scores", [])
}

export const addScore = (score: Score) => {
  const scores = getScores()
  scores.push(score)
  storage.setItem("scores", scores)
}

export const updateScore = (updatedScore: Score) => {
  const scores = getScores()
  const index = scores.findIndex((s) => s.studentId === updatedScore.studentId)
  if (index !== -1) {
    scores[index] = updatedScore
    storage.setItem("scores", scores)
  }
}

// Deadline data functions
export const getDeadlines = (): Deadline[] => {
  return storage.getItem("deadlines", [])
}

export const addDeadline = (deadline: Deadline) => {
  const deadlines = getDeadlines()
  deadlines.push(deadline)
  storage.setItem("deadlines", deadlines)
}

export const updateDeadline = (updatedDeadline: Deadline) => {
  const deadlines = getDeadlines()
  const index = deadlines.findIndex((d) => d.id === updatedDeadline.id)
  if (index !== -1) {
    deadlines[index] = updatedDeadline
    storage.setItem("deadlines", deadlines)
  }
}

export const deleteDeadline = (id: string) => {
  const deadlines = getDeadlines()
  const filteredDeadlines = deadlines.filter((d) => d.id !== id)
  storage.setItem("deadlines", filteredDeadlines)
}

// Assessment functions
export const saveAssessments = (assessments: Assessment[]) => {
  storage.setItem("nea-tracker-assessments", assessments)
}

export const getAssessments = (): Assessment[] => {
  return storage.getItem("nea-tracker-assessments", [])
}

export const getAssessment = (id: string): Assessment | undefined => {
  const assessments = getAssessments()
  return assessments.find((assessment) => assessment.id === id)
}

export const getAssessmentsForStudent = (studentId: string): Assessment[] => {
  const assessments = getAssessments()
  return assessments.filter((assessment) => assessment.studentId === studentId)
}

export const deleteAssessment = (id: string): void => {
  const assessments = getAssessments()
  const updatedAssessments = assessments.filter((assessment) => assessment.id !== id)
  saveAssessments(updatedAssessments)
}

// Subject functions
export const saveSubjects = (subjects: Subject[]) => {
  storage.setItem("nea-tracker-subjects", subjects)
}

export const getSubjects = (): Subject[] => {
  return storage.getItem("nea-tracker-subjects", [])
}

export const getSubject = (id: string): Subject | undefined => {
  const subjects = getSubjects()
  return subjects.find((subject) => subject.id === id)
}

export const deleteSubject = (id: string): void => {
  const subjects = getSubjects()
  const updatedSubjects = subjects.filter((subject) => subject.id !== id)
  saveSubjects(updatedSubjects)
}

// CSV parsing function
export const parseCSVData = (csvData: string): Student[] => {
  const results = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  })

  if (results.errors.length > 0) {
    console.error("CSV Parsing Errors:", results.errors)
    throw new Error("Failed to parse CSV data. Check console for errors.")
  }

  const students: Student[] = (results.data as any[]).map((row) => {
    const fullName = row["Full Name"] || row["Name"] || `${row["First Name"]} ${row["Last Name"]}` || ""

    const student = {
      id: uuidv4(),
      name: fullName,
      regGroup: row["Reg Group"] || "",
      sex: row["Sex"] || "",
      fsm: row["FSM"] || "",
      pupilPremium: row["PP"] || row["Pupil Premium"] || row["PupilPremium"] || "",
      examNo: row["Exam No"] || "",
      senStatus: row["SEN Status"] || "",
      ks4Target: row["KS4 Target"] || "",
      readingAge: row["Reading Age"] || "",
      priorAttainment: row["Prior Attainment"] || "",
      class: row["Class"] || row["Reg Group"] || "",
      email: row["Email"] || "",
      gender: row["Sex"] || row["Gender"] || "",
      target: Number.parseInt(row["KS4 Target"] || row["Target"] || "5") || 5,
      avatar: "",
      contextualChallengeId: null,
      projectIdea: "",
      lastChecked: "",
      teamsLink: row["Teams Link"] || "",
    }

    return student
  })

  return students
}

// Export data for backup
export const exportAllData = () => {
  const data = {
    students: getStudents(),
    scores: getScores(),
    deadlines: getDeadlines(),
    // Add other data types as needed
  }
  return data
}

// Import data from backup
export const importAllData = (data: any) => {
  if (data.students) storage.setItem("students", data.students)
  if (data.scores) storage.setItem("scores", data.scores)
  if (data.deadlines) storage.setItem("deadlines", data.deadlines)
  // Add other data types as needed
}

// Clear all data (for testing or reset)
export const clearAllData = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("students")
  localStorage.removeItem("scores")
  localStorage.removeItem("deadlines")
  // Remove other data types as needed
}

export const neaCriteria = [
  { id: "section-a", name: "Section A: Identifying & Investigating Design Possibilities", maxMarks: 10 },
  { id: "section-b", name: "Section B: Producing a Design Brief & Specification", maxMarks: 10 },
  { id: "section-c", name: "Section C: Generating Design Ideas", maxMarks: 20 },
  { id: "section-d", name: "Section D: Developing Design Ideas", maxMarks: 20 },
  { id: "section-e", name: "Section E: Realising Design Ideas", maxMarks: 20 },
  { id: "section-f", name: "Section F: Analysing & Evaluating", maxMarks: 20 },
]

// Expected NEA Portfolio Pages
export const neaPortfolioPages = {
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

// Comprehensive data management for backup/restore
export interface AppData {
  students: Student[]
  scores: any
  deadlines: any
  savedClasses: any[]
  settings: any
  rewards: any
  mockExamScores: any
  neaScores: any
  contextualChallenges: any[]
  version: string
  exportDate: string
  appName: string
}

// Get all application data for backup
export const getAllAppData = (): AppData => {
  return {
    students: storage.getItem("nea-tracker-students", []),
    scores: storage.getItem("nea-tracker-scores", {}),
    deadlines: storage.getItem("nea-tracker-deadlines", []),
    savedClasses: storage.getItem("nea-tracker-saved-classes", []),
    settings: storage.getItem("nea-tracker-settings", {}),
    rewards: storage.getItem("nea-tracker-rewards", {}),
    mockExamScores: storage.getItem("nea-tracker-mock-exam-scores", {}),
    neaScores: storage.getItem("nea-tracker-nea-scores", {}),
    contextualChallenges: storage.getItem("nea-tracker-contextual-challenges", []),
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    appName: "NEA Tracker",
  }
}

// Restore all application data from backup
export const restoreAllAppData = (data: AppData): boolean => {
  try {
    if (!data.appName || data.appName !== "NEA Tracker") {
      throw new Error("Invalid backup file format")
    }

    // Restore all data
    if (data.students) storage.setItem("nea-tracker-students", data.students)
    if (data.scores) storage.setItem("nea-tracker-scores", data.scores)
    if (data.deadlines) storage.setItem("nea-tracker-deadlines", data.deadlines)
    if (data.savedClasses) storage.setItem("nea-tracker-saved-classes", data.savedClasses)
    if (data.settings) storage.setItem("nea-tracker-settings", data.settings)
    if (data.rewards) storage.setItem("nea-tracker-rewards", data.rewards)
    if (data.mockExamScores) storage.setItem("nea-tracker-mock-exam-scores", data.mockExamScores)
    if (data.neaScores) storage.setItem("nea-tracker-nea-scores", data.neaScores)
    if (data.contextualChallenges) storage.setItem("nea-tracker-contextual-challenges", data.contextualChallenges)

    return true
  } catch (error) {
    console.error("Error restoring data:", error)
    return false
  }
}

// Track if there are unsaved changes
let dataModified = false
let lastSaveTime = Date.now()

// Mark data as modified
export const markDataAsModified = () => {
  dataModified = true
  storage.setItem("nea-tracker-last-modified", new Date().toISOString())
}

// Check if there are unsaved changes
export const hasUnsavedChanges = (): boolean => {
  return (
    dataModified ||
    storage.getItem("nea-tracker-last-save", null) === null ||
    storage.getItem("nea-tracker-last-modified", null) === null
  )
}

// Mark data as saved
export const markDataAsSaved = () => {
  dataModified = false
  lastSaveTime = Date.now()
  storage.setItem("nea-tracker-last-save", new Date().toISOString())
}

// Auto-save all data
export const autoSave = () => {
  const data = getAllAppData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  // Store the backup in localStorage as well
  storage.setItem("nea-tracker-auto-backup", data)
  markDataAsSaved()

  return { data, blob, url }
}

// Create a backup file with all data
export const createBackup = () => {
  try {
    // Collect all data from localStorage
    const backupData: Record<string, any> = {}

    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        try {
          // Try to parse as JSON
          const value = localStorage.getItem(key)
          if (value) {
            backupData[key] = JSON.parse(value)
          }
        } catch (e) {
          // If not JSON, store as string
          backupData[key] = localStorage.getItem(key)
        }
      }
    }

    // Add metadata
    const metadata = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      appName: "NEA Tracker",
    }

    const fullBackup = {
      metadata,
      data: backupData,
    }

    // Convert to JSON string
    const backupString = JSON.stringify(fullBackup, null, 2)

    // Create and download file
    const blob = new Blob([backupString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    const date = new Date().toISOString().split("T")[0]
    a.href = url
    a.download = `nea-tracker-backup-${date}.neabackup`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Mark data as saved
    markDataAsSaved()

    return true
  } catch (error) {
    console.error("Error creating backup:", error)
    return false
  }
}

// Load backup from file
export const loadBackupFromFile = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const result = event.target?.result
        if (typeof result !== "string") {
          reject(new Error("Invalid file format"))
          return
        }

        const backupData = JSON.parse(result)

        // Validate backup format
        if (!backupData.metadata || !backupData.data) {
          reject(new Error("Invalid backup format"))
          return
        }

        // Clear existing data
        // localStorage.clear(); // Uncomment if you want to clear all data first

        // Restore all data
        const data = backupData.data
        Object.keys(data).forEach((key) => {
          try {
            localStorage.setItem(key, JSON.stringify(data[key]))
          } catch (e) {
            console.error(`Error restoring key ${key}:`, e)
          }
        })

        // Mark data as saved
        markDataAsSaved()

        resolve(true)
      } catch (error) {
        console.error("Error loading backup:", error)
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    reader.readAsText(file)
  })
}
