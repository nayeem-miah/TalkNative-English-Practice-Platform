"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Filter, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterBarProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  levelFilter: string
  setLevelFilter: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
}

export function FilterBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  levelFilter,
  setLevelFilter,
  sortBy,
  setSortBy,
}: FilterBarProps) {
  return (
    <Card className="rounded-2xl border border-border shadow-sm bg-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 rounded-xl bg-background"
        />
      </div>

      {/* Filters Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
            <SelectTrigger className="h-10 text-xs font-semibold rounded-xl border border-input bg-background px-3 py-1 min-w-[110px] cursor-pointer focus-visible:ring-0">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border bg-card z-50">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Level filter */}
        <Select value={levelFilter} onValueChange={(val) => setLevelFilter(val || "ALL")}>
          <SelectTrigger className="h-10 text-xs font-semibold rounded-xl border border-input bg-background px-3 py-1 min-w-[110px] cursor-pointer focus-visible:ring-0">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-border bg-card z-50">
            <SelectItem value="ALL">All Levels</SelectItem>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort selection */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(val) => setSortBy(val || "NEWEST")}>
            <SelectTrigger className="h-10 text-xs font-semibold rounded-xl border border-input bg-background px-3 py-1 min-w-[140px] cursor-pointer focus-visible:ring-0">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border bg-card z-50">
              <SelectItem value="NEWEST">Newest Updated</SelectItem>
              <SelectItem value="OLDEST">Oldest Updated</SelectItem>
              <SelectItem value="MOST_STUDENTS">Most Students</SelectItem>
              <SelectItem value="HIGHEST_REVENUE">Highest Revenue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
