"use client"

import { ChevronDown, HelpCircle, MessageSquare, Shield } from "lucide-react";
import * as React from "react";

const faqs = [
  {
    category: "general",
    question: "Is TalkNative really free to use?",
    answer: "Yes, TalkNative is completely free to use during our public beta. Our core goal is to provide a seamless and accessible platform for learners around the world to practice English speaking without financial barriers.",
  },
  {
    category: "general",
    question: "Do I need a webcam to practice speaking?",
    answer: "While video calls are highly recommended for natural face-to-face communication, you can completely choose audio-only mode to focus purely on listening and speaking.",
  },
  {
    category: "general",
    question: "Can I select my speaking partner's specific country?",
    answer: "Currently, partner matching is based on language levels and target goals rather than specific countries. This maximizes matchmaking speed and exposes you to diverse English accents from around the world.",
  },
  {
    category: "matching",
    question: "How does the partner matching algorithm work?",
    answer: "Our smart matching algorithm pairs you with partners who are currently online and have compatible learning profiles. It takes into account your English fluency level and target practice goals to ensure high-quality and mutual practice value.",
  },
  {
    category: "matching",
    question: "How long are the speaking practice sessions?",
    answer: "Standard voice/video sessions are designed to be 15 minutes long. This duration is optimized to provide focused, high-energy practice that fits perfectly into busy schedules without causing conversational fatigue.",
  },
  {
    category: "matching",
    question: "What happens if I get disconnected during a call?",
    answer: "If your connection drops, our system instantly attempts to reconnect you with the same partner for 60 seconds. If reconnection fails, you can seamlessly re-enter the queue to match with another partner.",
  },
  {
    category: "matching",
    question: "Are there structured topics for the conversation?",
    answer: "Yes! We provide dynamic built-in conversation icebreakers, hot topics, and vocabulary cards right inside the call interface so you never run out of things to say.",
  },
  {
    category: "safety",
    question: "How do you ensure a safe and respectful environment?",
    answer: "Safety is our top priority. We use real-time automated behavioral monitoring, let you instantly report any inappropriate behavior with a single tap, and verify profiles. We enforce strict community guidelines to ensure a friendly learning environment.",
  },
  {
    category: "safety",
    question: "What behavior is strictly prohibited on TalkNative?",
    answer: "We have zero tolerance for any form of harassment, discrimination, hate speech, explicit content, or promotional spam. Violators are permanently banned from the platform instantly.",
  },
  {
    category: "safety",
    question: "Can teenagers use TalkNative?",
    answer: "TalkNative is designed strictly for adults aged 18 and older. We enforce safety checks to ensure a mature, respectful, and safe professional learning environment.",
  },
];

const categories = [
  { id: "all", label: "All", icon: HelpCircle },
  { id: "general", label: "General", icon: HelpCircle },
  { id: "matching", label: "Matching", icon: MessageSquare },
  { id: "safety", label: "Safety", icon: Shield },
];

export function Faq() {
  const [openQuestion, setOpenQuestion] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState("all");

  const toggleFaq = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  const filteredFaqs = faqs.filter(
    (faq) => activeCategory === "all" || faq.category === activeCategory
  );

  // Close open accordions when changing categories
  React.useEffect(() => {
    setOpenQuestion(null);
  }, [activeCategory]);

  const leftColumnFaqs = filteredFaqs.filter((_, idx) => idx % 2 === 0);
  const rightColumnFaqs = filteredFaqs.filter((_, idx) => idx % 2 !== 0);

  return (
    <section className="py-24 bg-background border-t border-border/40">
      <div className="container px-4 md:px-8 mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Got Questions?</span>
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Everything you need to know about TalkNative English practice sessions.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`h-9 px-4 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 border focus:outline-none ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/10"
                    : "bg-card text-muted-foreground hover:text-foreground border-border/80 dark:border-zinc-800"
                }`}
              >
                <cat.icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion Double Column Grid */}
        {filteredFaqs.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No questions found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start transition-all duration-300">
            {/* Left Column Stack */}
            <div className="space-y-4">
              {leftColumnFaqs.map((faq, index) => {
                const isOpen = openQuestion === faq.question;
                return (
                  <div
                    key={index}
                    className={`border rounded-xl bg-card transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-primary shadow-sm shadow-primary/5 bg-primary/[0.01]"
                        : "border-border/80 dark:border-zinc-800 hover:border-border"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.question)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      <span className={isOpen ? "text-primary" : "text-foreground"}>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 border-t border-border/40"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="p-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column Stack */}
            <div className="space-y-4">
              {rightColumnFaqs.map((faq, index) => {
                const isOpen = openQuestion === faq.question;
                return (
                  <div
                    key={index}
                    className={`border rounded-xl bg-card transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-primary shadow-sm shadow-primary/5 bg-primary/[0.01]"
                        : "border-border/80 dark:border-zinc-800 hover:border-border"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.question)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      <span className={isOpen ? "text-primary" : "text-foreground"}>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 border-t border-border/40"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="p-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
