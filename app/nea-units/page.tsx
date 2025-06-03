"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Target,
  FileText,
  Cog,
  TestTube,
  BarChart3,
  Clock,
  Zap,
  Award,
} from "lucide-react"

export default function NeaUnitsPage() {
  const [selectedSection, setSelectedSection] = useState("section-a")

  const neaSections = [
    {
      id: "section-a",
      title: "Section A: Identifying & Investigating",
      marks: 10,
      icon: BookOpen,
      color: "bg-green-500",
      description: "Identifying design possibilities and investigating user needs",
      timeframe: "2-3 weeks",
      pages: "4-6 pages",
      keySkills: ["Research", "Analysis", "User needs identification", "Market research"],
      whatToInclude: [
        "Clear identification of a design problem or opportunity",
        "Research into existing products and solutions",
        "User needs analysis and target market identification",
        "Analysis of design requirements and constraints",
        "Primary and secondary research evidence",
        "Clear justification for the chosen design context",
      ],
      hints: [
        "Start with a real problem that affects real people",
        "Use a variety of research methods (surveys, interviews, observations)",
        "Include images and examples of existing products",
        "Show clear analysis, don't just describe",
        "Make sure your research leads to clear design opportunities",
      ],
      commonMistakes: [
        "Choosing a problem that's too broad or vague",
        "Not including enough primary research",
        "Describing rather than analyzing research findings",
        "Not clearly identifying the target user group",
        "Weak justification for the chosen design context",
      ],
      assessmentCriteria: [
        "Clear identification of design possibilities (2-3 marks)",
        "Thorough investigation of user needs (3-4 marks)",
        "Analysis and evaluation of research (3-4 marks)",
      ],
      exampleContent:
        "Research into smartphone accessibility for elderly users, including surveys of 50+ users, analysis of existing products, and identification of key usability issues.",
    },
    {
      id: "section-b",
      title: "Section B: Producing a Design Brief",
      marks: 10,
      icon: FileText,
      color: "bg-blue-500",
      description: "Developing a design brief and specification",
      timeframe: "1-2 weeks",
      pages: "3-4 pages",
      keySkills: ["Brief writing", "Specification development", "Criteria setting", "Prioritization"],
      whatToInclude: [
        "Clear, concise design brief based on Section A research",
        "Detailed design specification with measurable criteria",
        "Prioritized list of design requirements",
        "Consideration of constraints and limitations",
        "Success criteria for evaluation",
        "Clear link back to user needs identified in Section A",
      ],
      hints: [
        "Keep the brief concise but comprehensive",
        "Make specification points measurable where possible",
        "Prioritize requirements (essential vs. desirable)",
        "Consider all constraints (time, materials, skills, cost)",
        "Think about how you'll test each specification point",
      ],
      commonMistakes: [
        "Brief is too vague or too detailed",
        "Specification points that can't be measured",
        "No clear prioritization of requirements",
        "Ignoring important constraints",
        "Poor link back to Section A research",
      ],
      assessmentCriteria: [
        "Clear and appropriate design brief (3-4 marks)",
        "Detailed design specification (3-4 marks)",
        "Justified priorities and constraints (2-3 marks)",
      ],
      exampleContent:
        "Design brief: 'Design an accessible smartphone interface for users aged 65+' with specification including minimum button size (12mm), high contrast ratios, and voice feedback capabilities.",
    },
    {
      id: "section-c",
      title: "Section C: Generating Design Ideas",
      marks: 20,
      icon: Lightbulb,
      color: "bg-purple-500",
      description: "Generating and developing design ideas",
      timeframe: "3-4 weeks",
      pages: "8-12 pages",
      keySkills: ["Creative thinking", "Sketching", "Ideation", "Concept development"],
      whatToInclude: [
        "Wide range of initial design ideas (minimum 6-8 concepts)",
        "Clear sketches with annotations explaining key features",
        "Evidence of creative thinking and innovation",
        "Ideas that address the design brief and specification",
        "Initial evaluation against specification criteria",
        "Selection and justification of ideas to develop further",
      ],
      hints: [
        "Generate quantity first, then focus on quality",
        "Use different ideation techniques (mind mapping, SCAMPER, etc.)",
        "Annotate sketches clearly to explain your thinking",
        "Don't be afraid of 'crazy' ideas - they often lead to innovation",
        "Show how ideas meet different specification points",
      ],
      commonMistakes: [
        "Too few initial ideas or concepts",
        "Ideas that don't address the design brief",
        "Poor quality sketches with no annotations",
        "No evidence of creative thinking processes",
        "Weak evaluation and selection of ideas",
      ],
      assessmentCriteria: [
        "Range and creativity of initial ideas (6-8 marks)",
        "Quality of communication through sketches (4-6 marks)",
        "Evaluation and selection of ideas (4-6 marks)",
      ],
      exampleContent:
        "8 different smartphone interface concepts including voice-controlled navigation, large button layouts, gesture-based controls, and adaptive interfaces that adjust to user abilities.",
    },
    {
      id: "section-d",
      title: "Section D: Developing Design Ideas",
      marks: 20,
      icon: Cog,
      color: "bg-orange-500",
      description: "Developing design ideas into a final design solution",
      timeframe: "4-5 weeks",
      pages: "8-12 pages",
      keySkills: ["Design development", "Problem solving", "Technical drawing", "Modeling"],
      whatToInclude: [
        "Detailed development of selected design ideas",
        "Technical drawings and detailed sketches",
        "Material and component selection with justification",
        "Manufacturing considerations and processes",
        "Modeling and testing of key features",
        "Final design solution with full specifications",
      ],
      hints: [
        "Show clear progression from initial ideas to final design",
        "Include technical details like dimensions and materials",
        "Test ideas through modeling (physical or digital)",
        "Consider manufacturing methods and feasibility",
        "Document all design decisions and justifications",
      ],
      commonMistakes: [
        "Jumping straight to final design without development",
        "Lack of technical detail in drawings",
        "No consideration of manufacturing processes",
        "Poor justification for design decisions",
        "No testing or modeling of concepts",
      ],
      assessmentCriteria: [
        "Quality of design development (8-10 marks)",
        "Technical detail and accuracy (6-8 marks)",
        "Justification of design decisions (4-6 marks)",
      ],
      exampleContent:
        "Development of adaptive smartphone interface including detailed wireframes, component specifications, user testing feedback, and final technical drawings with manufacturing considerations.",
    },
    {
      id: "section-e",
      title: "Section E: Realising Design Ideas",
      marks: 20,
      icon: TestTube,
      color: "bg-yellow-500",
      description: "Manufacturing a prototype",
      timeframe: "4-6 weeks",
      pages: "6-10 pages",
      keySkills: ["Manufacturing", "Problem solving", "Quality control", "Documentation"],
      whatToInclude: [
        "Detailed manufacturing plan with timeline",
        "Step-by-step documentation of making process",
        "Photos showing key stages of manufacture",
        "Problems encountered and solutions implemented",
        "Quality control checks and modifications made",
        "Final prototype with evaluation against specification",
      ],
      hints: [
        "Plan your making carefully before starting",
        "Document everything with photos and notes",
        "Don't hide problems - show how you solved them",
        "Check quality regularly during making",
        "Be prepared to modify your design if needed",
      ],
      commonMistakes: [
        "Poor planning leading to rushed making",
        "Inadequate documentation of the making process",
        "Not showing problem-solving during manufacture",
        "Poor quality control resulting in substandard prototype",
        "No evaluation of the finished prototype",
      ],
      assessmentCriteria: [
        "Quality of planning and preparation (4-6 marks)",
        "Manufacturing skills and techniques (8-10 marks)",
        "Problem solving and quality control (4-6 marks)",
      ],
      exampleContent:
        "Manufacturing plan for smartphone interface prototype including 3D printing of housing, programming of interface software, assembly process, and testing of functionality.",
    },
    {
      id: "section-f",
      title: "Section F: Analysing & Evaluating",
      marks: 20,
      icon: BarChart3,
      color: "bg-red-500",
      description: "Analysing and evaluating design decisions and prototypes",
      timeframe: "2-3 weeks",
      pages: "6-8 pages",
      keySkills: ["Testing", "Analysis", "Evaluation", "Critical thinking"],
      whatToInclude: [
        "Comprehensive testing of prototype against specification",
        "User testing with target audience",
        "Analysis of test results with data and evidence",
        "Evaluation of design decisions made throughout the project",
        "Identification of improvements and modifications",
        "Reflection on the design process and learning",
      ],
      hints: [
        "Test every specification point systematically",
        "Get feedback from real users in your target market",
        "Use data and evidence to support your evaluation",
        "Be honest about what worked and what didn't",
        "Suggest realistic improvements based on your findings",
      ],
      commonMistakes: [
        "Only testing some specification points",
        "No user testing with target audience",
        "Evaluation based on opinion rather than evidence",
        "Not reflecting on the design process",
        "Unrealistic or vague suggestions for improvement",
      ],
      assessmentCriteria: [
        "Comprehensive testing against specification (6-8 marks)",
        "Analysis of results with evidence (6-8 marks)",
        "Evaluation and suggestions for improvement (4-6 marks)",
      ],
      exampleContent:
        "Testing smartphone interface with 20 elderly users, measuring task completion times, error rates, and satisfaction scores, with detailed analysis of results and recommendations for improvements.",
    },
  ]

  const selectedSectionData = neaSections.find((section) => section.id === selectedSection)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">NEA Unit Breakdown</h1>
        <p className="text-xl text-muted-foreground">
          Complete guide to each NEA section with requirements, hints, and assessment criteria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                NEA Sections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {neaSections.map((section) => (
                <Button
                  key={section.id}
                  variant={selectedSection === section.id ? "default" : "ghost"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setSelectedSection(section.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-1 ${section.color} text-white`}>
                      <section.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className="text-xs text-muted-foreground">{section.marks} marks</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Section Details */}
        <div className="lg:col-span-3">
          {selectedSectionData && (
            <div className="space-y-6">
              {/* Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-3 ${selectedSectionData.color} text-white`}>
                      <selectedSectionData.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{selectedSectionData.title}</CardTitle>
                      <p className="text-muted-foreground">{selectedSectionData.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {selectedSectionData.marks} marks
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Time:</strong> {selectedSectionData.timeframe}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Pages:</strong> {selectedSectionData.pages}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Key Skills:</strong> {selectedSectionData.keySkills.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Content */}
              <Tabs defaultValue="requirements" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="hints">Hints & Tips</TabsTrigger>
                  <TabsTrigger value="mistakes">Common Mistakes</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="example">Example</TabsTrigger>
                </TabsList>

                <TabsContent value="requirements" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        What to Include
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedSectionData.whatToInclude.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        Key Skills Required
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedSectionData.keySkills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="hints" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600" />
                        Hints & Tips for Success
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedSectionData.hints.map((hint, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="mistakes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Common Mistakes to Avoid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedSectionData.commonMistakes.map((mistake, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="assessment" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        Assessment Criteria
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedSectionData.assessmentCriteria.map((criteria, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <BarChart3 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="example" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Example Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="italic">{selectedSectionData.exampleContent}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
