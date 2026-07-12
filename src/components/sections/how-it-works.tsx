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
        
        <div className="relative">
          {/* Desktop Dotted Connection Path */}
          <div className="absolute top-1/2 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-primary/20 -translate-y-1/2 -z-10 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="border border-border/80 dark:border-zinc-800 shadow-sm bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 rounded-2xl relative overflow-hidden group hover:-translate-y-1">
                {/* Large stylish background numeral watermark */}
                <div className="absolute -right-4 -bottom-6 text-8xl font-black text-slate-100 dark:text-zinc-900/40 select-none pointer-events-none transition-all duration-300 group-hover:text-primary/5 group-hover:scale-105 font-sans leading-none">
                  {step.number}
                </div>

                <CardHeader className="flex flex-col items-start p-6 pb-2 relative z-10">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="font-heading text-lg font-extrabold mt-4 text-foreground">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2 relative z-10">
                  <CardDescription className="text-xs leading-relaxed text-muted-foreground text-left font-medium">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
