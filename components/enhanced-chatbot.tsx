"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot, Paperclip, ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  attachments?: {
    type: "image" | "file"
    url: string
    name: string
  }[]
}

type EnhancedChatbotProps = {
  onClose: () => void
  userName?: string
  userRole?: "user" | "admin" | "authority"
}

export default function EnhancedChatbot({ onClose, userName = "User", userRole = "user" }: EnhancedChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello ${userName}! I'm your SMS assistant. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (input.trim() === "" && attachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      attachments: attachments.map((file) => ({
        type: file.type.startsWith("image/") ? "image" : "file",
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setAttachments([])
    setIsTyping(true)

    // Simulate bot response based on user role and input
    setTimeout(() => {
      let botResponse = ""
      const lowercaseInput = input.toLowerCase()

      // Role-specific responses
      if (userRole === "admin") {
        if (lowercaseInput.includes("analytics") || lowercaseInput.includes("report")) {
          botResponse =
            "You can access detailed analytics in the Analytics tab of the admin dashboard. Would you like me to show you how to generate specific reports?"
        } else if (
          lowercaseInput.includes("user") &&
          (lowercaseInput.includes("add") || lowercaseInput.includes("create"))
        ) {
          botResponse =
            "To add a new user, go to the Users tab in the admin dashboard and click on 'Add New User'. You'll need to provide their name, email, phone number, and role."
        } else {
          botResponse =
            "As an admin, you have access to all system features. You can manage complaints, users, authorities, and view analytics. What specific administrative task would you like help with?"
        }
      } else if (userRole === "authority") {
        if (lowercaseInput.includes("assign") || lowercaseInput.includes("complaint")) {
          botResponse =
            "You can view all complaints assigned to you in your authority dashboard. To update the status of a complaint, click on 'Update Status' next to the complaint."
        } else {
          botResponse =
            "As an authority, you're responsible for resolving assigned complaints. You can update the status of complaints, add notes, and communicate with users. How can I assist you with your authority tasks?"
        }
      } else {
        // Regular user responses
        if (
          lowercaseInput.includes("complaint") &&
          (lowercaseInput.includes("submit") || lowercaseInput.includes("file") || lowercaseInput.includes("new"))
        ) {
          botResponse =
            "To submit a new complaint, go to the dashboard and click on 'New Complaint'. Fill in the details including title, category, location, and description. You can also attach images if needed."
        } else if (lowercaseInput.includes("status") || lowercaseInput.includes("track")) {
          botResponse =
            "You can track the status of your complaints in the 'Track Status' section. Enter your complaint ID or browse through your complaints to see their current status and updates."
        } else if (lowercaseInput.includes("register") || lowercaseInput.includes("sign up")) {
          botResponse =
            "To register, click the Register button on the welcome page. You'll need to provide your username, phone number for OTP verification, and create a password."
        } else if (lowercaseInput.includes("login") || lowercaseInput.includes("sign in")) {
          botResponse =
            "You can login using your username and password or phone number with OTP verification. If you've forgotten your password, use the 'Forgot Password' link on the login page."
        } else if (lowercaseInput.includes("otp") || lowercaseInput.includes("verification")) {
          botResponse =
            "OTP verification is used during registration and phone number login. Enter your phone number, and we'll send you a 6-digit OTP to verify your identity."
        } else if (lowercaseInput.includes("priority") || lowercaseInput.includes("urgent")) {
          botResponse =
            "Our AI system automatically assigns priority to complaints based on their nature, category, and description. High priority complaints are addressed more quickly."
        } else if (attachments.length > 0) {
          botResponse =
            "Thank you for sharing the attachment. This will help in better understanding and resolving your issue. Is there anything specific about this attachment you'd like to highlight?"
        } else {
          botResponse =
            "I'm here to help with any questions about the Slum Management System. You can ask about submitting complaints, tracking status, account management, or any other features."
        }
      }

      const newBotMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newBotMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...filesArray])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitComplaint = () => {
    // Simulate submitting a complaint through the chatbot
    setIsTyping(true)

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now().toString(),
        content:
          "I've created a new complaint based on our conversation. The complaint ID is CM" +
          Math.floor(10000 + Math.random() * 90000) +
          ". You can track its status in the 'Track Status' section.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
      setActiveTab("chat")
    }, 2000)
  }

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          SMS AI Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="chat" className="flex-1">
            Chat
          </TabsTrigger>
          <TabsTrigger value="submit-complaint" className="flex-1">
            Submit Complaint
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="p-0 m-0">
          <CardContent className="p-0">
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start gap-2 max-w-[80%]">
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>

                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="rounded bg-background/50 p-2 text-sm">
                                {attachment.type === "image" ? (
                                  <div>
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="max-h-40 rounded-md object-contain"
                                    />
                                    <p className="mt-1 text-xs opacity-70">{attachment.name}</p>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="h-4 w-4" />
                                    <span>{attachment.name}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-secondary">{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 bg-muted">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-75" />
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 pt-2 border-t">
            {attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted rounded-full pl-2 pr-1 py-1 text-xs">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-3 w-3" />
                    ) : (
                      <Paperclip className="h-3 w-3" />
                    )}
                    <span className="max-w-[100px] truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex w-full items-center gap-2">
              <Button variant="outline" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-5 w-5" />
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />
              </Button>
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={input.trim() === "" && attachments.length === 0}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </TabsContent>

        <TabsContent value="submit-complaint" className="p-0 m-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Complaint Title</label>
                <Input placeholder="Enter a brief title for your complaint" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="">Select a category</option>
                  <option value="water">Water Supply</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="electricity">Electricity</option>
                  <option value="road">Road Maintenance</option>
                  <option value="waste">Waste Management</option>
                  <option value="housing">Housing Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input placeholder="Enter the location of the issue" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  placeholder="Provide a detailed description of the issue"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Attachments</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-4 w-4" />
                    Add Files
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    You can attach images or documents related to your complaint
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("chat")}>
              Cancel
            </Button>
            <Button onClick={handleSubmitComplaint}>Submit Complaint</Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

