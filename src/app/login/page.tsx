import type { Metadata } from "next"
import { LoginClient } from "./components/LoginClient"

export const metadata: Metadata = {
  title: "Sign In | TalkNative English Practice",
  description: "Sign in to your TalkNative account to continue practicing English speaking, access your courses, and view tutor feedback.",
}

export default function LoginPage() {
  return <LoginClient />
}
