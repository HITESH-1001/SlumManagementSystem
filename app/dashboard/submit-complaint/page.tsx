"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, MessageSquare, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { motion } from "framer-motion"
import Chatbot from "@/components/chatbot"
import { useRouter } from "next/navigation"

export default function SubmitComplaintPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [complaintId, setComplaintId] = useState("")
  const [showChatbot, setShowChatbot] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (!title || !description || !category || !location) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate AI priority scoring and submission
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
      setComplaintId("CM" + Math.floor(10000 + Math.random() * 90000))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" className="gap-2" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Submit a Complaint</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="text-primary"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
              <CardDescription>Fill in the details of your complaint for quick resolution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success ? (
                <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Complaint Submitted Successfully!</AlertTitle>
                  <AlertDescription>
                    Your complaint has been submitted with ID: <strong>{complaintId}</strong>. You can track the status
                    of your complaint in the{" "}
                    <Link href={`/dashboard/track-status?id=${complaintId}`} className="font-medium underline">
                      Track Status
                    </Link>{" "}
                    page.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Complaint Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a brief title for your complaint"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="water">Water Supply</SelectItem>
                        <SelectItem value="sanitation">Sanitation</SelectItem>
                        <SelectItem value="electricity">Electricity</SelectItem>
                        <SelectItem value="road">Road Maintenance</SelectItem>
                        <SelectItem value="waste">Waste Management</SelectItem>
                        <SelectItem value="housing">Housing Issues</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      placeholder="Enter the location of the issue"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of the issue"
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image")?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Choose File
                      </Button>
                      <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      {image && <span className="text-sm text-muted-foreground">{image.name}</span>}
                    </div>
                    {imagePreview && (
                      <div className="mt-2">
                        <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-h-40 rounded-md" />
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                      <AlertTitle>AI Priority Scoring</AlertTitle>
                      <AlertDescription>
                        Our AI system will automatically analyze your complaint to assign a priority level and route it
                        to the appropriate authorities for quick resolution.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Submit Complaint"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            {success && (
              <CardFooter>
                <div className="flex gap-4 w-full">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setTitle("")
                      setDescription("")
                      setCategory("")
                      setLocation("")
                      setImage(null)
                      setImagePreview(null)
                      setSuccess(false)
                    }}
                  >
                    Submit Another Complaint
                  </Button>
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full">Return to Dashboard</Button>
                  </Link>
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
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

