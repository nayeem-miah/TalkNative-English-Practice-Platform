/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { Button } from "@/components/ui/button"
import { useGetMeQuery } from "@/redux/api/auth-api"
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
    Volume2, VolumeX
} from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { Socket, io } from "socket.io-client"
import { toast } from "sonner"

function LiveCallContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const autoStart = searchParams?.get("autoStart") === "true"

    const { data: userResponse, isLoading: isUserLoading } = useGetMeQuery(undefined, {
        skip: typeof window === "undefined",
    })
    const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
    const isLoggedIn = !!user && (userResponse?.success !== false)

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
    const [needsPlayRetry, setNeedsPlayRetry] = React.useState(false)

    // WebRTC & Socket Refs
    const socketRef = React.useRef<Socket | null>(null)
    const pcRef = React.useRef<RTCPeerConnection | null>(null)
    const localStreamRef = React.useRef<MediaStream | null>(null)
    const remoteStreamRef = React.useRef<MediaStream | null>(null)
    // Use a stable ref object so socket closure always reads the latest element
    const remoteAudioRef = React.useRef<HTMLAudioElement | null>(null)
    const remoteAudioStableRef = React.useRef<{ el: HTMLAudioElement | null }>({ el: null })
    const roomIdRef = React.useRef<string>("")
    const timerRef = React.useRef<NodeJS.Timeout | null>(null)
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
            setPartner({
                id: data.partnerId,
                name: data.partnerName,
                avatar: data.partnerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                language: data.partnerLanguage,
            })

            toast.success(`Match found with ${data.partnerName}!`)
            setCallState("CONNECTED")

            // Join the call room
            socket.emit("join_call_room", { roomId: data.roomId })

            // Initialize WebRTC
            try {
                // Get Microphone access
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

                if (!isMounted) {
                    // Stop stream immediately if unmounted during getUserMedia promise
                    stream.getTracks().forEach(track => track.stop())
                    return
                }
                localStreamRef.current = stream

                // Apply current mute state to the new local stream tracks
                stream.getAudioTracks().forEach(track => {
                    track.enabled = !isMuted
                })

                // Create Peer Connection with STUN + dedicated TURN servers for production NAT traversal
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

                // Connection and ICE state monitoring for debugging live calls
                pc.onconnectionstatechange = () => {
                    if (!isMounted) return
                    if (pc.connectionState === "connected") {
                    } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
                        console.error("❌ WebRTC PeerConnection failed/disconnected!")
                    }
                }

                pc.oniceconnectionstatechange = () => {
                    if (!isMounted) return
                }

                // Add local tracks to Peer Connection
                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream)
                })

                // Listen to remote tracks
                pc.ontrack = (event) => {
                    if (!isMounted) return
                    // Build remote stream from either streams[] or the track directly
                    const remoteStream = event.streams && event.streams[0]
                        ? event.streams[0]
                        : new MediaStream([event.track])

                    remoteStreamRef.current = remoteStream

                    // Use the stable ref so this closure always gets the latest audio element
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
                                    console.warn("⚠️ Autoplay blocked, showing retry button:", playErr)
                                    setNeedsPlayRetry(true)
                                })
                        }
                        tryPlay()
                    } else {
                        console.error("❌ remoteAudioEl is null when ontrack fired!")
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

                // Process any buffered signals that arrived while getting userMedia permissions
                if (pendingSignalsRef.current.length > 0) {
                    for (const sig of pendingSignalsRef.current) {
                        if (!isMounted) return
                        await processSignal(sig, pc)
                    }
                    pendingSignalsRef.current = []
                }

                // If this user is the initiator, create the offer
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
            // Automatically search for next partner
            handleStartMatchmaking()
        })

        return () => {
            isMounted = false
            // Explicitly leave the call room first if we were in a call
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

        handleLeaveCall()
        router.push(`/feedback?partnerId=${encodeURIComponent(partnerId)}&partnerName=${encodeURIComponent(partnerName)}&partnerAvatar=${encodeURIComponent(partnerAvatar)}&duration=${duration}`)
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
            // If un-muting and stream is already set but paused, try to play again
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
            {/* Hidden audio element for remote stream — ref kept in stable object for socket closure access */}
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

            {/* Autoplay retry banner — shown when browser blocks autoplay */}
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
                    <div className="max-w-md w-full text-slate-800 dark:text-slate-100 text-center space-y-8">
                        <div className="relative mx-auto w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center shadow-lg border-2 border-primary/20">
                            <PhoneCall className="h-16 w-16 text-primary animate-bounce" />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl font-heading font-bold text-slate-800 dark:text-white">Start Practice Calling</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Match instantly with another language learner. Speak in English, share ideas, and boost your conversation skills naturally.
                            </p>
                        </div>

                        <Button
                            onClick={handleStartMatchmaking}
                            className="w-full h-14 bg-[#006D5B] hover:bg-[#005a4b] text-white font-bold rounded-full text-lg shadow-lg shadow-primary/20 transition-all active:scale-95 gap-2"
                        >
                            Find Learning Partner
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                {/* 2. SEARCHING STATE: Radar Scanner */}
                {callState === "SEARCHING" && (
                    <div className="text-center space-y-8">
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
                            <h3 className="text-2xl font-heading font-bold text-slate-800 dark:text-white animate-pulse">Searching for Partner...</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                Matching you with another advanced speaker to practice your English speaking.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleLeaveCall}
                            className="px-8 h-12 rounded-full border-muted/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 font-bold transition-all"
                        >
                            Cancel Search
                        </Button>
                    </div>
                )}

                {/* 3. CONNECTED STATE: Audio Call Interface */}
                {callState === "CONNECTED" && partner && (
                    <div className="relative space-y-6 text-center max-w-sm w-full">
                        {/* Timer & Report Overlay */}
                        <div className="flex items-center justify-between w-full bg-muted/40 dark:bg-zinc-900/50 border border-border/50 px-4 py-2 rounded-xl">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                <Clock className="h-4 w-4 animate-pulse" />
                                {formatTime(callDuration)}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors rounded-lg">
                                <Flag className="h-4.5 w-4.5" />
                            </Button>
                        </div>

                        {/* Partner Avatar */}
                        <div className="relative mx-auto pt-2">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative h-48 w-48 rounded-full border border-border/80 shadow-md overflow-hidden mx-auto bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                                {partner.avatar ? (
                                    <Image
                                        src={partner.avatar}
                                        alt={partner.name}
                                        fill
                                        unoptimized
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl font-bold text-primary">
                                        {partner.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Name & Details */}
                        <div className="space-y-3">
                            <h2 className="text-4xl font-heading font-bold text-[#1a2b3b] dark:text-white">{partner.name}</h2>
                            <div className="flex items-center justify-center gap-3">
                                <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
                                    <MapPin className="h-4 w-4" />
                                    Native: {partner.language}
                                </div>
                                <span className="px-3 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                    Speaking Partner
                                </span>
                            </div>
                        </div>

                        {/* Audio Visualizer */}
                        <div className="flex items-center justify-center gap-1.5 h-12 pt-4">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 bg-[#006D5B] rounded-full animate-visualizer"
                                    style={{
                                        height: `${10 + Math.random() * 30}px`,
                                        animationDelay: `${i * 0.08}s`,
                                        animationDuration: `${0.6 + Math.random() * 0.5}s`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Control Bar (Only shown when searching or connected) */}
            {(callState === "CONNECTED" || callState === "SEARCHING") && (
                <footer className="z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-muted/20 px-8 py-6 transition-all duration-300">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        {/* Left: Toggles */}
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            {callState === "CONNECTED" && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleToggleMute}
                                        className={`h-12 w-12 rounded-full border-none transition-all ${isMuted ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-[#006D5B]/5 text-[#1a2b3b] dark:text-white hover:bg-[#006D5B]/10'}`}
                                    >
                                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleToggleVolume}
                                        className={`h-12 w-12 rounded-full border-none transition-all ${isVolumeOff ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-[#006D5B]/5 text-[#1a2b3b] dark:text-white hover:bg-[#006D5B]/10'}`}
                                    >
                                        {isVolumeOff ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
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
                                        className="h-14 px-8 rounded-full bg-[#006D5B] hover:bg-[#005a4b] text-white font-bold gap-2 text-lg shadow-lg shadow-primary/20 transition-all active:scale-95"
                                    >
                                        Next Partner
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        onClick={handleEndCallAndFeedback}
                                        className="h-14 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center"
                                    >
                                        <PhoneOff className="h-5 w-5 text-white" />
                                        End Call
                                    </Button>
                                </>
                            )}
                            {callState === "SEARCHING" && (
                                <Button
                                    variant="destructive"
                                    onClick={handleLeaveCall}
                                    className="h-14 px-8 rounded-full shadow-lg shadow-destructive/20 transition-all active:scale-95 font-bold gap-2 text-lg"
                                >
                                    <PhoneOff className="h-5 w-5 text-white" />
                                    Cancel Matchmaking
                                </Button>
                            )}
                        </div>

                        {/* Right: Tools */}
                        <div className="flex items-center justify-center md:justify-end gap-10">
                            {callState === "CONNECTED" && (
                                <>
                                    <button
                                        className="flex flex-col items-center gap-1.5 transition-all text-muted-foreground hover:text-primary group"
                                    >
                                        <MessageSquareText className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Captions</span>
                                    </button>
                                    <button
                                        className="flex flex-col items-center gap-1.5 transition-all text-muted-foreground hover:text-primary group"
                                    >
                                        <StickyNote className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Notes</span>
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
