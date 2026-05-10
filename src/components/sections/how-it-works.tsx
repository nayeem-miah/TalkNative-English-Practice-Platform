import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Search, MessageSquare, TrendingUp } from "lucide-react";

const steps = [
  {
    title: "Match",
    description: "Our smart algorithm finds you a partner at your level in seconds. No waiting, just learning.",
    icon: Search,
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    title: "Talk",
    description: "Engage in 15-minute video or audio calls. Use our built-in icebreakers to keep the conversation flowing.",
    icon: MessageSquare,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Improve",
    description: "Get instant feedback from your partner and track your progress with AI-powered fluency metrics.",
    icon: TrendingUp,
    color: "bg-blue-500/10 text-blue-600",
  },
];

export function HowItWorks() {
  return (
    <section id="features" className="py-24 bg-secondary/20">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">How it Works</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base">
            From greeting to fluency in three simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-none shadow-xl shadow-primary/5 bg-background text-center py-8">
              <CardHeader className="flex flex-col items-center">
                <div className={`p-4 rounded-2xl ${step.color} mb-4`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <CardTitle className="font-heading text-2xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed px-4">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
