"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Plus, Trophy, Medal, Star, Crown, Gift, Award, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StudentAvatar } from "../components/avatar-generator"
import { getStudents } from "../data"

// Sample achievements data
const achievements = [
  {
    id: "1",
    title: "Design Star",
    description: "Exceptional creativity in design solutions",
    icon: Star,
    color: "bg-yellow-100 text-yellow-800",
    students: 0,
    points: 100,
  },
  {
    id: "2",
    title: "Section Master",
    description: "Completed all sections with high marks",
    icon: Crown,
    color: "bg-purple-100 text-purple-800",
    students: 0,
    points: 150,
  },
  {
    id: "3",
    title: "Most Improved",
    description: "Greatest improvement in grades",
    icon: Medal,
    color: "bg-blue-100 text-blue-800",
    students: 0,
    points: 75,
  },
  {
    id: "4",
    title: "Perfect Score",
    description: "Achieved 100% in any section",
    icon: Trophy,
    color: "bg-green-100 text-green-800",
    students: 0,
    points: 200,
  },
  {
    id: "5",
    title: "Team Leader",
    description: "Exceptional leadership in group work",
    icon: Crown,
    color: "bg-red-100 text-red-800",
    students: 0,
    points: 100,
  },
  {
    id: "6",
    title: "Innovation Award",
    description: "Created an innovative solution",
    icon: Star,
    color: "bg-indigo-100 text-indigo-800",
    students: 0,
    points: 125,
  },
]

// Sample rewards data
const rewards = [
  {
    id: "1",
    title: "Homework Pass",
    description: "Skip one homework assignment",
    points: 200,
    available: 10,
    claimed: 0,
    icon: Gift,
  },
  {
    id: "2",
    title: "Extra Credit",
    description: "Earn 5% extra credit on any assignment",
    points: 300,
    available: 5,
    claimed: 0,
    icon: Award,
  },
  {
    id: "3",
    title: "Class Choice",
    description: "Choose a class activity for one period",
    points: 400,
    available: 3,
    claimed: 0,
    icon: Crown,
  },
  {
    id: "4",
    title: "3D Printing Time",
    description: "30 minutes of 3D printing time for personal projects",
    points: 150,
    available: 15,
    claimed: 0,
    icon: Gift,
  },
]

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("achievements")
  const [students, setStudents] = useState<any[]>([])

  // Load real students from data.ts
  useEffect(() => {
    const loadedStudents = getStudents()
    setStudents(loadedStudents)
  }, [])

  // All students start with 0 points
  const topStudents = students.slice(0, 5).map((student) => ({
    name: student.name,
    points: 0, // All students start at 0 points
  }))

  // No recent awards yet since everyone starts at 0
  const recentAwards: any[] = []

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">No Students Found</h1>
          <p className="text-muted-foreground mb-4">Import your student data first to see rewards and achievements.</p>
          <Button onClick={() => (window.location.href = "/data-import")}>Import Student Data</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rewards & Achievements</h1>
          <p className="text-muted-foreground">Motivate students with achievements and rewards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Achievement
          </Button>
          <Button>
            <Gift className="mr-2 h-4 w-4" />
            Create Reward
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {achievements.reduce((acc, a) => acc + a.students, 0)} achievements awarded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewards.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {rewards.reduce((acc, r) => acc + (r.available - r.claimed), 0)} rewards remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points Circulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-2">Total points awarded to students</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="achievements" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement) => (
                  <Card key={achievement.id}>
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
                        <Badge variant="outline">{achievement.students} students</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-muted-foreground">Points:</div>
                        <Badge variant="secondary">{achievement.points} pts</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        Award
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Achievement</DropdownMenuItem>
                          <DropdownMenuItem>View Recipients</DropdownMenuItem>
                          <DropdownMenuItem>Delete Achievement</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="rewards" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {rewards.map((reward) => (
                  <Card key={reward.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{reward.title}</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <reward.icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{reward.points} points</Badge>
                          <div className="text-sm">
                            {reward.claimed}/{reward.available} claimed
                          </div>
                        </div>
                        <Progress value={(reward.claimed / reward.available) * 100} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Claims
                      </Button>
                      <Button size="sm">Edit Reward</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Point Earners</CardTitle>
              <CardDescription>Students with most achievement points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium">
                      {index + 1}
                    </div>
                    <StudentAvatar name={student.name} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{student.name}</p>
                    </div>
                    <div className="font-medium">{student.points} pts</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Students
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Awards</CardTitle>
              <CardDescription>Latest achievements awarded</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAwards.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No achievements awarded yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Start awarding achievements to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAwards.map((award, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <StudentAvatar name={award.student} size="sm" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{award.student}</p>
                        <p className="text-sm text-muted-foreground">
                          Earned <span className="font-medium">{award.achievement}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{award.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
