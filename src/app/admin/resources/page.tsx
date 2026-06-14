"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  BookOpen,
  Layout,
  Star,
  Download,
  Users,
  Play,
  FileText as FileIcon,
  Link as LinkIcon,
  Globe,
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const resourceStats = [
  { name: "Total Resources", value: "84", icon: BookOpen, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { name: "Active Lessons", value: "72", icon: Layout, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { name: "Avg. Rating", value: "4.8", icon: Star, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" },
]

const resourcesList = [
  { id: 1, title: "Mastering Business Negotiations", category: "Business", level: "Advanced", enrollment: "3,450", rating: "4.9", status: "Published", date: "May 10, 2024", type: "Video" },
  { id: 2, title: "Common Idioms in Daily Life", category: "General", level: "Intermediate", enrollment: "1,280", rating: "4.7", status: "Draft", date: "May 08, 2024", type: "Document" },
  { id: 3, title: "English for Travel & Tourism", category: "Travel", level: "Beginner", enrollment: "840", rating: "4.8", status: "Published", date: "May 05, 2024", type: "Link" },
]

export default function AdminResourcesPage() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Resource Management</h1>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">Create and manage dynamic learning materials for your students.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button className="h-10 rounded-lg bg-zinc-900 dark:bg-primary text-white dark:text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-6 shadow-md hover:opacity-90 transition-all active:scale-95">
              <Plus className="h-4 w-4 mr-2" /> Create New Resource
            </Button>
          } />
          <DialogContent className="sm:max-w-[550px] rounded-2xl border-border bg-card p-0 overflow-hidden shadow-2xl">
            <div className="p-8 pb-4">
              <DialogHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold tracking-tight text-foreground">Add New Resource</DialogTitle>
                </div>
                <DialogDescription className="text-xs text-muted-foreground font-medium">
                  Provide the essential details to publish this learning material.
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <div className="px-8 pb-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-0.5">Resource Title</Label>
                  <Input id="title" placeholder="e.g. Advanced Vocabulary" className="h-10 rounded-lg border-border bg-muted/20 focus:bg-background transition-all focus:ring-0" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="type" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-0.5">Content Type</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-border bg-muted/20 focus:bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border shadow-xl">
                      <SelectItem value="video" className="rounded-lg py-2 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Play className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> <span className="text-sm">Video (YouTube)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="document" className="rounded-lg py-2 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-3.5 w-3.5 text-blue-500" /> <span className="text-sm">Document / PDF</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="link" className="rounded-lg py-2 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-3.5 w-3.5 text-emerald-500" /> <span className="text-sm">External Link</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="url" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-0.5">Content URL</Label>
                <div className="relative group">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-focus-within:text-primary" />
                  <Input id="url" placeholder="https://..." className="pl-10 h-10 rounded-lg border-border bg-muted/20 focus:bg-background transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-0.5">Category</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-border bg-muted/20 focus:bg-background">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="business" className="text-sm">Business English</SelectItem>
                      <SelectItem value="general" className="text-sm">General English</SelectItem>
                      <SelectItem value="travel" className="text-sm">Travel & Culture</SelectItem>
                      <SelectItem value="exams" className="text-sm">Exam Prep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="level" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-0.5">Difficulty Level</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-border bg-muted/20 focus:bg-background">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="beginner" className="text-sm">Beginner</SelectItem>
                      <SelectItem value="intermediate" className="text-sm">Intermediate</SelectItem>
                      <SelectItem value="advanced" className="text-sm">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="desc" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-0.5">Description</Label>
                <Textarea id="desc" placeholder="Brief overview of the lesson contents..." className="min-h-[100px] rounded-lg border-border bg-muted/20 focus:bg-background resize-none transition-all text-sm leading-relaxed" />
              </div>
            </div>

            <DialogFooter className="p-6 bg-muted/10 border-t border-border flex flex-row items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setOpen(false)} className="h-10 px-6 rounded-lg font-bold text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-muted/50">
                Cancel
              </Button>
              <Button className="h-10 px-8 rounded-lg bg-zinc-900 dark:bg-primary text-white dark:text-primary-foreground font-bold text-[10px] uppercase tracking-widest shadow-md hover:opacity-90 active:scale-95 transition-all">
                Save Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resourceStats.map((stat) => (
          <Card key={stat.name} className="border-border bg-card shadow-none rounded-xl transition-all hover:border-primary/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{stat.name}</p>
                <p className="text-2xl font-black text-foreground tracking-tighter">{stat.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm`}>
                <stat.icon className="h-5.5 w-5.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card shadow-none rounded-xl overflow-hidden">
        <CardHeader className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input 
              placeholder="Search resources..." 
              className="pl-11 h-12 rounded-xl border-border bg-muted/20 transition-all focus:ring-primary/10"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border bg-background hover:bg-muted transition-all">
              <Filter className="h-4.5 w-4.5 text-muted-foreground" />
            </Button>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border bg-background hover:bg-muted transition-all">
              <Download className="h-4.5 w-4.5 text-muted-foreground" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border bg-muted/30">
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Resource Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Difficulty</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Enrollees</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {resourcesList.map((resource) => (
                <tr key={resource.id} className="group hover:bg-muted/20 transition-colors cursor-default">
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <p className="font-bold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">{resource.title}</p>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{resource.rating} Rating</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {resource.type === "Video" ? <Play className="h-4 w-4 text-rose-500 fill-rose-500" /> : resource.type === "Document" ? <FileIcon className="h-4 w-4 text-blue-500" /> : <LinkIcon className="h-4 w-4 text-emerald-500" />}
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{resource.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-tighter bg-muted/50 border-border text-muted-foreground">
                      {resource.level}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground tracking-tighter">{resource.enrollment}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-tighter shadow-sm",
                      resource.status === "Published" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20"
                    )}>
                      {resource.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 transition-all">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted transition-all">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
