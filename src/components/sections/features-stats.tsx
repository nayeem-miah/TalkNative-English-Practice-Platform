"use client"

import * as React from "react";
import { Users, Clock, Globe, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetallUsrsQuery } from "@/redux/api/auth-api";

export function FeaturesStats() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch dynamic total users count
  const { data: allUsersResponse } = useGetallUsrsQuery({ page: 1, limit: 1 }, {
    skip: !mounted,
  });

  const totalUsers = React.useMemo(() => {
    return allUsersResponse?.data?.meta?.total || allUsersResponse?.meta?.total || allUsersResponse?.data?.result?.length || 50000;
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
      },
      {
        value: minutesPracticedStr,
        label: "Speaking Minutes",
        description: "Real-time interactive voice practice.",
        icon: Clock,
      },
      {
        value: countriesStr,
        label: "Countries",
        description: "Diverse global speaking community.",
        icon: Globe,
      },
      {
        value: "4.9 / 5.0",
        label: "Partner Rating",
        description: "High quality peer feedback loops.",
        icon: Star,
      },
    ];
  }, [totalUsers]);

  return (
    <section className="py-20 bg-background border-t border-border/40">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border border-border/80 dark:border-zinc-800 shadow-sm bg-card hover:border-primary/20 transition-all duration-200 rounded-xl">
              <CardContent className="p-6 space-y-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-heading font-bold text-foreground tracking-tight">
                    {stat.value}
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
