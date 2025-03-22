"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, FileText, Home, LogOut, MessageSquare, PlusCircle, Settings, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Chatbot from "@/components/chatbot"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

type Notification = {
  id: string
  title: string
  description: string
  date: string
  read: boolean
}

type Complaint = {
  id: string
  title: string
  description: string
  status: "pending" | "processing" | "resolved" | "rejected"
  priority: "low" | "medium" | "high"
  date: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [showChatbot, setShowChatbot] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Complaint Status Updated",
      description: "Your complaint #1234 has been processed and is now being reviewed.",
      date: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "New Announcement",
      description: "Community meeting scheduled for next Sunday at 10 AM.",
      date: "1 day ago",
      read: true,
    },
    {
      id: "3",
      title: "Maintenance Notice",
      description: "Water supply will be interrupted on Friday from 10 AM to 2 PM for maintenance.",
      date: "2 days ago",
      read: true,
    },
  ])

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "1234",
      title: "Water Leakage",
      description: "There is a water leakage in the main pipeline near Block C.",
      status: "processing",
      priority: "high",
      date: "2023-03-15",
    },
    {
      id: "1235",
      title: "Street Light Not Working",
      description: "The street light at the entrance of Block A is not working for the past week.",
      status: "pending",
      priority: "medium",
      date: "2023-03-10",
    },
    {
      id: "1236",
      title: "Garbage Collection Issue",
      description: "Garbage has not been collected from Block D for the last 3 days.",
      status: "resolved",
      priority: "high",
      date: "2023-03-05",
    },
  ])

  const unreadNotifications = notifications.filter((n) => !n.read).length

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  }

  const priorityColors = {
    low: "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-64 bg-white dark:bg-slate-800 p-4 md:h-screen md:fixed left-0 top-0 border-r">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              SMS
            </div>
            <h1 className="text-xl font-bold">Slum Management</h1>
          </div>

          <div className="flex flex-col gap-1">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home className="h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/submit-complaint">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <PlusCircle className="h-5 w-5" />
                New Complaint
              </Button>
            </Link>
            <Link href="/dashboard/track-status">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-5 w-5" />
                Track Status
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-2 relative" onClick={() => {}}>
              <Bell className="h-5 w-5" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge className="absolute right-2 top-2 h-5 w-5 p-0 flex items-center justify-center">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setShowChatbot(!showChatbot)}>
              <MessageSquare className="h-5 w-5" />
              AI Assistant
            </Button>
            <Link href="/dashboard/profile">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User className="h-5 w-5" />
                Profile
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => router.push("/")}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="md:ml-64 flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, User</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2" onClick={() => setShowChatbot(!showChatbot)}>
                <MessageSquare className="h-5 w-5" />
                AI Assistant
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{complaints.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{complaints.filter((c) => c.status === "pending").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{complaints.filter((c) => c.status === "resolved").length}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="complaints">
            <TabsList className="mb-4">
              <TabsTrigger value="complaints">Recent Complaints</TabsTrigger>
              <TabsTrigger value="notifications">
                Notifications
                {unreadNotifications > 0 && <Badge className="ml-2">{unreadNotifications}</Badge>}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="complaints">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Complaints</CardTitle>
                    <Link href="/dashboard/submit-complaint">
                      <Button size="sm" className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        New Complaint
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>View and track your recent complaints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <div
                        key={complaint.id}
                        className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{complaint.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              ID: {complaint.id} • {complaint.date}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={priorityColors[complaint.priority]}>
                              {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)} Priority
                            </Badge>
                            <Badge className={statusColors[complaint.status]}>
                              {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm">{complaint.description}</p>
                        <div className="mt-2 flex justify-end">
                          <Link href={`/dashboard/track-status?id=${complaint.id}`}>
                            <Button variant="link" size="sm" className="h-auto p-0">
                              Track Status
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/track-status">
                    <Button variant="outline" className="w-full">
                      View All Complaints
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="notifications">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Notifications</CardTitle>
                    <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadNotifications === 0}>
                      Mark all as read
                    </Button>
                  </div>
                  <CardDescription>Stay updated with the latest announcements and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No notifications to display</p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-4 ${
                            !notification.read
                              ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          } transition-colors`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <p className="text-xs text-muted-foreground">{notification.date}</p>
                          </div>
                          <p className="text-sm">{notification.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showChatbot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 z-50 w-80 md:w-96"
        >
          <Chatbot onClose={() => setShowChatbot(false)} />
        </motion.div>
      )}
    </div>
  )
}

