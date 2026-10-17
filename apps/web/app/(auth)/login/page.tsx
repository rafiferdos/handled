import type { Metadata } from "next"
import { AuthForm } from "@/features/auth/auth-form"
export const metadata: Metadata = { title: "Sign in" }
export default function LoginPage() {
  return <AuthForm mode="login" live={Boolean(process.env.HANDLED_API_URL)} />
}
