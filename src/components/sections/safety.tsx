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
    <section className="py-24">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="bg-zinc-950 rounded-[40px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-2xl">
          <div className="p-12 md:p-20 space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">
                Platform Safety
              </h2>
              <p className="text-zinc-400 text-lg max-w-md">
                We prioritize a respectful, harassment-free environment so you can focus on learning without worry.
              </p>
            </div>

            <div className="space-y-8">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-5">
                  <div className="mt-1 h-10 w-10 shrink-0 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-lg">{feature.title}</h4>
                    <p className="text-zinc-500 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block bg-zinc-900 border-l border-zinc-800">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/40 blur-[100px] rounded-full" />
                   <Shield className="h-48 w-48 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                </div>
             </div>
             <div className="absolute inset-0 opacity-20" 
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '24px 24px' }} 
             />
          </div>
        </div>
      </div>
    </section>
  )
}
