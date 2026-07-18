import type { Metadata } from "next"
import { ContactClient } from "./components/ContactClient"

export const metadata: Metadata = {
  title: "Contact Us | TalkNative English Practice",
  description: "Get in touch with the TalkNative team for support, inquiries, or feedback. We are here to help you master English speaking.",
}

export default function ContactPage() {
  return <ContactClient />
}
