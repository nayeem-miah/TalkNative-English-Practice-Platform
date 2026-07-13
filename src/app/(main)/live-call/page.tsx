/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { useGetCallHistoryQuery } from "@/redux/api/call-api"
import {
    ArrowRight,
    Clock,
    Flag,
    MapPin,
    MessageSquareText,
    Mic, MicOff,
    PhoneCall,
    PhoneOff,
    StickyNote,
    Volume2, VolumeX,
    X
} from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { Socket, io } from "socket.io-client"
import { toast } from "sonner"


const getCleanPartnerName = (name: string, id: string) => {
    if (!name) return "Anonymous Speaker"
    if (/^[a-z0-9]{5,24}$/i.test(name) && (!/[aeiou]/i.test(name) || name.length > 10)) {
        const charSum = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
        return `Anonymous Speaker #${charSum}`
    }
    return name
}


const getCleanPartnerAvatar = (id: string, name: string, customAvatar?: string) => {
    if (customAvatar && !customAvatar.includes("default") && !customAvatar.includes("avatar") && !customAvatar.includes("placeholder")) {
        return customAvatar
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
}

function LiveCallContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const autoStart = searchParams?.get("autoStart") === "true"

    const { data: userResponse, isLoading: isUserLoading } = useGetMeQuery(undefined, {
        skip: typeof window === "undefined",
    })
    const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
    const isLoggedIn = !!user && (userResponse?.success !== false)

    const { data: callHistoryResponse } = useGetCallHistoryQuery(undefined, {
        skip: !isLoggedIn,
    })
    const callsCount = callHistoryResponse?.data?.length || 0

    // Real-time online users counter updated from server sockets
    const [onlineCount, setOnlineCount] = React.useState(1)

    // Dynamic rotating tips
    const randomTip = React.useMemo(() => {
        const tips = [
            "Use headphones or a headset to minimize echo and background noise.",
            "Choose a quiet place for calls to focus better on the conversation.",
            "Ask open questions like 'What do you do for fun?' to break the ice.",
            "Don't worry about mistakes—perfection is the enemy of progress!"
        ]
        return tips[Math.floor(Math.random() * tips.length)]
    }, [])

    // Matchmaking & Calling State
    const [callState, setCallState] = React.useState<"IDLE" | "SEARCHING" | "CONNECTED">("IDLE")
    const [socketConnected, setSocketConnected] = React.useState(false)
    const [partner, setPartner] = React.useState<{
        id: string;
        name: string;
        avatar: string;
        language: string;
    } | null>(null)

    const [isMuted, setIsMuted] = React.useState(false)
    const [isVolumeOff, setIsVolumeOff] = React.useState(false)
    const [callDuration, setCallDuration] = React.useState(0)
    const [searchTime, setSearchTime] = React.useState(0)
    const [needsPlayRetry, setNeedsPlayRetry] = React.useState(false)

    // Captions & Notes Panel State
    const [isNotesOpen, setIsNotesOpen] = React.useState(false)
    const [isCaptionsOpen, setIsCaptionsOpen] = React.useState(false)
    const [notesText, setNotesText] = React.useState("")
    const [captionsList, setCaptionsList] = React.useState<Array<{ sender: "You" | "Partner"; text: string; time: string }>>([
        { sender: "Partner", text: "Hello! Nice to meet you. Let's practice English!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ])
    const [isListening, setIsListening] = React.useState(false)
    const [isSpeechSupported, setIsSpeechSupported] = React.useState(false)

    const recognitionRef = React.useRef<any>(null)
    const captionsEndRef = React.useRef<HTMLDivElement | null>(null)

    // Initialize Web Speech API for transcribing
    React.useEffect(() => {
        if (typeof window === "undefined") return

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SpeechRecognition) {
            setIsSpeechSupported(true)
            const rec = new SpeechRecognition()
            rec.continuous = true
            rec.interimResults = false
            rec.lang = "en-US"

            rec.onresult = (event: any) => {
                const latestResult = event.results[event.results.length - 1][0].transcript
                if (latestResult.trim()) {
                    setCaptionsList(prev => [
                        ...prev,
                        {
                            sender: "You",
                            text: latestResult.trim(),
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                    ])

                    // Emit to partner dynamically using signaling channel
                    if (socketRef.current && roomIdRef.current) {
                        socketRef.current.emit("signal", {
                            roomId: roomIdRef.current,
                            signal: { type: "caption", text: latestResult.trim() }
                        })
                    }
                }
            }

            rec.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error)
                setIsListening(false)
                if (event.error === 'not-allowed') {
                    toast.error("Microphone permission denied for speech-to-text. Ensure you are on HTTPS or localhost.")
                } else if (event.error === 'network') {
                    toast.error("Speech recognition network error. Please check your internet connection.")
                } else if (event.error === 'no-speech') {
                    // Ignore silent errors
                } else {
                    toast.error(`Speech recognition error: ${event.error}`)
                }
            }

            rec.onend = () => {
                setIsListening(false)
            }

            recognitionRef.current = rec
        } else {
            setIsSpeechSupported(false)
        }
    }, [])

    // Start/Stop speech recognition based on panel open and active listening state
    React.useEffect(() => {
        if (!recognitionRef.current) return

        if (callState === "CONNECTED" && isCaptionsOpen && isListening) {
            try {
                recognitionRef.current.start()
            } catch (e) {
                console.error(e)
            }
        } else {
            try {
                recognitionRef.current.stop()
            } catch (e) {
                // ignore if already stopped
            }
        }

        return () => {
            try {
                recognitionRef.current.stop()
            } catch (e) {}
        }
    }, [callState, isCaptionsOpen, isListening])

    // Toggle Listening
    const handleToggleListening = () => {
        setIsListening(prev => !prev)
    }

    // Scroll to bottom when captions update
    React.useEffect(() => {
        if (captionsEndRef.current) {
            captionsEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [captionsList])


    // Reset panel state when call finishes
    React.useEffect(() => {
        if (callState !== "CONNECTED") {
            setIsNotesOpen(false)
            setIsCaptionsOpen(false)
            setNotesText("")
            setCaptionsList([
                { sender: "Partner", text: "Hello! Nice to meet you. Let's practice English!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ])
            setIsListening(false)
        }
    }, [callState])

    // WebRTC & Socket Refs
    const socketRef = React.useRef<Socket | null>(null)
    const pcRef = React.useRef<RTCPeerConnection | null>(null)
    const localStreamRef = React.useRef<MediaStream | null>(null)
    const remoteStreamRef = React.useRef<MediaStream | null>(null)
    const remoteAudioRef = React.useRef<HTMLAudioElement | null>(null)
    const remoteAudioStableRef = React.useRef<{ el: HTMLAudioElement | null }>({ el: null })
    const roomIdRef = React.useRef<string>("")
    const timerRef = React.useRef<NodeJS.Timeout | null>(null)
    const searchTimerRef = React.useRef<NodeJS.Timeout | null>(null)
    const pendingSignalsRef = React.useRef<any[]>([])
    const queuedCandidatesRef = React.useRef<any[]>([])

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!isUserLoading && !isLoggedIn) {
            router.push("/login?redirect=/live-call")
        }
    }, [isUserLoading, isLoggedIn, router])

    // Handle Call Timer
    React.useEffect(() => {
        if (callState === "CONNECTED") {
            setCallDuration(0)
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
            setCallDuration(0)
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [callState])

    // Handle Search Queue Timer
    React.useEffect(() => {
        if (callState === "SEARCHING") {
            setSearchTime(0)
            searchTimerRef.current = setInterval(() => {
                setSearchTime(prev => prev + 1)
            }, 1000)
        } else {
            if (searchTimerRef.current) {
                clearInterval(searchTimerRef.current)
                searchTimerRef.current = null
            }
            setSearchTime(0)
        }
        return () => {
            if (searchTimerRef.current) {
                clearInterval(searchTimerRef.current)
            }
        }
    }, [callState])

    // Format seconds to MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    // Clean up connections and streams
    const cleanupCall = React.useCallback(() => {
        if (pcRef.current) {
            pcRef.current.close()
            pcRef.current = null
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop())
            localStreamRef.current = null
        }
        if (remoteStreamRef.current) {
            remoteStreamRef.current.getTracks().forEach(track => track.stop())
            remoteStreamRef.current = null
        }
        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null
        }
        pendingSignalsRef.current = []
        queuedCandidatesRef.current = []
        roomIdRef.current = ""
        setPartner(null)
    }, [])

    // Initialize Socket connection
    React.useEffect(() => {
        if (!isLoggedIn || !user) return

        let isMounted = true
        const socketUrl = process.env.NEXT_PUBLIC_BASE_API?.replace("/api/v1", "") || "http://localhost:8321"

        const socket = io(socketUrl, {
            transports: ["websocket"],
            autoConnect: true,
        })

        socketRef.current = socket

        socket.on("connect", () => {
            if (!isMounted) return
            setSocketConnected(true)
        })

        socket.on("disconnect", () => {
            if (!isMounted) return
            setSocketConnected(false)
        })

        // Listen for real-time connected users counts broadcasted from the server
        socket.on("online_count_update", (data: { count: number }) => {
            if (!isMounted) return
            setOnlineCount(data.count)
        })

        // Helper to process signaling data
        const processSignal = async (signal: any, pc: RTCPeerConnection) => {
            try {
                if (!isMounted) return
                if (signal.sdp) {
                    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))

                    if (!isMounted) return
                    if (signal.sdp.type === "offer") {
                        const answer = await pc.createAnswer()
                        await pc.setLocalDescription(answer)
                        if (!isMounted) return
                        socket.emit("signal", {
                            roomId: roomIdRef.current,
                            signal: { sdp: pc.localDescription }
                        })
                    }

                    // Process any queued ICE candidates that arrived before the Remote Description was set
                    if (queuedCandidatesRef.current.length > 0) {
                        for (const cand of queuedCandidatesRef.current) {
                            try {
                                if (!isMounted) return
                                await pc.addIceCandidate(new RTCIceCandidate(cand))
                            } catch (candErr) {
                                console.error("Error adding queued ICE candidate:", candErr)
                            }
                        }
                        queuedCandidatesRef.current = []
                    }
                } else if (signal.candidate) {
                    if (!pc.remoteDescription || !pc.remoteDescription.type) {
                        queuedCandidatesRef.current.push(signal.candidate)
                    } else {
                        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate))
                    }
                }
            } catch (err) {
                console.error("Signaling error:", err)
            }
        }

        // Match found handler
        socket.on("match_found", async (data: {
            roomId: string;
            partnerId: string;
            partnerName: string;
            partnerAvatar: string;
            partnerLanguage: string;
            members: string[];
        }) => {
            if (!isMounted) return
            roomIdRef.current = data.roomId
            const cleanName = getCleanPartnerName(data.partnerName, data.partnerId)
            const cleanAvatar = getCleanPartnerAvatar(data.partnerId, cleanName, data.partnerAvatar)
            setPartner({
                id: data.partnerId,
                name: cleanName,
                avatar: cleanAvatar,
                language: data.partnerLanguage,
            })

            toast.success(`Match found with ${cleanName}!`)
            setCallState("CONNECTED")

            // Join the call room
            socket.emit("join_call_room", { roomId: data.roomId })

            // Initialize WebRTC
            try {
                // Get Microphone access
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

                if (!isMounted) {
                    stream.getTracks().forEach(track => track.stop())
                    return
                }
                localStreamRef.current = stream

                // Apply current mute state to the new local stream tracks
                stream.getAudioTracks().forEach(track => {
                    track.enabled = !isMuted
                })

                // Create Peer Connection with STUN + TURN servers
                const pc = new RTCPeerConnection({
                    iceServers: [
                        {
                            urls: "stun:stun.relay.metered.ca:80",
                        },
                        {
                            urls: "turn:global.relay.metered.ca:80",
                            username: "0cb58af1f828e9830bb583de",
                            credential: "BlAtCezE2re9OwNv",
                        },
                        {
                            urls: "turn:global.relay.metered.ca:80?transport=tcp",
                            username: "0cb58af1f828e9830bb583de",
                            credential: "BlAtCezE2re9OwNv",
                        },
                        {
                            urls: "turn:global.relay.metered.ca:443",
                            username: "0cb58af1f828e9830bb583de",
                            credential: "BlAtCezE2re9OwNv",
                        },
                        {
                            urls: "turns:global.relay.metered.ca:443?transport=tcp",
                            username: "0cb58af1f828e9830bb583de",
                            credential: "BlAtCezE2re9OwNv",
                        },
                    ]
                })

                if (!isMounted) {
                    pc.close()
                    stream.getTracks().forEach(track => track.stop())
                    return
                }
                pcRef.current = pc

                pc.onconnectionstatechange = () => {
                    if (!isMounted) return
                    if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
                        console.error("❌ WebRTC PeerConnection failed/disconnected!")
                    }
                }

                // Add local tracks to Peer Connection
                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream)
                })

                // Listen to remote tracks
                pc.ontrack = (event) => {
                    if (!isMounted) return
                    const remoteStream = event.streams && event.streams[0]
                        ? event.streams[0]
                        : new MediaStream([event.track])

                    remoteStreamRef.current = remoteStream

                    const audioEl = remoteAudioStableRef.current.el
                    if (audioEl) {
                        audioEl.srcObject = remoteStream
                        audioEl.muted = false
                        audioEl.volume = 1.0

                        const tryPlay = () => {
                            if (!isMounted) return
                            audioEl.play()
                                .then(() => {
                                    setNeedsPlayRetry(false)
                                })
                                .catch(playErr => {
                                    console.warn("⚠️ Autoplay blocked, showing retry banner:", playErr)
                                    setNeedsPlayRetry(true)
                                })
                        }
                        tryPlay()
                    }
                }

                // Gather and send ICE Candidates
                pc.onicecandidate = (event) => {
                    if (!isMounted) return
                    if (event.candidate) {
                        socket.emit("signal", {
                            roomId: data.roomId,
                            signal: { candidate: event.candidate }
                        })
                    }
                }

                // Process any buffered signals
                if (pendingSignalsRef.current.length > 0) {
                    for (const sig of pendingSignalsRef.current) {
                        if (!isMounted) return
                        await processSignal(sig, pc)
                    }
                    pendingSignalsRef.current = []
                }

                // Create offer if initiator
                const isInitiator = data.members[0] === user.id || data.members[0] === user._id
                if (isInitiator) {
                    const offer = await pc.createOffer()
                    if (!isMounted) return
                    await pc.setLocalDescription(offer)
                    if (!isMounted) return
                    socket.emit("signal", {
                        roomId: data.roomId,
                        signal: { sdp: pc.localDescription }
                    })
                }
            } catch (err: any) {
                console.error("WebRTC initialization failed:", err)
                if (isMounted) {
                    toast.error("Could not access microphone!")
                    handleLeaveCall()
                }
            }
        })

        // WebRTC Signaling Relay Handler
        socket.on("signal", async (data: { from: string; signal: any }) => {
            if (!isMounted) return

            // Handle captions sent by partner
            if (data.signal && data.signal.type === "caption") {
                setCaptionsList(prev => [
                    ...prev,
                    {
                        sender: "Partner",
                        text: data.signal.text,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                ])
                return
            }

            const pc = pcRef.current
            if (!pc) {
                pendingSignalsRef.current.push(data.signal)
                return
            }
            await processSignal(data.signal, pc)
        })

        // Partner Left Handler
        socket.on("partner_left", () => {
            if (!isMounted) return
            toast.info("Partner disconnected from the call.")
            cleanupCall()
            handleStartMatchmaking()
        })

        return () => {
            isMounted = false
            if (roomIdRef.current) {
                socket.emit("leave_call", {
                    roomId: roomIdRef.current,
                    userId: user?.id || user?._id
                })
            }
            socket.disconnect()
            cleanupCall()
        }
    }, [isLoggedIn, user, cleanupCall])

    // Join Matchmaking Queue
    const handleStartMatchmaking = () => {
        if (!socketRef.current || !user) return
        cleanupCall()
        setCallState("SEARCHING")
        toast.info("Searching for an active speaking partner...")

        socketRef.current.emit("join_matchmaking", {
            userId: user.id || user._id,
            name: user.name || "Anonymous Speaker"
        })
    }

    // Auto start matchmaking if requested via query parameter
    React.useEffect(() => {
        if (autoStart && socketConnected && callState === "IDLE" && socketRef.current && user) {
            handleStartMatchmaking()
        }
    }, [autoStart, socketConnected, callState, user])

    // Leave current call
    const handleLeaveCall = () => {
        if (socketRef.current && roomIdRef.current) {
            socketRef.current.emit("leave_call", {
                roomId: roomIdRef.current,
                userId: user?.id || user?._id
            })
        }
        cleanupCall()
        setCallState("IDLE")
        toast.info("Call ended.")
    }

    // End call and go to feedback
    const handleEndCallAndFeedback = () => {
        const partnerId = partner?.id || ""
        const partnerName = partner?.name || "Speaker"
        const partnerAvatar = partner?.avatar || ""
        const duration = callDuration
        const notesParam = notesText ? `&notes=${encodeURIComponent(notesText)}` : ""

        handleLeaveCall()
        router.push(`/feedback?partnerId=${encodeURIComponent(partnerId)}&partnerName=${encodeURIComponent(partnerName)}&partnerAvatar=${encodeURIComponent(partnerAvatar)}&duration=${duration}${notesParam}`)
    }

    // Toggle Microphone (Mute)
    const handleToggleMute = () => {
        const nextMute = !isMuted
        setIsMuted(nextMute)
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !nextMute
            })
        }
        toast.info(nextMute ? "Microphone muted" : "Microphone unmuted")
    }

    // Toggle Speaker Volume
    const handleToggleVolume = () => {
        const nextVolumeOff = !isVolumeOff
        setIsVolumeOff(nextVolumeOff)
        const audioEl = remoteAudioStableRef.current.el
        if (audioEl) {
            audioEl.muted = nextVolumeOff
            if (!nextVolumeOff && audioEl.paused && audioEl.srcObject) {
                audioEl.play().catch(console.error)
            }
        }
        toast.info(nextVolumeOff ? "Sound muted" : "Sound unmuted")
    }

    if (isUserLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm font-semibold text-muted-foreground animate-pulse">Loading live call...</p>
                </div>
            </div>
        )
    }

    if (!isLoggedIn) {
        return null
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Hidden audio element for remote stream */}
            <audio
                ref={(el) => {
                    remoteAudioRef.current = el
                    remoteAudioStableRef.current.el = el
                }}
                autoPlay
                playsInline
                controls={false}
                className="hidden"
            />

            {/* Autoplay retry banner */}
            {needsPlayRetry && callState === "CONNECTED" && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-bold text-sm">
                    <Volume2 className="h-4 w-4" />
                    Sound blocked by browser.
                    <button
                        className="underline"
                        onClick={() => {
                            const audioEl = remoteAudioStableRef.current.el
                            if (audioEl) {
                                audioEl.play()
                                    .then(() => setNeedsPlayRetry(false))
                                    .catch(console.error)
                            }
                        }}
                    >
                        Tap to enable sound
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <main className="z-10 flex-1 flex flex-col items-center justify-center pt-8 pb-16 px-4">

                {/* 1. IDLE STATE: Not searching, ready to start */}
                {callState === "IDLE" && (
                    <div className="max-w-md w-full text-slate-800 dark:text-slate-100 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Pulse Phone Icon Container */}
                        <div className="relative mx-auto w-32 h-32 rounded-full flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-60" style={{ animationDuration: "3s" }} />
                            <div className="absolute inset-2 rounded-full bg-primary/15 animate-pulse opacity-85" style={{ animationDuration: "2s" }} />
                            <div className="relative w-28 h-28 rounded-full bg-[#006D5B]/5 border-2 border-primary/20 flex items-center justify-center shadow-lg">
                                <PhoneCall className="h-12 w-12 text-[#006D5B]" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-full uppercase tracking-wider">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                {onlineCount.toLocaleString()} users online now
                            </div>
                            <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white leading-tight">Start Practice Calling</h2>
                            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto font-medium">
                                Match instantly with another language learner. Speak in English, share ideas, and boost your conversation skills naturally.
                            </p>
                        </div>

                        {/* Guideline Banner */}
                        <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-3.5 text-[11px] text-zinc-550 dark:text-zinc-400 leading-normal font-semibold text-left flex items-start gap-2.5">
                            <span className="text-sm">🛡️</span>
                            <div>
                                <span className="font-extrabold text-zinc-850 dark:text-zinc-200">Community Safety Guidelines</span>
                                <p className="mt-0.5 opacity-90">Please be respectful and friendly. Harassment, abuse, or inappropriate behavior will result in an immediate permanent ban.</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleStartMatchmaking}
                            className="w-full h-13 bg-[#006D5B] hover:bg-[#005a4b] text-white font-extrabold rounded-2xl text-base shadow-lg shadow-[#006D5B]/10 transition-all active:scale-[0.98] gap-2 border-none cursor-pointer"
                        >
                            Find Learning Partner
                            <ArrowRight className="h-4.5 w-4.5" />
                        </Button>

                        {/* Quick tip & Practice History shortcuts */}
                        <div className="grid grid-cols-2 gap-3.5 pt-4 text-left">
                            <div className="bg-zinc-50/30 dark:bg-zinc-900/10 border border-zinc-100/80 dark:border-zinc-900/60 p-3 rounded-2xl space-y-1">
                                <span className="text-xs">💡 Quick Tip</span>
                                <p className="text-[10px] text-muted-foreground font-semibold leading-normal">
                                    {randomTip}
                                </p>
                            </div>
                            <div className="bg-zinc-50/30 dark:bg-zinc-900/10 border border-zinc-100/80 dark:border-zinc-900/60 p-3 rounded-2xl space-y-1 flex flex-col justify-between">
                                <span className="text-xs">📊 Calling Stats</span>
                                <p className="text-[10px] text-muted-foreground font-semibold leading-normal">
                                    {callsCount > 0
                                        ? `Completed ${callsCount} practice calls so far. Keep up the great progress!`
                                        : "You haven't completed any practice calls yet. Start your first session today!"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. SEARCHING STATE: Radar Scanner */}
                {callState === "SEARCHING" && (
                    <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
                        <div className="relative mx-auto flex items-center justify-center w-56 h-56">
                            {/* Radar Waves */}
                            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-60" style={{ animationDuration: "3s" }} />
                            <div className="absolute inset-4 rounded-full bg-primary/15 animate-ping opacity-40" style={{ animationDuration: "2s" }} />
                            <div className="absolute inset-8 rounded-full bg-primary/20 animate-ping opacity-25" style={{ animationDuration: "1s" }} />

                            {/* Center Profile */}
                            <div className="relative w-28 h-28 rounded-full border border-border/80 shadow-md overflow-hidden bg-primary/5 flex items-center justify-center">
                                {user?.profilePicture ? (
                                    <Image
                                        src={user.profilePicture}
                                        alt={user.name}
                                        fill
                                        unoptimized
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-primary">
                                        {user?.name?.charAt(0) || "U"}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[11px] font-black rounded-full uppercase tracking-wider">
                                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                Searching... {formatTime(searchTime)}
                            </div>
                            <h3 className="text-2xl font-heading font-extrabold text-slate-800 dark:text-white">Searching for Partner...</h3>
                            <p className="text-muted-foreground text-xs max-w-xs mx-auto font-medium leading-relaxed">
                                Matching you with another advanced speaker to practice your English speaking.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleLeaveCall}
                            className="px-8 h-12 rounded-full border-muted/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 font-extrabold transition-all cursor-pointer text-sm shadow-sm"
                        >
                            Cancel Search
                        </Button>
                    </div>
                )}

                 {/* 3. CONNECTED STATE: Audio Call Interface */}
                {callState === "CONNECTED" && partner && (
                    <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 w-full max-w-5xl animate-in fade-in zoom-in-95 duration-300">
                        {/* Main Call Card */}
                        <div className="relative space-y-6 text-center w-full max-w-md bg-card border border-border/80 p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col justify-between">
                            {/* Timer & Safety Report Overlay */}
                            <div className="flex items-center justify-between w-full bg-muted/40 dark:bg-zinc-900/50 border border-border/50 px-4 py-2 rounded-xl">
                                <div className="flex items-center gap-2 text-primary font-black text-xs">
                                    <Clock className="h-4 w-4 animate-pulse" />
                                    {formatTime(callDuration)}
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={handleEndCallAndFeedback}
                                    className="text-red-500 hover:text-red-650 hover:bg-red-500/10 flex items-center gap-1.5 px-3 py-1 rounded-xl border border-red-500/15 bg-red-500/5 font-extrabold text-[10px] tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-none h-7"
                                >
                                    <Flag className="h-3 w-3" />
                                    Report Partner
                                </Button>
                            </div>

                            {/* Partner Avatar */}
                            <div className="relative mx-auto pt-2">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                                <div className="relative h-44 w-44 rounded-full border border-border/80 shadow-md overflow-hidden mx-auto bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                                    <Image
                                        src={partner.avatar}
                                        alt={partner.name}
                                        fill
                                        unoptimized
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Name & Details */}
                            <div className="space-y-3">
                                <h2 className="text-3xl font-heading font-extrabold text-[#1a2b3b] dark:text-white leading-tight">
                                    {partner.name}
                                </h2>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="flex items-center gap-1 text-muted-foreground text-xs font-semibold">
                                        <MapPin className="h-3.5 w-3.5" />
                                        Native: {partner.language}
                                    </div>
                                    <span className="px-2.5 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[9px] font-black rounded-full uppercase tracking-widest border border-teal-500/10">
                                        Speaking Partner
                                    </span>
                                </div>
                            </div>

                            {/* Audio Visualizer Panels for Differentiating Speakers */}
                            <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100/60 dark:border-zinc-800/60 p-4 rounded-2xl mt-4">
                                {/* Left: You */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest transition-colors",
                                        isMuted ? "text-destructive animate-pulse" : "text-zinc-500"
                                    )}>
                                        {isMuted ? "You (Muted)" : "You (Speaking)"}
                                    </span>
                                    <div className="flex items-center gap-1 h-6">
                                        {[...Array(6)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "w-1 rounded-full transition-all duration-300",
                                                    isMuted ? "h-1 bg-destructive/30" : "bg-emerald-500 animate-visualizer"
                                                )}
                                                style={isMuted ? {} : {
                                                    height: `${4 + Math.random() * 16}px`,
                                                    animationDelay: `${i * 0.08}s`,
                                                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Partner */}
                                <div className="flex flex-col items-center gap-2 border-l border-zinc-200/60 dark:border-zinc-800/60 pl-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#006D5B] animate-pulse">
                                        Partner Speaking
                                    </span>
                                    <div className="flex items-center gap-1 h-6">
                                        {[...Array(6)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-[#006D5B] rounded-full animate-visualizer"
                                                style={{
                                                    height: `${4 + Math.random() * 16}px`,
                                                    animationDelay: `${i * 0.08}s`,
                                                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Quick Controls inside call card */}
                            <div className="flex items-center justify-center gap-3.5 pt-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleToggleMute}
                                    className={cn(
                                        "h-10 w-10 rounded-xl border border-border transition-all cursor-pointer shadow-sm",
                                        isMuted ? "bg-red-500 hover:bg-red-650 text-white border-red-500" : "bg-card hover:bg-muted/10 text-foreground"
                                    )}
                                    title={isMuted ? "Unmute Mic" : "Mute Mic"}
                                >
                                    {isMuted ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleToggleVolume}
                                    className={cn(
                                        "h-10 w-10 rounded-xl border border-border transition-all cursor-pointer shadow-sm",
                                        isVolumeOff ? "bg-red-500 hover:bg-red-650 text-white border-red-500" : "bg-card hover:bg-muted/10 text-foreground"
                                    )}
                                    title={isVolumeOff ? "Turn Volume On" : "Turn Volume Off"}
                                >
                                    {isVolumeOff ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                                </Button>
                                <Button
                                    onClick={handleEndCallAndFeedback}
                                    className="h-10 px-5 bg-red-600 hover:bg-red-700 font-extrabold rounded-xl text-xs gap-1.5 cursor-pointer shadow-sm border-none transition-all active:scale-[0.98]"
                                >
                                    <PhoneOff className="h-4 w-4" /> End Call
                                </Button>
                            </div>
                        </div>

                        {/* Side Panel: Captions or Notes */}
                        {(isNotesOpen || isCaptionsOpen) && (
                            <div className="w-full lg:w-96 bg-card border border-border/80 rounded-3xl p-6 shadow-lg flex flex-col min-h-[420px] lg:min-h-full transition-all animate-in fade-in slide-in-from-right-4 duration-300">
                                {isNotesOpen && (
                                    <div className="flex flex-col h-full space-y-4">
                                        <div className="flex items-center justify-between border-b border-border pb-3">
                                            <div className="flex items-center gap-2">
                                                <StickyNote className="h-5 w-5 text-[#006D5B]" />
                                                <h3 className="font-heading font-extrabold text-lg text-foreground">Call Notes</h3>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 rounded-full" 
                                                onClick={() => setIsNotesOpen(false)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <textarea
                                                className="flex-1 w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-border/80 outline-none focus:border-[#006D5B] focus:ring-1 focus:ring-[#006D5B]/20 transition-all font-semibold text-sm text-foreground placeholder:text-muted-foreground resize-none min-h-[220px]"
                                                placeholder="Type any word, grammar rule, or feedback from your partner here..."
                                                value={notesText}
                                                onChange={(e) => setNotesText(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1.5 font-semibold">
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                Auto-saves to Feedback
                                            </span>
                                            <span>{notesText.length} chars</span>
                                        </div>
                                    </div>
                                )}

                                {isCaptionsOpen && (
                                    <div className="flex flex-col h-full space-y-4">
                                        <div className="flex items-center justify-between border-b border-border pb-3">
                                            <div className="flex items-center gap-2">
                                                <MessageSquareText className="h-5 w-5 text-[#006D5B]" />
                                                <h3 className="font-heading font-extrabold text-lg text-foreground">Live Captions</h3>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 rounded-full" 
                                                onClick={() => setIsCaptionsOpen(false)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        {/* Transcript box */}
                                        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[350px] min-h-[250px] scrollbar-thin">
                                            {captionsList.map((cap, idx) => (
                                                <div key={idx} className={cn(
                                                    "flex flex-col max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-200",
                                                    cap.sender === "You" 
                                                        ? "bg-[#006D5B]/10 text-slate-800 dark:text-teal-200 self-end ml-auto rounded-tr-none" 
                                                        : "bg-zinc-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 self-start mr-auto rounded-tl-none"
                                                )}>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                                                        <span className="font-black uppercase tracking-wider">{cap.sender}</span>
                                                        <span>•</span>
                                                        <span>{cap.time}</span>
                                                    </div>
                                                    <div>{cap.text}</div>
                                                </div>
                                            ))}
                                            <div ref={captionsEndRef} />
                                        </div>

                                        {/* Controls */}
                                        <div className="border-t border-border pt-4 flex flex-col gap-2">
                                            {/* Toggle Speech-to-Text Button */}
                                            <Button
                                                onClick={handleToggleListening}
                                                className={cn(
                                                    "w-full h-10 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border-none cursor-pointer text-white",
                                                    !isSpeechSupported
                                                        ? "bg-zinc-400 dark:bg-zinc-700 cursor-not-allowed"
                                                        : isListening 
                                                            ? "bg-red-500 hover:bg-red-650 shadow-md shadow-red-500/10" 
                                                            : "bg-[#006D5B] hover:bg-[#005a4b] shadow-md shadow-primary/10"
                                                )}
                                                disabled={!isSpeechSupported}
                                            >
                                                {isSpeechSupported && (
                                                    <span className={cn(
                                                        "h-2 w-2 rounded-full bg-white",
                                                        isListening && "animate-ping"
                                                    )} />
                                                )}
                                                {!isSpeechSupported 
                                                    ? "Speech Recognition Unsupported" 
                                                    : isListening 
                                                        ? "Turn Off Live Mic Transcribing" 
                                                        : "Turn On Live Mic Transcribing"
                                                }
                                            </Button>
                                            <p className="text-[10px] text-muted-foreground font-semibold text-center leading-normal">
                                                Uses browser native speech recognition. Partner responses are simulated.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Bottom Control Bar */}
            {(callState === "CONNECTED" || callState === "SEARCHING") && (
                <footer className="z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-muted/20 px-8 py-5 transition-all duration-300">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        {/* Left: Toggles */}
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            {callState === "CONNECTED" && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleToggleMute}
                                        className={`h-11 w-11 rounded-full border-none transition-all cursor-pointer ${isMuted ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-[#006D5B]/5 text-[#1a2b3b] dark:text-white hover:bg-[#006D5B]/10'}`}
                                    >
                                        {isMuted ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleToggleVolume}
                                        className={`h-11 w-11 rounded-full border-none transition-all cursor-pointer ${isVolumeOff ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-[#006D5B]/5 text-[#1a2b3b] dark:text-white hover:bg-[#006D5B]/10'}`}
                                    >
                                        {isVolumeOff ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Center: Main Actions */}
                        <div className="flex items-center justify-center gap-4">
                            {callState === "CONNECTED" && (
                                <>
                                    <Button
                                        onClick={handleStartMatchmaking}
                                        className="h-12 px-7 rounded-full bg-[#006D5B] hover:bg-[#005a4b] text-white font-extrabold gap-2 text-sm shadow-md shadow-primary/10 transition-all active:scale-95 cursor-pointer border-none"
                                    >
                                        Next Partner
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={handleEndCallAndFeedback}
                                        className="h-12 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold gap-2 shadow-md shadow-red-600/10 transition-all active:scale-95 flex items-center justify-center cursor-pointer border-none"
                                    >
                                        <PhoneOff className="h-4 w-4 text-white" />
                                        End Call
                                    </Button>
                                </>
                            )}
                            {callState === "SEARCHING" && (
                                <Button
                                    variant="destructive"
                                    onClick={handleLeaveCall}
                                    className="h-12 px-7 rounded-full shadow-md shadow-destructive/15 transition-all active:scale-95 font-extrabold gap-2 text-sm cursor-pointer border-none"
                                >
                                    <PhoneOff className="h-4 w-4 text-white" />
                                    Cancel Matchmaking
                                </Button>
                            )}
                        </div>

                        {/* Right: Tools */}
                        <div className="flex items-center justify-center md:justify-end gap-10">
                            {callState === "CONNECTED" && (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsCaptionsOpen(prev => !prev)
                                            setIsNotesOpen(false)
                                        }}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 transition-all group cursor-pointer",
                                            isCaptionsOpen ? "text-[#006D5B] dark:text-teal-400" : "text-muted-foreground hover:text-primary"
                                        )}
                                    >
                                        <MessageSquareText className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Captions</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsNotesOpen(prev => !prev)
                                            setIsCaptionsOpen(false)
                                        }}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 transition-all group cursor-pointer",
                                            isNotesOpen ? "text-[#006D5B] dark:text-teal-400" : "text-muted-foreground hover:text-primary"
                                        )}
                                    >
                                        <StickyNote className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Notes</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </footer>
            )}

            {/* Animation Styles */}
            <style jsx global>{`
                @keyframes visualizer {
                  0%, 100% { height: 6px; }
                  50% { height: 22px; }
                }
                .animate-visualizer {
                  animation: visualizer 0.7s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

export default function LiveCallPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-600 dark:text-zinc-400 font-bold text-sm">Initializing Call Center...</p>
                </div>
            </div>
        }>
            <LiveCallContent />
        </React.Suspense>
    )
}
