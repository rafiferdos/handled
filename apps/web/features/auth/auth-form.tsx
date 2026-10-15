"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { ButtonLink } from "@/components/shared/button-link"

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

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [submitted, setSubmitted] = useState(false)
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
          message: "Use at least 8 characters for this sample form.",
        })
    })
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  })
  const errors = form.formState.errors
  return (
    <>
      <p className="eyebrow mb-4 text-muted-foreground">{copy.eyebrow}</p>
      <h1 className="font-heading text-4xl leading-[1.08] font-medium tracking-[-0.045em]">
        {copy.title}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {copy.description}
      </p>
      <Alert className="mt-7 border-border bg-muted/35">
        <Info className="size-4" />
        <AlertTitle className="text-xs">
          Account access is being connected
        </AlertTitle>
        <AlertDescription className="text-[11px] leading-relaxed">
          This is a preview form. Use sample details only, or explore the
          workspace without signing in.
        </AlertDescription>
      </Alert>
      <form
        noValidate
        className="mt-7"
        onSubmit={form.handleSubmit(() => {
          setSubmitted(true)
          form.resetField("password")
          toast.info(copy.result)
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
                    className="text-[10px] text-muted-foreground underline-offset-4 hover:underline"
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
            disabled={form.formState.isSubmitting}
          >
            {copy.action}
            <ArrowRight className="ml-auto size-3.5" />
          </Button>
        </FieldGroup>
      </form>
      {submitted && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-warning/20 bg-warning-surface p-3 text-xs leading-relaxed text-warning"
        >
          {copy.result} You can explore the sample workspace below.
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
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
      <div className="mt-7 border-t pt-6">
        <ButtonLink
          href="/dashboard"
          variant="outline"
          className="h-11 w-full rounded-xl text-xs"
        >
          Explore preview workspace
          <ArrowUpRight className="ml-auto size-3.5" />
        </ButtonLink>
      </div>
    </>
  )
}
