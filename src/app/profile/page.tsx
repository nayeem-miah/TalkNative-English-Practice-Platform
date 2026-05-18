"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useGetMeQuery, useLogoutMutation, useUpdateProfileMutation } from "@/redux/api/auth-api"
import {
    Activity,
    CalendarDays,
    Clock,
    Edit,
    Globe,
    Languages,
    LogOut,
    Mail,
    Phone,
    ShieldCheck,
    User as UserIcon
} from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

export default function ProfilePage() {
    const { data: userResponse, isLoading } = useGetMeQuery(undefined)
    const [logout] = useLogoutMutation()
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
    const router = useRouter()

    const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data

    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
    const [formData, setFormData] = React.useState({
        name: "",
        phone: "",
        nativeLanguage: "",
        learningLanguage: "",
        bio: "",
        oldPassword: "",
        newPassword: ""
    })

    // Initialize form data when user is loaded
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                phone: user.Phone || "",
                nativeLanguage: user.nativeLanguage || "Bengali",
                learningLanguage: user.learningLanguage || "English",
                bio: user.bio || ""
            }))
        }
    }, [user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload: any = {
                name: formData.name,
                phone: formData.phone,
                nativeLanguage: formData.nativeLanguage,
                learningLanguage: formData.learningLanguage,
                bio: formData.bio
            }

            // Only include passwords if they are both filled
            if (formData.oldPassword && formData.newPassword) {
                payload.oldPassword = formData.oldPassword
                payload.newPassword = formData.newPassword
            } else if (formData.oldPassword || formData.newPassword) {
                return toast.error("Please provide both old and new password to change it.")
            }

            const res = await updateProfile(payload).unwrap()
            if (res?.success) {
                toast.success("Profile updated successfully!")
                setIsEditModalOpen(false)
                setFormData(prev => ({ ...prev, oldPassword: "", newPassword: "" }))
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update profile")
        }
    }

    const handleLogout = async () => {
        try {
            await logout(undefined).unwrap()
            window.location.href = "/login"
        } catch (err) {
            window.location.href = "/login"
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-semibold">Loading your profile...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 max-w-md mx-auto text-center px-4">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-heading mb-2">Session Expired</h2>
                    <p className="text-muted-foreground">Please log in again to view your profile and continue practicing.</p>
                </div>
                <Button size="lg" className="w-full rounded-xl" onClick={() => router.push("/login")}>
                    Go to Login
                </Button>
            </div>
        )
    }

    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : "Recently"

    return (
        <div className="min-h-screen bg-[#f8faff] dark:bg-zinc-950 pb-20">
            {/* Banner Section */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
            </div>

            <div className="container px-4 md:px-8 mx-auto -mt-20">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

                    {/* Left Column - Profile Card */}
                    <div className="w-full md:w-1/3 flex flex-col gap-6">
                        <Card className="border-none shadow-xl shadow-primary/5 rounded-3xl overflow-hidden relative">
                            <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-110" />
                                    <Avatar className="h-32 w-32 border-4 border-background relative shadow-lg">
                                        <AvatarImage src={user.profilePicture || user.image} alt={user.name} />
                                        <AvatarFallback className="bg-primary/5 text-primary text-4xl font-bold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {user.isVerified && (
                                        <div className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full p-1.5 border-2 border-background shadow-sm" title="Verified User">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-2xl font-heading font-bold mb-1">{user.name}</h1>
                                <p className="text-muted-foreground text-sm font-medium mb-4 flex items-center justify-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5" />
                                    {user.email}
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15 font-semibold px-3 py-1 rounded-full">
                                        {user.role || "USER"}
                                    </Badge>
                                    <Badge variant="outline" className="border-muted font-semibold px-3 py-1 rounded-full">
                                        <CalendarDays className="h-3.5 w-3.5 mr-1.5 inline" />
                                        Joined {joinedDate}
                                    </Badge>
                                </div>

                                <div className="flex flex-col w-full gap-3">
                                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                        <DialogTrigger
                                            render={
                                                <Button className="w-full rounded-xl font-bold shadow-lg shadow-primary/20 gap-2" />
                                            }
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit Profile
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] md:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl font-heading font-bold">Edit Profile</DialogTitle>
                                                <DialogDescription>
                                                    Make changes to your profile here. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleUpdateProfile} className="space-y-4 py-2">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter your name"
                                                            className="rounded-xl h-12 bg-muted/50 border-transparent focus:border-primary focus:ring-primary/20"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                                                        <Input
                                                            id="phone"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            placeholder="e.g. 01345678903"
                                                            className="rounded-xl h-12 bg-muted/50 border-transparent focus:border-primary focus:ring-primary/20"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="nativeLanguage" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Native Language</Label>
                                                        <Input
                                                            id="nativeLanguage"
                                                            name="nativeLanguage"
                                                            list="languages"
                                                            value={formData.nativeLanguage}
                                                            onChange={handleInputChange}
                                                            placeholder="Search or select language..."
                                                            className="rounded-xl h-12 bg-muted/50 border-transparent focus:border-primary focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="learningLanguage" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Learning Language</Label>
                                                        <Input
                                                            id="learningLanguage"
                                                            name="learningLanguage"
                                                            list="languages"
                                                            value={formData.learningLanguage}
                                                            onChange={handleInputChange}
                                                            placeholder="Search or select language..."
                                                            className="rounded-xl h-12 bg-muted/50 border-transparent focus:border-primary focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    
                                                    <datalist id="languages">
                                                        {[
                                                            "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian", "Bengali", "Bosnian", "Bulgarian", "Catalan", "Cebuano", "Chichewa", "Chinese", "Corsican", "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Filipino", "Finnish", "French", "Frisian", "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole", "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Kinyarwanda", "Korean", "Kurdish", "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish", "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian", "Myanmar (Burmese)", "Nepali", "Norwegian", "Odia", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi", "Romanian", "Russian", "Samoan", "Scots Gaelic", "Serbian", "Sesotho", "Shona", "Sindhi", "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen", "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
                                                        ].map(lang => (
                                                            <option key={lang} value={lang} />
                                                        ))}
                                                    </datalist>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About Me (Bio)</Label>
                                                    <Textarea
                                                        id="bio"
                                                        name="bio"
                                                        value={formData.bio}
                                                        onChange={handleInputChange}
                                                        placeholder="Tell your speaking partners a bit about yourself..."
                                                        className="rounded-xl min-h-[100px] resize-none bg-muted/50 border-transparent focus:border-primary focus:ring-primary/20"
                                                    />
                                                </div>

                                                <div className="border-t border-border pt-4 mt-2">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Change Password (Optional)</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="oldPassword">Old Password</Label>
                                                            <Input
                                                                id="oldPassword"
                                                                name="oldPassword"
                                                                type="password"
                                                                value={formData.oldPassword}
                                                                onChange={handleInputChange}
                                                                placeholder="••••••••"
                                                                className="rounded-xl h-12 bg-muted/50 border-transparent focus:border-primary focus:ring-primary/20"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="newPassword">New Password</Label>
                                                            <Input
                                                                id="newPassword"
                                                                name="newPassword"
                                                                type="password"
                                                                value={formData.newPassword}
                                                                onChange={handleInputChange}
                                                                placeholder="••••••••"
                                                                className="rounded-xl h-12 bg-muted/50 border-transparent focus:border-primary focus:ring-primary/20"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <DialogFooter className="pt-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setIsEditModalOpen(false)}
                                                        className="rounded-xl font-bold w-full sm:w-auto"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={isUpdating}
                                                        className="rounded-xl font-bold shadow-lg shadow-primary/20 w-full sm:w-auto mt-2 sm:mt-0"
                                                    >
                                                        {isUpdating ? "Saving..." : "Save Changes"}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    <Button variant="outline" className="w-full rounded-xl font-bold text-destructive hover:bg-destructive/5 hover:text-destructive gap-2 border-muted" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4" />
                                        Log Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Info Cards */}
                    <div className="w-full md:w-2/3 flex flex-col gap-6 pt-4 md:pt-20">
                        <h2 className="text-xl font-heading font-bold text-foreground">Overview</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Language Preferences */}
                            <Card className="border-none shadow-lg shadow-primary/5 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <Languages className="h-4 w-4" />
                                        Language Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Native Language</p>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-primary" />
                                            <span className="font-semibold">{user.nativeLanguage || "Bengali"}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Learning Language</p>
                                        <div className="flex items-center gap-2">
                                            <Languages className="h-4 w-4 text-accent" />
                                            <span className="font-semibold">{user.learningLanguage || "English"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Activity Stats */}
                            <Card className="border-none shadow-lg shadow-primary/5 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        Activity Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Total Speaking Time</p>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-amber-500" />
                                            <span className="font-semibold text-xl">
                                                {user.totalMinutesSpent || 0} <span className="text-sm text-muted-foreground">mins</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Account Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                            <span className="font-semibold capitalize">{user.status?.toLowerCase() || 'Active'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>

                        {/* About / Bio Section */}
                        <Card className="border-none shadow-lg shadow-primary/5 rounded-2xl mt-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <UserIcon className="h-4 w-4" />
                                    About
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {user.bio ? (
                                        user.bio
                                    ) : (
                                        <span className="text-muted-foreground italic">No bio added yet. Add a bio to let your speaking partners know more about you!</span>
                                    )}
                                </p>
                                {user.Phone && (
                                    <div className="mt-4 pt-4 border-t border-muted/30 flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-semibold">{user.Phone}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    )
}
