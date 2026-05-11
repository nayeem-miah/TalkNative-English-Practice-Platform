import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Headphones, Laptop, MessageCircle, ArrowRight, Star } from "lucide-react"

export default function ResourcesPage() {
  const resourceCategories = [
    { title: "Speaking Guides", icon: BookOpen, count: 24, color: "bg-blue-500/10 text-blue-600" },
    { title: "Listening Exercises", icon: Headphones, count: 18, color: "bg-emerald-500/10 text-emerald-600" },
    { title: "Video Lessons", icon: Laptop, count: 12, color: "bg-purple-500/10 text-purple-600" },
    { title: "Community Tips", icon: MessageCircle, count: 156, color: "bg-orange-500/10 text-orange-600" },
  ];

  return (
    <div className="container px-4 md:px-8 py-12 mx-auto space-y-12">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">Learning Resources</h1>
        <p className="text-lg text-muted-foreground">
          Curated materials to complement your practice sessions and accelerate your learning.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resourceCategories.map((cat, i) => (
          <Card key={i} className="border-none shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className={`h-12 w-12 rounded-xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">{cat.title}</h3>
              <p className="text-sm text-muted-foreground">{cat.count} resources</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold">Featured Lessons</h2>
          <Button variant="link" className="text-primary gap-1">View all <ArrowRight className="h-4 w-4" /></Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-none shadow-xl shadow-primary/5 group">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <Button size="sm" className="w-full">Start Lesson</Button>
                </div>
                <img
                  src={`https://images.unsplash.com/photo-${i === 1 ? '1434030216411-0b793f4b4173' : i === 2 ? '1523240795612-9a054b0db644' : '1516321318423-f06f85e504b3'}?q=80&w=600&auto=format&fit=crop`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Lesson thumbnail"
                />
                <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white flex gap-1 items-center">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> 4.9
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Business</Badge>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Advanced</Badge>
                </div>
                <CardTitle className="font-heading group-hover:text-primary transition-colors">Mastering Business Negotiations</CardTitle>
                <CardDescription>Learn key idioms and phrases used in high-stakes business environments.</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 text-xs text-muted-foreground">
                15 min • 3,450 students enrolled
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
