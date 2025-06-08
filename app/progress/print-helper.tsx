"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Printer } from "lucide-react"

const neaSections = [
  { id: "section-a", name: "A: Research", maxMarks: 10 },
  { id: "section-b", name: "B: Brief", maxMarks: 10 },
  { id: "section-c", name: "C: Ideas", maxMarks: 20 },
  { id: "section-d", name: "D: Development", maxMarks: 20 },
  { id: "section-e", name: "E: Making", maxMarks: 20 },
  { id: "section-f", name: "F: Evaluation", maxMarks: 20 },
]

const gradeBoundaries = {
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

const getPersonalGuidance = (sectionId, currentMarks, maxMarks, targetGrade) => {
  const percentage = (currentMarks / maxMarks) * 100
  const targetPercentage = gradeBoundaries[targetGrade] || 50

  const guidance = {
    "section-a":
      percentage < targetPercentage ? "👉 Add more detailed research and user interviews." : "✅ Great research work!",
    "section-b":
      percentage < targetPercentage
        ? "👉 Make design brief more specific with measurable criteria."
        : "✅ Excellent brief and specification!",
    "section-c":
      percentage < targetPercentage
        ? "👉 Generate more ideas with detailed annotations."
        : "✅ Creative ideas and good variety!",
    "section-d":
      percentage < targetPercentage ? "👉 Add more development and prototype testing." : "✅ Strong development work!",
    "section-e":
      percentage < targetPercentage
        ? "👉 Document making process with photos and quality checks."
        : "✅ Excellent making skills!",
    "section-f":
      percentage < targetPercentage
        ? "👉 Test against specification and get user feedback."
        : "✅ Thorough evaluation!",
  }

  return guidance[sectionId] || "Keep up the good work!"
}

const calculateGrade = (marks, maxMarks) => {
  const percentage = (marks / maxMarks) * 100
  for (const [grade, boundary] of Object.entries(gradeBoundaries)) {
    if (percentage >= boundary) return grade
  }
  return "U"
}

const getGradeColor = (grade) => {
  if (grade >= 7) return "#15803d" // Green for 7-9
  if (grade >= 5) return "#2563eb" // Blue for 5-6
  if (grade >= 3) return "#d97706" // Amber for 3-4
  return "#dc2626" // Red for U-2
}

export default function StudentReport({ student, studentScores = {}, portfolioProgress = {} }) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Calculate totals
  const totalNeaMarks = neaSections.reduce((total, section) => total + section.maxMarks, 0)
  const neaTotal = neaSections.reduce((total, section) => total + (studentScores[section.id] || 0), 0)
  const neaGrade = calculateGrade(neaTotal, totalNeaMarks)
  const targetGrade = student.target || 5

  const handlePrint = () => {
    const printContent = document.querySelector(".student-report-content")
    const printWindow = window.open("", "_blank")

    if (printWindow && printContent) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Progress Report - ${student.name}</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            * { box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 10px; 
              line-height: 1.3; 
              margin: 0; 
              color: #333;
              background-color: white;
            }
            .report-header { 
              text-align: center; 
              margin-bottom: 10px; 
              border-bottom: 2px solid #2563eb; 
              padding-bottom: 8px; 
            }
            .report-header h1 { 
              font-size: 18px; 
              margin: 0 0 2px 0; 
              color: #2563eb;
            }
            .report-header h2 { 
              font-size: 12px; 
              margin: 0; 
              color: #666;
              font-weight: normal;
            }
            .student-info { 
              background-color: #f8fafc; 
              padding: 8px; 
              border-radius: 6px; 
              margin-bottom: 10px;
              border-left: 3px solid #2563eb;
            }
            .student-name {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 3px;
            }
            .student-details {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            .student-detail {
              padding: 2px 8px;
              background: #e0e7ff;
              border-radius: 12px;
              font-size: 9px;
            }
            .grade-summary {
              display: flex;
              gap: 10px;
              margin: 10px 0;
              justify-content: center;
            }
            .grade-card {
              flex: 1;
              max-width: 100px;
              text-align: center;
              padding: 8px;
              border-radius: 6px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .grade-title {
              font-size: 10px;
              margin-bottom: 2px;
              color: #666;
            }
            .grade-value {
              font-size: 24px;
              font-weight: bold;
              margin: 2px 0;
            }
            .grade-subtitle {
              font-size: 9px;
              color: #666;
            }
            .target-message {
              background-color: #fef3c7;
              border-left: 3px solid #f59e0b;
              padding: 8px;
              border-radius: 6px;
              margin: 10px 0;
              font-size: 10px;
            }
            .section-title {
              font-size: 12px;
              font-weight: bold;
              margin: 12px 0 8px 0;
              padding-bottom: 3px;
              border-bottom: 1px solid #e5e7eb;
              color: #1f2937;
            }
            .nea-sections {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 8px;
              margin-bottom: 10px;
            }
            .nea-section {
              padding: 8px;
              border-radius: 6px;
              background: #f8fafc;
              box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }
            .nea-section-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              align-items: center;
            }
            .nea-section-name {
              font-weight: bold;
              font-size: 10px;
            }
            .nea-section-score {
              font-size: 10px;
              padding: 1px 6px;
              border-radius: 10px;
              background: #e0e7ff;
            }
            .progress-bar {
              height: 5px;
              background: #e5e7eb;
              border-radius: 3px;
              margin: 5px 0;
              overflow: hidden;
            }
            .progress-fill {
              height: 100%;
              border-radius: 3px;
            }
            .guidance {
              font-size: 9px;
              margin-top: 5px;
              line-height: 1.3;
            }
            .action-resources {
              display: flex;
              gap: 10px;
              margin: 10px 0;
            }
            .action-plan {
              flex: 1;
              background: #f0fdf4;
              border-radius: 6px;
              padding: 8px;
              border-left: 3px solid #22c55e;
            }
            .action-title {
              font-weight: bold;
              font-size: 11px;
              margin-bottom: 5px;
              color: #166534;
            }
            .action-list {
              margin: 0;
              padding-left: 15px;
            }
            .action-list li {
              margin-bottom: 3px;
              font-size: 9px;
            }
            .resources {
              flex: 1;
              background: #eff6ff;
              border-radius: 6px;
              padding: 8px;
              border-left: 3px solid #3b82f6;
            }
            .resources-title {
              font-weight: bold;
              font-size: 11px;
              margin-bottom: 5px;
              color: #1e40af;
            }
            .resources-list {
              margin: 0;
              padding-left: 15px;
              columns: 2;
            }
            .resources-list li {
              margin-bottom: 3px;
              font-size: 9px;
              break-inside: avoid;
            }
            .footer {
              margin-top: 10px;
              text-align: center;
              font-size: 8px;
              color: #6b7280;
              padding-top: 5px;
              border-top: 1px solid #e5e7eb;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1>My NEA Progress Report</h1>
            <h2>Design & Technology GCSE</h2>
          </div>

          <div class="student-info">
            <div class="student-name">${student.name}</div>
            <div class="student-details">
              <span class="student-detail">Class: ${student.class || "N/A"}</span>
              <span class="student-detail">Target: ${targetGrade}</span>
              <span class="student-detail">Date: ${new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div class="grade-summary">
            <div class="grade-card" style="background-color: ${getGradeColor(neaGrade)}10; border: 1px solid ${getGradeColor(neaGrade)};">
              <div class="grade-title">Current Grade</div>
              <div class="grade-value" style="color: ${getGradeColor(neaGrade)};">${neaGrade}</div>
              <div class="grade-subtitle">${neaTotal}/${totalNeaMarks} marks</div>
            </div>
            
            <div class="grade-card" style="background-color: #f0f9ff; border: 1px solid #0ea5e9;">
              <div class="grade-title">Target Grade</div>
              <div class="grade-value" style="color: #0ea5e9;">${targetGrade}</div>
              <div class="grade-subtitle">Your goal</div>
            </div>
          </div>

          <div class="target-message">
            <strong>📊 Your Progress:</strong> ${
              neaGrade >= targetGrade
                ? `Great job! You're achieving your target grade ${targetGrade}!`
                : `You're ${Math.abs(Number.parseInt(neaGrade) - Number.parseInt(targetGrade))} grade${
                    Math.abs(Number.parseInt(neaGrade) - Number.parseInt(targetGrade)) > 1 ? "s" : ""
                  } away from your target of grade ${targetGrade}. Focus on the areas below to improve!`
            }
          </div>

          <div class="section-title">How Am I Doing in Each Section?</div>
          
          <div class="nea-sections">
            ${neaSections
              .map((section) => {
                const currentMarks = studentScores[section.id] || 0
                const percentage = (currentMarks / section.maxMarks) * 100
                const guidance = getPersonalGuidance(section.id, currentMarks, section.maxMarks, targetGrade)
                const color = percentage >= 70 ? "#15803d" : percentage >= 50 ? "#2563eb" : "#d97706"

                return `
                  <div class="nea-section">
                    <div class="nea-section-header">
                      <span class="nea-section-name">${section.name}</span>
                      <span class="nea-section-score">${currentMarks}/${section.maxMarks}</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${percentage}%; background-color: ${color};"></div>
                    </div>
                    <div class="guidance">${guidance}</div>
                  </div>
                `
              })
              .join("")}
          </div>

          <div class="section-title">My Action Plan & Resources</div>
          
          <div class="action-resources">
            <div class="action-plan">
              <div class="action-title">🎯 What I Need to Focus On</div>
              <ul class="action-list">
                ${neaSections
                  .filter((section) => {
                    const currentMarks = studentScores[section.id] || 0
                    return currentMarks < (gradeBoundaries[targetGrade] / 100) * section.maxMarks
                  })
                  .slice(0, 2)
                  .map(
                    (section) => `
                  <li>Improve ${section.name} - see tips above</li>
                `,
                  )
                  .join("")}
                <li>Practice past paper questions weekly</li>
                <li>Ask for feedback on weak sections</li>
                <li>Review mark schemes carefully</li>
              </ul>
            </div>

            <div class="resources">
              <div class="resources-title">📚 Resources to Help Me</div>
              <ul class="resources-list">
                <li>AQA past papers & mark schemes</li>
                <li>BBC Bitesize D&T guides</li>
                <li>NEA exemplar materials</li>
                <li>Teacher support sessions</li>
                <li>YouTube tutorials</li>
                <li>Study groups</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} | Design & Technology GCSE | Next review in 2 weeks
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Student Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Progress Report - {student.name}</span>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print A4
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="student-report-content">
          {/* Preview content - this is just for the dialog, the print version is what matters */}
          <div className="text-center mb-4 pb-2 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">My NEA Progress Report</h1>
            <h2 className="text-sm text-gray-600">Design & Technology GCSE</h2>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg mb-4 border-l-4 border-blue-600">
            <div className="text-base font-bold mb-1">{student.name}</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-indigo-100 rounded-full text-xs">Class: {student.class || "N/A"}</span>
              <span className="px-2 py-0.5 bg-indigo-100 rounded-full text-xs">Target: {targetGrade}</span>
              <span className="px-2 py-0.5 bg-indigo-100 rounded-full text-xs">
                Date: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-3 my-4 justify-center">
            <div
              className={`text-center p-3 rounded-lg border`}
              style={{
                backgroundColor: `${getGradeColor(neaGrade)}10`,
                borderColor: getGradeColor(neaGrade),
              }}
            >
              <div className="text-xs text-gray-600">Current Grade</div>
              <div className="text-2xl font-bold my-1" style={{ color: getGradeColor(neaGrade) }}>
                {neaGrade}
              </div>
              <div className="text-xs text-gray-500">
                {neaTotal}/{totalNeaMarks} marks
              </div>
            </div>

            <div className="text-center p-3 rounded-lg border border-sky-500 bg-sky-50">
              <div className="text-xs text-gray-600">Target Grade</div>
              <div className="text-2xl font-bold my-1 text-sky-500">{targetGrade}</div>
              <div className="text-xs text-gray-500">Your goal</div>
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg my-4 border-l-4 border-amber-500 text-sm">
            <strong>📊 Your Progress:</strong>{" "}
            {neaGrade >= targetGrade
              ? `Great job! You're achieving your target grade ${targetGrade}!`
              : `You're ${Math.abs(Number.parseInt(neaGrade) - Number.parseInt(targetGrade))} grade${
                  Math.abs(Number.parseInt(neaGrade) - Number.parseInt(targetGrade)) > 1 ? "s" : ""
                } away from your target of grade ${targetGrade}. Focus on the areas below to improve!`}
          </div>

          <h3 className="text-base font-bold mt-6 mb-3 pb-1 border-b border-gray-200 text-gray-800">
            How Am I Doing in Each Section?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {neaSections.map((section) => {
              const currentMarks = studentScores[section.id] || 0
              const percentage = (currentMarks / section.maxMarks) * 100
              const guidance = getPersonalGuidance(section.id, currentMarks, section.maxMarks, targetGrade)
              const color = percentage >= 70 ? "#15803d" : percentage >= 50 ? "#2563eb" : "#d97706"

              return (
                <div key={section.id} className="bg-slate-50 p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs">{section.name}</span>
                    <span className="bg-indigo-100 px-2 py-0.5 rounded-full text-xs">
                      {currentMarks}/{section.maxMarks}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs">{guidance}</div>
                </div>
              )
            })}
          </div>

          <h3 className="text-base font-bold mt-6 mb-3 pb-1 border-b border-gray-200 text-gray-800">
            My Action Plan & Resources
          </h3>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-600 flex-1">
              <div className="font-bold text-green-800 mb-1 text-sm">🎯 What I Need to Focus On</div>
              <ul className="pl-5 space-y-1 text-xs">
                {neaSections
                  .filter((section) => {
                    const currentMarks = studentScores[section.id] || 0
                    return currentMarks < (gradeBoundaries[targetGrade] / 100) * section.maxMarks
                  })
                  .slice(0, 2)
                  .map((section) => (
                    <li key={section.id}>Improve {section.name} - see tips above</li>
                  ))}
                <li>Practice past paper questions weekly</li>
                <li>Ask for feedback on weak sections</li>
                <li>Review mark schemes carefully</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-600 flex-1">
              <div className="font-bold text-blue-800 mb-1 text-sm">📚 Resources to Help Me</div>
              <ul className="pl-5 md:columns-2 space-y-1 text-xs">
                <li>AQA past papers & mark schemes</li>
                <li>BBC Bitesize D&T guides</li>
                <li>NEA exemplar materials</li>
                <li>Teacher support sessions</li>
                <li>YouTube tutorials</li>
                <li>Study groups</li>
              </ul>
            </div>
          </div>

          <div className="text-center text-gray-500 text-xs mt-6 pt-2 border-t border-gray-200">
            Generated on {new Date().toLocaleDateString()} | Design & Technology GCSE | Next review in 2 weeks
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
