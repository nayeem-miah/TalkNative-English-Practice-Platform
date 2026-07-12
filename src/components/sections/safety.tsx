import { Shield, Eye, Lock } from "lucide-react";

const safetyFeatures = [
  {
    title: "AI Moderation",
    description: "Real-time content filtering and automated behavioral monitoring.",
    icon: Shield,
  },
  {
    title: "Instant Reporting",
    description: "Flag inappropriate behavior immediately with a single click for human review.",
    icon: Eye,
  },
  {
    title: "Data Privacy",
    description: "Your personal data is encrypted and never shared with conversation partners.",
    icon: Lock,
  },
];

export function Safety() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="bg-card text-card-foreground rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-border/70 shadow-[0_15px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
          <div className="p-8 md:p-12 lg:p-16 space-y-12">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Security First</span>
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground leading-tight tracking-tight">
                Platform Safety
              </h2>
              <p className="text-muted-foreground text-sm max-w-md">
                We prioritize a respectful, harassment-free environment so you can focus on learning without worry.
              </p>
            </div>

            <div className="space-y-6">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group/item">
                  <div className="mt-1 h-9 w-9 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:scale-105 transition-all duration-300">
                    <feature.icon className="h-4 w-4 transition-transform group-hover/item:rotate-12 duration-300" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-foreground font-bold text-base transition-colors group-hover/item:text-primary">{feature.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block bg-muted/20 border-l border-border/80 overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full max-w-sm rounded-xl border border-border/80 bg-background p-6 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-bold text-foreground">Secure Connection</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-black tracking-wider uppercase">Active</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Session Protocol</span>
                      <span className="font-semibold text-foreground">SRTP / TLS 1.3</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">End-to-End Encryption</span>
                      <span className="font-semibold text-foreground">256-bit AES</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Privacy Mode</span>
                      <span className="font-semibold text-primary">Enabled</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border/50 flex items-center justify-center gap-2 text-xs font-black text-primary select-none">
                    <Shield className="h-4 w-4 text-primary animate-pulse" />
                    TalkNative SafeTunnel™
                  </div>
                </div>
             </div>
             <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} 
             />
          </div>
        </div>
      </div>
    </section>
  )
}
