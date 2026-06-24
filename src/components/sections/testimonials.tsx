"use client"

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Kenji Sato",
    location: "Tokyo, Japan",
    level: "Intermediate",
    nativeLanguage: "Japanese",
    feedback: "TalkNative has completely transformed my speaking confidence. Connecting with real learners in seconds is amazing, and I get feedback immediately.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Sofia Rodriguez",
    location: "São Paulo, Brazil",
    level: "Advanced",
    nativeLanguage: "Portuguese",
    feedback: "I love the 15-minute calls! They fit perfectly into my busy schedule, and the built-in topic prompts really help to keep the conversation structured.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Ahmed Mansour",
    location: "Cairo, Egypt",
    level: "Intermediate",
    nativeLanguage: "Arabic",
    feedback: "The AI moderation and safety features give me total peace of mind. It's a safe, friendly space where you can focus entirely on fluent practice.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Lukas Weber",
    location: "Berlin, Germany",
    level: "Advanced",
    nativeLanguage: "German",
    feedback: "As a busy professional, I needed something flexible. The instant matching connects me with intelligent partners worldwide whenever I have a spare slot.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    level: "Advanced",
    nativeLanguage: "Hindi",
    feedback: "Meeting diverse partners has broadened my vocabulary. I went from hesitating in meetings to leading them with complete clarity and confidence.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Min-jun Kim",
    location: "Seoul, South Korea",
    level: "Intermediate",
    nativeLanguage: "Korean",
    feedback: "The UI is clean and formal. The practice calls feel secure and safe. Highly recommend this platform to anyone trying to speak natural English.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Chloe Dubois",
    location: "Paris, France",
    level: "Upper-Intermediate",
    nativeLanguage: "French",
    feedback: "Absolutely love the AI speech metrics. Getting actionable insights into my speaking flow after calls has boosted my pronunciation dramatically.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Mateo Gomez",
    location: "Madrid, Spain",
    level: "Intermediate",
    nativeLanguage: "Spanish",
    feedback: "I was shy at first, but the community is supportive. The icebreaker prompts really help bridge any conversation gaps in the first few minutes.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Elena Rossi",
    location: "Rome, Italy",
    level: "Advanced",
    nativeLanguage: "Italian",
    feedback: "A perfect solution for maintaining fluency. I can converse with native-level speakers or fellow learners with identical language interests.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "David Nguyen",
    location: "Hanoi, Vietnam",
    level: "Lower-Intermediate",
    nativeLanguage: "Vietnamese",
    feedback: "Best language app I've used. Instant calls are fast, clean, and extremely helpful. My conversational vocabulary has grown so much in a month.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Emily Smith",
    location: "Toronto, Canada",
    level: "Fluent",
    nativeLanguage: "English",
    feedback: "I volunteer here to help others while learning their native languages! It is mutually rewarding, safe, and builds amazing global connections.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Carlos Silva",
    location: "Mexico City, Mexico",
    level: "Intermediate",
    nativeLanguage: "Spanish",
    feedback: "Excellent security features! I feel very secure talking on this platform. The reporting tool works instantly and ensures a highly respectful community.",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Zofia Wisniewska",
    location: "Warsaw, Poland",
    level: "Upper-Intermediate",
    nativeLanguage: "Polish",
    feedback: "The 15-minute call duration is perfect. I can easily do a session during my morning coffee break. The connection quality is always stable.",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Can Yilmaz",
    location: "Istanbul, Turkey",
    level: "Intermediate",
    nativeLanguage: "Turkish",
    feedback: "Great platform with dynamic matching. The level verification ensures that you are paired with serious learners. I practice every single day.",
    image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=150&auto=format&fit=crop",
  },
  {
    name: "Camila Bianchi",
    location: "Buenos Aires, Argentina",
    level: "Advanced",
    nativeLanguage: "Spanish",
    feedback: "Highly recommended for corporate learners. The focus on business English guides alongside live calls provides a complete practicing suite.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  // Directly adjust activeIndex during rendering if it exceeds maxIndex
  const safeActiveIndex = Math.min(activeIndex, maxIndex);
  if (activeIndex > maxIndex) {
    setActiveIndex(maxIndex);
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-24 bg-zinc-50/50 dark:bg-zinc-900/10 border-t border-border/40 overflow-hidden">
      <div className="container px-4 md:px-8 mx-auto relative">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Community Voice</span>
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground tracking-tight">
            Loved by Learners Worldwide
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Hear from our global speaking community about their learning journey.
          </p>
        </div>

        <div className="relative overflow-hidden -mx-3 px-3">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${safeActiveIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3 flex animate-fade-in">
                <Card className="border border-border/80 dark:border-zinc-800 shadow-sm bg-card hover:border-primary/20 transition-all duration-200 rounded-xl flex flex-col justify-between w-full">
                  <CardContent className="p-8 space-y-6 flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed text-left italic">
                        &ldquo;{t.feedback}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-border/50 mt-auto">
                      <Avatar className="h-10 w-10 rounded-full border border-zinc-100 dark:border-zinc-800">
                        <AvatarImage src={t.image} alt={t.name} className="object-cover" />
                        <AvatarFallback className="font-bold bg-primary/10 text-primary">{t.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-left space-y-0.5">
                        <p className="text-sm font-semibold text-foreground leading-none">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{t.location} • {t.level}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots and Arrows */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="h-10 w-10 rounded-lg border-border/80 hover:bg-primary/10 hover:text-primary transition-colors shadow-sm shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[...Array(maxIndex + 1)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  safeActiveIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="h-10 w-10 rounded-lg border-border/80 hover:bg-primary/10 hover:text-primary transition-colors shadow-sm shrink-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
