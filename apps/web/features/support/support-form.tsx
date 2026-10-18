"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/api/client"
import { z } from "zod"

export function SupportForm({ slug }: { slug: string }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [receipt, setReceipt] = useState("")
  const [submission, setSubmission] = useState<{
    body: string
    key: string
  } | null>(null)
  return (
    <form
      className="mt-7 space-y-5"
      onSubmit={async (event) => {
        event.preventDefault()
        const values = new FormData(event.currentTarget)
        const body = JSON.stringify({
          requesterEmail: values.get("email"),
          requesterCustomerRef: values.get("customerRef") || undefined,
          subject: values.get("subject"),
          body: values.get("body"),
        })
        const key =
          submission?.body === body ? submission.key : crypto.randomUUID()
        setSubmission({ body, key })
        setPending(true)
        setError("")
        try {
          const response = await fetch(
            `/api/support/${encodeURIComponent(slug)}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Idempotency-Key": key,
              },
              body,
            }
          )
          if (!response.ok) {
            const payload: unknown = await response.json().catch(() => null)
            const parsed = z
              .object({ error: z.object({ code: z.string() }) })
              .safeParse(payload)
            throw new ApiError(
              parsed.success
                ? parsed.data.error.code
                : "DEPENDENCY_UNAVAILABLE",
              response.status
            )
          }
          const result = z
            .object({
              data: z.object({
                id: z.uuid(),
                reference: z.string(),
                status: z.string(),
              }),
            })
            .parse(await response.json())
          setReceipt(result.data.reference)
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Your request could not be sent."
          )
        } finally {
          setPending(false)
        }
      }}
    >
      {receipt ? (
        <div role="status" className="rounded-xl border p-4">
          <h2 className="font-medium">Your request was received</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The support team will verify your account and review your request.
          </p>
          <p className="mt-3 font-mono text-xs break-all">Receipt: {receipt}</p>
        </div>
      ) : (
        <>
          <label className="block space-y-2 text-sm">
            <span>Email address</span>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Customer reference (optional)</span>
            <Input name="customerRef" maxLength={64} />
          </label>
          <label className="block space-y-2 text-sm">
            <span>Subject</span>
            <Input name="subject" required maxLength={200} />
          </label>
          <label className="block space-y-2 text-sm">
            <span>What happened?</span>
            <Textarea name="body" required maxLength={10000} rows={5} />
          </label>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending} className="h-11 w-full">
            {pending ? "Sending your request…" : "Send support request"}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Please use synthetic test details in this free preview. Do not
            include passwords or payment information.
          </p>
        </>
      )}
    </form>
  )
}
