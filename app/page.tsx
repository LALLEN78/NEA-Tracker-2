"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ArrowUpRight, Users, FileText, Award, Calendar } from "lucide-react"
import Link from "next/link"
import { InstallPrompt } from "./components/install-prompt"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <InstallPrompt />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the NEA Coursework Tracker</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/progress">View Progress</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79</div>
            <p className="text-xs text-muted-foreground mt-2">Across 3 classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Students On Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">49/79</div>
            <Progress value={62} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">62% of students meeting targets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <div className="flex items-center text-green-500 mt-2">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span className="text-sm">Positive trend</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Compared to previous term</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress by NEA Section</CardTitle>
              <CardDescription>Average completion percentage across all students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { section: "A", title: "Identifying & Investigating", progress: 85 },
                      { section: "B", title: "Producing a Design Brief", progress: 78 },
                      { section: "C", title: "Generating Design Ideas", progress: 72 },
                      { section: "D", title: "Developing Design Ideas", progress: 65 },
                      { section: "E", title: "Realising Design Ideas", progress: 48 },
                      { section: "F", title: "Analysing & Evaluating", progress: 35 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="section" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Progress"]} />
                    <Legend />
                    <Bar dataKey="progress" name="Completion %" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Class Progress</CardTitle>
              <CardDescription>Compare progress across different classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { class: "11A", students: 25, progress: 72, target: 68 },
                  { class: "11B", students: 28, progress: 65, target: 70 },
                  { class: "11C", students: 26, progress: 78, target: 65 },
                ].map((item) => (
                  <div key={item.class} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Class {item.class}</div>
                        <div className="text-sm text-muted-foreground">{item.students} students</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.progress}%</div>
                        <div className="text-sm text-muted-foreground">Target: {item.target}%</div>
                      </div>
                    </div>
                    <div className="relative pt-2">
                      <Progress value={item.progress} className="h-2" />
                      <div className="absolute top-0 bottom-0 w-0.5 bg-red-500" style={{ left: `${item.target}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  {
                    icon: Users,
                    title: "New Student Added",
                    description: "Michael Brown was added to Class 11B",
                    time: "2 hours ago",
                  },
                  {
                    icon: FileText,
                    title: "Section Completed",
                    description: "Sophia Chen completed Section E with 15/20 marks",
                    time: "Yesterday",
                  },
                  {
                    icon: Award,
                    title: "Achievement Unlocked",
                    description: "Alex Johnson earned the 'Design Star' achievement",
                    time: "2 days ago",
                  },
                  {
                    icon: Calendar,
                    title: "Deadline Updated",
                    description: "Section F deadline extended to 15th June",
                    time: "3 days ago",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
