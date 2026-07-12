import type { Metadata } from "next"
import { RegisterClient } from "./components/RegisterClient"

export const metadata: Metadata = {
  title: "Create an Account | TalkNative English Practice",
  description: "Join TalkNative today and start practicing your English speaking skills with real-time feedback and immersive lessons.",
}

export default function RegisterPage() {
  return <RegisterClient />
}
