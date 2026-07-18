"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone, Send, Sparkles } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

export function ContactClient() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      toast.success("Thank you! Your message has been sent successfully.")
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background ambient glow matching theme */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3.5 py-1 text-xs font-semibold rounded-full gap-1.5 inline-flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Get In Touch
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            We&apos;re Here to <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">Help You</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Have questions about TalkNative, practice sessions, or course enrollments? Send us a message and our support team will get back to you shortly.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-500" />
                  Contact Information
                </CardTitle>
                <CardDescription className="text-xs">
                  Reach out to us directly through any of the channels below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Email Us</h4>
                    <p className="text-sm font-semibold text-foreground">support@talknative.com</p>
                    <p className="text-xs text-muted-foreground">For general inquiries and support</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Call / WhatsApp</h4>
                    <p className="text-sm font-semibold text-foreground">+1 (800) 555-TALK</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri from 9am to 6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Office Location</h4>
                    <p className="text-sm font-semibold text-foreground">123 Language Way, Suite 400</p>
                    <p className="text-xs text-muted-foreground">Tech City, CA 94016, USA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Response Time</h4>
                    <p className="text-sm font-semibold text-foreground">Within 24 Hours</p>
                    <p className="text-xs text-muted-foreground">Support team available 7 days a week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional info badge */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Looking for community discussions? Check our <span className="font-semibold text-foreground">Community Feed</span> or practice in real-time.
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-7">
            <Card className="border border-border/60 shadow-md bg-card">
              <CardHeader className="space-y-1.5 pb-6">
                <CardTitle className="text-xl font-extrabold tracking-tight">
                  Send Us a Message
                </CardTitle>
                <CardDescription className="text-xs">
                  Fill out the form below and we will get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-foreground">Message Sent Successfully!</h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Thank you for reaching out. We have received your message and will respond to your email shortly.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 border-emerald-500/30 hover:bg-emerald-500/10 text-xs font-bold"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold">Your Name <span className="text-destructive">*</span></Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="text-xs h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold">Email Address <span className="text-destructive">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="text-xs h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-xs font-bold">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="text-xs h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-xs font-bold">Message <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="text-xs resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 text-xs transition-all shadow-md shadow-emerald-500/20 gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
