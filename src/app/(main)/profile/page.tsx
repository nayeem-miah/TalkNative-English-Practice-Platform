import type { Metadata } from "next"
import { ProfileClient } from "./components/ProfileClient"

export const metadata: Metadata = {
  title: "My Profile | TalkNative English Practice",
  description: "Manage your account, change your profile details, native/learning language preferences, and view your English speaking stats.",
}

export default function ProfilePage() {
  return <ProfileClient />
}
