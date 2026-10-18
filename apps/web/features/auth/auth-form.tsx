"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowUpRight, Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { ButtonLink } from "@/components/shared/button-link"
import { useQueryClient } from "@tanstack/react-query"
import { signIn } from "@/lib/api/session"

type AuthMode = "login" | "signup" | "forgot-password"
const content = {
  login: {
    eyebrow: "Welcome back",
    title: "A clearer day starts here.",
    description: "Sign in to continue to your support workspace.",
    action: "Sign in",
    result: "Sign-in is not connected yet. No session was created.",
  },
  signup: {
    eyebrow: "A thoughtful beginning",
    title: "Put clarity on your team.",
    description: "Start with a workspace built around people and evidence.",
    action: "Create account",
    result: "Account creation is not connected yet. No account was created.",
  },
  "forgot-password": {
    eyebrow: "Let’s get you back",
    title: "A fresh start.",
    description: "Enter your email to begin the password recovery flow.",
    action: "Request reset link",
    result: "Password recovery is not connected yet. No email was sent.",
  },
}

export function AuthForm({
  mode,
  live = false,
}: {
  mode: AuthMode
  live?: boolean
}) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const cache = useQueryClient()
  const copy = content[mode]
  const schema = z
    .object({
      name: z.string(),
      email: z.email("Enter a valid email address."),
      password: z.string(),
    })
    .superRefine((value, context) => {
      if (mode === "signup" && !value.name.trim())
        context.addIssue({
          code: "custom",
          path: ["name"],
          message: "Enter your name.",
        })
      if (mode !== "forgot-password" && !value.password)
        context.addIssue({
          code: "custom",
          path: ["password"],
          message: "Enter a password.",
        })
      if (
        mode === "signup" &&
        value.password.length > 0 &&
        value.password.length < 8
      )
        context.addIssue({
          code: "custom",
          path: ["password"],
          message: "Use at least 8 characters.",
        })
    })
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  })
  const errors = form.formState.errors
  return (
    <div className="auth-form-content" data-auth-mode={mode}>
      <p className="auth-eyebrow eyebrow mb-5 flex items-center gap-3 text-muted-foreground">
        <span aria-hidden="true" className="h-px w-6 bg-signal" />
        {copy.eyebrow}
      </p>
      <h1 className="font-heading text-[2.65rem] leading-[1.05] font-medium tracking-[-0.055em]">
        {copy.title}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {copy.description}
      </p>
      <p id="auth-access-notice" className="auth-access-notice">
        <Info aria-hidden="true" className="size-4 shrink-0" />
        <span>
          {live
            ? mode === "login"
              ? "Use your verified workspace account. Your session is stored in a protected cookie."
              : "This preview uses administrator-provisioned accounts. Contact your workspace administrator for account access or password recovery."
            : "Account access is not connected yet. Use test details only. No sessions, accounts or reset emails are created."}
        </span>
      </p>
      <form
        noValidate
        aria-describedby="auth-access-notice"
        className="mt-8"
        onSubmit={form.handleSubmit(async (values) => {
          if (!live) {
            setSubmitted(true)
            form.resetField("password")
            toast.info(copy.result)
            return
          }
          if (mode !== "login") return
          setError("")
          try {
            await signIn(
              { email: values.email, password: values.password },
              cache
            )
            form.resetField("password")
            router.replace("/dashboard")
            router.refresh()
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Sign-in could not be completed."
            )
          }
        })}
      >
        <FieldGroup className="gap-5">
          {mode === "signup" && (
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="auth-name">Your name</FieldLabel>
              <Input
                id="auth-name"
                autoComplete="name"
                placeholder="Alex Morgan"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...form.register("name")}
                className="h-11 rounded-xl"
              />
              <FieldError id="name-error" errors={[errors.name]} />
            </Field>
          )}
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="auth-email">Email address</FieldLabel>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...form.register("email")}
              className="h-11 rounded-xl"
            />
            <FieldError id="email-error" errors={[errors.email]} />
          </Field>
          {mode !== "forgot-password" && (
            <Field data-invalid={!!errors.password}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                {mode === "login" && (
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input
                id="auth-password"
                type="password"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                placeholder={
                  mode === "signup"
                    ? "At least 8 characters"
                    : "Enter your password"
                }
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...form.register("password")}
                className="h-11 rounded-xl"
              />
              <FieldError id="password-error" errors={[errors.password]} />
            </Field>
          )}
          <Button
            type="submit"
            className="mt-1 h-11 w-full rounded-xl text-xs"
            disabled={form.formState.isSubmitting || (live && mode !== "login")}
          >
            {form.formState.isSubmitting ? "Signing in…" : copy.action}
            <ArrowRight className="ml-auto size-3.5" />
          </Button>
        </FieldGroup>
      </form>
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      {submitted && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-warning/20 bg-warning-surface p-3 text-xs leading-relaxed text-warning"
        >
          {copy.result} You can explore the workspace below.
        </p>
      )}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        {mode === "login" ? (
          <>
            New to Handled?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </>
        ) : mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        )}
      </p>
      <div className="mt-7 border-t pt-6">
        <ButtonLink
          href="/dashboard"
          variant="outline"
          className="h-11 w-full rounded-xl text-xs"
        >
          {live ? "Open your workspace" : "Explore the workspace"}
          <ArrowUpRight className="ml-auto size-3.5" />
        </ButtonLink>
      </div>
    </div>
  )
}
