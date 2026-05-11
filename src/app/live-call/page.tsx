"use client"

import * as React from "react"
import {
    Mic, MicOff,
    Volume2, VolumeX,
    PhoneOff,
    ArrowRight,
    MapPin,
    Flag,
    Clock,
    MessageSquareText,
    StickyNote
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LiveCallPage() {
    const router = useRouter()
    const [isMuted, setIsMuted] = React.useState(false)
    const [isVolumeOff, setIsVolumeOff] = React.useState(false)
    const [showCaptions, setShowCaptions] = React.useState(false)
    const [showNotes, setShowNotes] = React.useState(false)

    const handleEndCall = () => {
        // Redirect to feedback page
        router.push("/feedback")
    }

    return (
        <div className="relative min-h-screen bg-[#f8faff] dark:bg-zinc-950 flex flex-col transition-colors duration-300">
            {/* Soft Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Header */}
            <header className="z-10 flex items-center justify-between px-8 py-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-heading font-bold tracking-tight">FluentFlow</span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
                        <Clock className="h-4 w-4" />
                        12:45
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive transition-colors">
                        <Flag className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content: Partner Info */}
            <main className="z-10 flex-1 flex flex-col items-center justify-center -mt-20">
                <div className="relative space-y-8 text-center">
                    {/* Partner Avatar */}
                    <div className="relative mx-auto">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                        <div className="relative h-48 w-48 rounded-full border-4 border-white dark:border-zinc-800 shadow-2xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Sofia Martinez"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Name & Details */}
                    <div className="space-y-3">
                        <h2 className="text-4xl font-heading font-bold text-[#1a2b3b] dark:text-white">Sofia Martinez</h2>
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
                                <MapPin className="h-4 w-4" />
                                Madrid, Spain
                            </div>
                            <span className="px-3 py-1 bg-[#2af5d1]/20 text-[#00a884] text-[10px] font-bold rounded-full uppercase tracking-wider">
                                Advanced (C1)
                            </span>
                        </div>
                    </div>

                    {/* Audio Visualizer */}
                    <div className="flex items-center justify-center gap-1.5 h-12 pt-4">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1.5 bg-[#006D5B] rounded-full animate-visualizer"
                                style={{ height: `${10 + Math.random() * 30}px`, animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Control Bar */}
            <footer className="z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-muted/20 px-8 py-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Left: Toggles */}
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsMuted(!isMuted)}
                            className={`h-12 w-12 rounded-full border-none transition-all ${isMuted ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-primary/5 text-[#1a2b3b] dark:text-white hover:bg-primary/10'}`}
                        >
                            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsVolumeOff(!isVolumeOff)}
                            className={`h-12 w-12 rounded-full border-none transition-all ${isVolumeOff ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-primary/5 text-[#1a2b3b] dark:text-white hover:bg-primary/10'}`}
                        >
                            {isVolumeOff ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                    </div>

                    {/* Center: Main Actions */}
                    <div className="flex items-center justify-center gap-4">
                        <Button className="h-14 px-8 rounded-full bg-[#006D5B] hover:bg-[#005a4b] text-white font-bold gap-2 text-lg shadow-lg shadow-primary/20 transition-all active:scale-95">
                            Next Partner
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={handleEndCall}
                            className="h-14 w-14 rounded-full shadow-lg shadow-destructive/20 transition-all active:scale-95"
                        >
                            <PhoneOff className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Right: Tools */}
                    <div className="flex items-center justify-center md:justify-end gap-10">
                        <button
                            onClick={() => setShowCaptions(!showCaptions)}
                            className={`flex flex-col items-center gap-1.5 transition-all group ${showCaptions ? 'text-[#006D5B]' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <MessageSquareText className={`h-5 w-5 group-hover:scale-110 transition-transform`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Captions</span>
                        </button>
                        <button
                            onClick={() => setShowNotes(!showNotes)}
                            className={`flex flex-col items-center gap-1.5 transition-all group ${showNotes ? 'text-[#006D5B]' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <StickyNote className={`h-5 w-5 group-hover:scale-110 transition-transform`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Notes</span>
                        </button>
                    </div>
                </div>
            </footer>

            {/* Animation Styles */}
            <style jsx global>{`
                @keyframes visualizer {
                  0%, 100% { height: 8px; }
                  50% { height: 35px; }
                }
                .animate-visualizer {
                  animation: visualizer 0.8s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
