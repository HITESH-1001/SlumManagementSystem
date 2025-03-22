"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2, MessageSquare } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Chatbot from "@/components/chatbot"

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("username")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showChatbot, setShowChatbot] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (activeTab === "username" && (!username || !password)) {
      setError("Username and password are required")
      return
    }

    if (activeTab === "phone" && (!phoneNumber || !otp)) {
      setError("Phone number and OTP are required")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (!forgotPasswordEmail) {
      setError("Email is required")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate password reset email
    setTimeout(() => {
      setIsLoading(false)
      setResetSent(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{showForgotPassword ? "Reset Password" : "Login"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowChatbot(!showChatbot)} className="text-primary">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
            <CardDescription>
              {showForgotPassword
                ? "Enter your email to receive a password reset link"
                : "Enter your details to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {resetSent ? (
                  <Alert>
                    <AlertTitle>Check your email</AlertTitle>
                    <AlertDescription>We've sent a password reset link to {forgotPasswordEmail}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Send Reset Link
                    </Button>
                  </>
                )}

                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetSent(false)
                  }}
                >
                  Back to Login
                </Button>
              </form>
            ) : (
              <Tabs defaultValue="username" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="username">Username</TabsTrigger>
                  <TabsTrigger value="phone">Phone Number</TabsTrigger>
                </TabsList>
                <TabsContent value="username">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Password</Label>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Login
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="phone">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="phone"
                          placeholder="Enter your phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          disabled={otpSent}
                        />
                        <Button
                          type="button"
                          variant={otpSent ? "outline" : "default"}
                          onClick={handleSendOTP}
                          disabled={isLoading || otpSent}
                          className="whitespace-nowrap"
                        >
                          {isLoading && !otpSent ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                          {otpSent ? "Resend OTP" : "Send OTP"}
                        </Button>
                      </div>
                    </div>

                    {otpSent && (
                      <div className="space-y-2">
                        <Label htmlFor="otp">OTP Verification</Label>
                        <Input
                          id="otp"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          A 6-digit OTP has been sent to your phone number
                        </p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading || !otpSent}>
                      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Login
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary font-medium">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>

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

