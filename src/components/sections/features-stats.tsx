/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { useGetallUsrsQuery } from "@/redux/api/auth-api";
import { Clock, Globe, Star, Users } from "lucide-react";
import * as React from "react";

function AnimatedCounter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = React.useState("0");

  React.useEffect(() => {
    const cleanStr = value.replace(/,/g, "").replace(/\+/g, "");

    if (value.includes("/")) {
      const parts = value.split("/");
      const targetVal = parseFloat(parts[0].trim());
      const maxVal = parts[1].trim();

      const start = 0;
      const duration = 1200;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress * (2 - progress);
        const current = start + ease * (targetVal - start);
        setDisplayValue(`${current.toFixed(1)} / ${maxVal}`);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      const targetVal = parseInt(cleanStr, 10);
      if (isNaN(targetVal)) {
        setTimeout(() => setDisplayValue(value), 0);
        return;
      }

      const start = 0;
      const duration = 1500;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress * (2 - progress);
        const current = Math.floor(start + ease * (targetVal - start));
        setDisplayValue(current.toLocaleString() + (value.includes("+") ? "+" : ""));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value]);

  return <span>{displayValue}</span>;
}

export function FeaturesStats() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  // Fetch dynamic total users count
  const { data: allUsersResponse } = useGetallUsrsQuery({ page: 1, limit: 1 }, {
    skip: !mounted,
  });

  const totalUsers = React.useMemo(() => {
    return allUsersResponse?.meta?.total || (allUsersResponse as any)?.data?.meta?.total || (allUsersResponse as any)?.data?.result?.length || 50000;
  }, [allUsersResponse]);

  const stats = React.useMemo(() => {
    // Dynamic calculations based on user base
    const activeLearnersStr = totalUsers.toLocaleString() + "+";
    const minutesPracticedStr = (totalUsers * 24).toLocaleString() + "+";

    // Growth-based countries representation (capped at standard maximums)
    const countriesCount = Math.min(195, Math.max(120, Math.floor(totalUsers / 350)));
    const countriesStr = countriesCount + "+";

    return [
      {
        value: activeLearnersStr,
        label: "Active Learners",
        description: "Language enthusiasts practicing daily.",
        icon: Users,
        theme: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
      },
      {
        value: minutesPracticedStr,
        label: "Speaking Minutes",
        description: "Real-time interactive voice practice.",
        icon: Clock,
        theme: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400"
      },
      {
        value: countriesStr,
        label: "Countries",
        description: "Diverse global speaking community.",
        icon: Globe,
        theme: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400"
      },
      {
        value: "4.9 / 5.0",
        label: "Partner Rating",
        description: "High quality peer feedback loops.",
        icon: Star,
        theme: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400"
      },
    ];
  }, [totalUsers]);

  return (
    <section className="py-20 bg-background border-t border-border/40">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border border-border/80 dark:border-zinc-800 shadow-sm bg-card hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(13,92,83,0.06)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${stat.theme}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-heading font-extrabold text-foreground tracking-tight">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
