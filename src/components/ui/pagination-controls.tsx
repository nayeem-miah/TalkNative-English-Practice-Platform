import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems: number
  limit: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-border/60 px-4 py-4 sm:px-6 mt-8 bg-card rounded-2xl border">
      {/* Mobile pagination controls */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          className="rounded-xl font-bold text-xs"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          className="rounded-xl font-bold text-xs"
        >
          Next
        </Button>
      </div>

      {/* Desktop pagination controls */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold text-muted-foreground">
            Showing <span className="text-foreground font-black">{(currentPage - 1) * limit + 1}</span> to{" "}
            <span className="text-foreground font-black">
              {Math.min(currentPage * limit, totalItems)}
            </span>{" "}
            of <span className="text-foreground font-black">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl gap-1" aria-label="Pagination">
            <Button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-border/50 hover:bg-muted font-bold text-xs"
            >
              <span className="sr-only">Previous</span>
              &larr;
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                variant={currentPage === page ? "default" : "outline"}
                className={`h-9 w-9 rounded-xl p-0 font-black text-xs transition-all ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/95 border-none"
                    : "border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {page}
              </Button>
            ))}

            <Button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-border/50 hover:bg-muted font-bold text-xs"
            >
              <span className="sr-only">Next</span>
              &rarr;
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}
