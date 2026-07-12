"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Filter, Search } from "lucide-react"

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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 text-xs font-semibold rounded-xl border border-input bg-background px-3 py-1 cursor-pointer outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        {/* Level filter */}
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="h-10 text-xs font-semibold rounded-xl border border-input bg-background px-3 py-1 cursor-pointer outline-none"
        >
          <option value="ALL">All Levels</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>

        {/* Sort selection */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 text-xs font-semibold rounded-xl border border-input bg-background px-3 py-1 cursor-pointer outline-none"
          >
            <option value="NEWEST">Newest Updated</option>
            <option value="OLDEST">Oldest Updated</option>
            <option value="MOST_STUDENTS">Most Students</option>
            <option value="HIGHEST_REVENUE">Highest Revenue</option>
          </select>
        </div>
      </div>
    </Card>
  )
}
