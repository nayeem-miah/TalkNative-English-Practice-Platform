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
    number: "01",
    title: "Match",
    description: "Our smart algorithm finds you a partner at your level in seconds. No waiting, just learning.",
    icon: Search,
  },
  {
    number: "02",
    title: "Talk",
    description: "Engage in 15-minute video or audio calls. Use our built-in icebreakers to keep the conversation flowing.",
    icon: MessageSquare,
  },
  {
    number: "03",
    title: "Improve",
    description: "Get instant feedback from your partner and track your progress with AI-powered fluency metrics.",
    icon: TrendingUp,
  },
];

export function HowItWorks() {
  return (
    <section id="features" className="py-24 bg-zinc-50/50 dark:bg-zinc-900/10 border-y border-border/40">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Process Flow</span>
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground tracking-tight">How it Works</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            From greeting to fluency in three simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border border-border/80 dark:border-zinc-800 shadow-sm bg-card hover:border-primary/30 transition-all duration-200 rounded-xl relative overflow-hidden group">
              <CardHeader className="flex flex-col items-start p-6 pb-2">
                <div className="flex justify-between items-center w-full">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-black text-muted-foreground/20 group-hover:text-primary/20 transition-colors select-none font-sans">
                    {step.number}
                  </span>
                </div>
                <CardTitle className="font-heading text-lg font-semibold mt-4">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <CardDescription className="text-xs leading-relaxed text-muted-foreground text-left">
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
