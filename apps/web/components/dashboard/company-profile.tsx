"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Building2,
  Check,
  CircleDashed,
  Globe2,
  ImagePlus,
  Mail,
  ShieldCheck,
} from "lucide-react"
import { CompanyMark } from "@/components/dashboard/company-mark"
import { PageHeading } from "@/components/dashboard/page-heading"
import { useWorkspace } from "@/components/dashboard/workspace-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  normalizeCompanyProfile,
  readCompanyLogo,
  validateCompanyProfile,
  type CompanyProfile,
} from "@/lib/workspace/company-profile"

type ProfileErrors = Partial<Record<keyof CompanyProfile, string>>
type TextField = Exclude<keyof CompanyProfile, "logoDataUrl">

const profileFields: {
  name: TextField
  label: string
  type?: "url" | "email"
  autoComplete?: string
  hint?: string
  maxLength: number
}[] = [
  {
    name: "companyName",
    label: "Company name",
    autoComplete: "organization",
    maxLength: 80,
  },
  {
    name: "industry",
    label: "Industry",
    maxLength: 80,
  },
  {
    name: "website",
    label: "Website",
    type: "url",
    autoComplete: "url",
    hint: "Use a complete HTTPS address.",
    maxLength: 2048,
  },
  {
    name: "supportEmail",
    label: "Support email",
    type: "email",
    autoComplete: "email",
    hint: "A contact address; this does not connect a mailbox.",
    maxLength: 254,
  },
  {
    name: "timeZone",
    label: "Time zone",
    hint: "Use an IANA name, such as Asia/Dhaka or Europe/London.",
    maxLength: 100,
  },
]

const commonTimeZones = [
  "UTC",
  "Asia/Dhaka",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
]

export function CompanyProfileView() {
  const { mode } = useWorkspace()
  return mode === "live" ? (
    <LiveCompanyProfileView />
  ) : (
    <SampleCompanyProfileView />
  )
}

function LiveCompanyProfileView() {
  const { workspace, profile, api } = useWorkspace()
  const cache = useQueryClient()
  const [name, setName] = useState(workspace.name)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")
  return (
    <div className="company-page">
      <PageHeading
        eyebrow={`${workspace.name} / Company`}
        title="Your company, in focus."
        description="Your workspace identity is shared with your team."
      />
      <section className="company-identity mb-6 flex flex-wrap items-center gap-5 rounded-3xl border p-7">
        <CompanyMark profile={profile} className="company-identity-mark" />
        <div>
          <h2 className="font-heading text-3xl">{workspace.name}</h2>
          <p className="mt-2 font-mono text-xs">{workspace.slug}</p>
        </div>
      </section>
      <Card className="workspace-panel">
        <CardHeader>
          <CardTitle className="font-heading text-xl">
            Company details
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            The company name is saved to your workspace. Additional branding
            fields are not available in the API yet.
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={async (event) => {
              event.preventDefault()
              setPending(true)
              setMessage("")
              try {
                await api!.patch(
                  `/workspaces/${workspace.id}`,
                  { name: name.trim(), expectedVersion: workspace.version },
                  z.object({
                    id: z.uuid(),
                    name: z.string(),
                    version: z.number(),
                  })
                )
                await cache.invalidateQueries({
                  queryKey: ["live", "workspaces"],
                })
                setMessage("Company name saved.")
              } catch (error) {
                setMessage(
                  error instanceof Error
                    ? error.message
                    : "The company name could not be saved."
                )
              } finally {
                setPending(false)
              }
            }}
          >
            <Label htmlFor="live-company-name">Company name</Label>
            <Input
              id="live-company-name"
              required
              minLength={1}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              readOnly={workspace.role !== "ADMIN"}
            />
            <Button
              disabled={
                pending ||
                workspace.role !== "ADMIN" ||
                name.trim() === workspace.name
              }
            >
              Save company name
            </Button>
            {workspace.role !== "ADMIN" && (
              <p className="text-sm text-muted-foreground">
                An administrator can update the company name.
              </p>
            )}
            <p role="status" className="text-sm">
              {message}
            </p>
          </form>
          <Link
            href={`/support/${workspace.slug}`}
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm underline"
          >
            Open customer support form
            <ArrowUpRight className="size-4" />
          </Link>
          <p className="mt-2 text-xs text-muted-foreground">
            A support form accepts requests after an administrator enables it
            for this company.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function SampleCompanyProfileView() {
  const { workspace, profile, updateProfile } = useWorkspace()
  const [draft, setDraft] = useState<CompanyProfile>(profile)
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [status, setStatus] = useState("")
  const [logoError, setLogoError] = useState("")
  const [logoName, setLogoName] = useState("")
  const [readingLogo, setReadingLogo] = useState(false)
  const logoRequest = useRef(0)
  const formRef = useRef<HTMLFormElement>(null)
  const dirty = (Object.keys(draft) as (keyof CompanyProfile)[]).some(
    (key) => draft[key] !== profile[key]
  )

  useEffect(() => {
    return () => {
      logoRequest.current += 1
    }
  }, [])

  function changeField(name: TextField, value: string) {
    setDraft((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setStatus("")
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (readingLogo) return
    const next = normalizeCompanyProfile(draft)
    const nextErrors = validateCompanyProfile(next)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus("")
      const firstField = profileFields.find(({ name }) => nextErrors[name])
      if (firstField) {
        formRef.current
          ?.querySelector<HTMLInputElement>(`#company-${firstField.name}`)
          ?.focus()
      }
      return
    }
    updateProfile(next)
    setDraft(next)
    setStatus("Company profile saved in this preview.")
  }

  function cancelChanges() {
    logoRequest.current += 1
    setDraft(profile)
    setErrors({})
    setLogoError("")
    setLogoName("")
    setReadingLogo(false)
    setStatus("Changes discarded.")
  }

  async function chooseLogo(file: File) {
    const request = ++logoRequest.current
    setReadingLogo(true)
    setLogoError("")
    setStatus("")
    try {
      const logoDataUrl = await readCompanyLogo(file)
      if (request !== logoRequest.current) return
      setDraft((current) => ({ ...current, logoDataUrl }))
      setLogoName(file.name)
    } catch (error) {
      if (request !== logoRequest.current) return
      setLogoError(
        error instanceof Error ? error.message : "This image could not be read."
      )
    } finally {
      if (request === logoRequest.current) setReadingLogo(false)
    }
  }

  return (
    <div className="company-page">
      <PageHeading
        eyebrow={`${workspace.name} / Company`}
        title="Your company, in focus."
        description="Give your team a familiar home, with the right identity and support details."
      />

      <section
        aria-label="Company identity"
        className="company-identity mb-6 flex flex-wrap items-center gap-5 rounded-3xl border p-5 sm:p-7"
      >
        <CompanyMark profile={profile} className="company-identity-mark" />
        <div className="min-w-0 flex-1 basis-36">
          <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground">
            COMPANY WORKSPACE
          </p>
          <h2 className="company-identity-name font-heading text-2xl leading-tight font-medium tracking-tight sm:text-3xl">
            {profile.companyName}
          </h2>
          <p className="company-industry mt-2 text-sm text-muted-foreground">
            {profile.industry || "Add your company details below"}
          </p>
        </div>
        <div className="company-identity-address min-w-0 rounded-2xl border px-4 py-3">
          <p className="mb-1 text-xs text-muted-foreground">
            Workspace address
          </p>
          <p className="font-mono text-xs break-all">{workspace.slug}</p>
        </div>
      </section>

      <div className="company-page-grid grid items-start gap-6">
        <Card className="workspace-panel company-details-card min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-xl font-medium">
              <Building2 aria-hidden="true" className="size-4 text-signal" />
              Company details
            </CardTitle>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Changes stay in this preview. Reloading resets the profile.
            </p>
          </CardHeader>
          <CardContent>
            <form ref={formRef} noValidate onSubmit={saveProfile}>
              <div className="company-logo-editor mb-7 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center">
                <CompanyMark
                  profile={draft}
                  className="company-logo-preview shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <Label htmlFor="company-logo">Company logo</Label>
                  <Input
                    id="company-logo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="company-logo-input company-input"
                    aria-invalid={Boolean(logoError)}
                    aria-describedby={`company-logo-hint${logoError ? " company-logo-error" : ""}`}
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0]
                      event.currentTarget.value = ""
                      if (file) void chooseLogo(file)
                    }}
                  />
                  <p
                    id="company-logo-hint"
                    className="text-xs leading-relaxed text-muted-foreground"
                  >
                    PNG, JPEG or WebP, up to 512 KB. A square image works best.
                  </p>
                  {logoName && !readingLogo && (
                    <p className="company-filename text-xs text-muted-foreground">
                      Selected: {logoName}
                    </p>
                  )}
                  {readingLogo && (
                    <p role="status" className="text-xs text-muted-foreground">
                      Reading logo…
                    </p>
                  )}
                  {logoError && (
                    <p
                      id="company-logo-error"
                      role="alert"
                      className="text-xs leading-relaxed text-destructive"
                    >
                      {logoError}
                    </p>
                  )}
                  {draft.logoDataUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="company-button -ml-3 h-11 text-xs"
                      onClick={() => {
                        logoRequest.current += 1
                        setDraft((current) => ({
                          ...current,
                          logoDataUrl: null,
                        }))
                        setLogoName("")
                        setLogoError("")
                        setReadingLogo(false)
                        setStatus("")
                      }}
                    >
                      Remove logo
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
                {profileFields.map((field) => {
                  const error = errors[field.name]
                  const hintId = `company-${field.name}-hint`
                  const errorId = `company-${field.name}-error`
                  const describedBy =
                    [field.hint && hintId, error && errorId]
                      .filter(Boolean)
                      .join(" ") || undefined
                  return (
                    <div
                      key={field.name}
                      className={`min-w-0 space-y-2${field.name === "timeZone" ? "sm:col-span-2" : ""}`}
                    >
                      <Label htmlFor={`company-${field.name}`}>
                        {field.label}
                      </Label>
                      <Input
                        id={`company-${field.name}`}
                        name={field.name}
                        type={field.type ?? "text"}
                        autoComplete={field.autoComplete ?? "off"}
                        maxLength={field.maxLength}
                        value={draft[field.name]}
                        required={
                          field.name === "companyName" ||
                          field.name === "timeZone"
                        }
                        list={
                          field.name === "timeZone"
                            ? "company-time-zones"
                            : undefined
                        }
                        className="company-input h-11 rounded-xl"
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        onChange={(event) =>
                          changeField(field.name, event.currentTarget.value)
                        }
                      />
                      {field.hint && (
                        <p
                          id={hintId}
                          className="text-xs leading-relaxed text-muted-foreground"
                        >
                          {field.hint}
                        </p>
                      )}
                      {error && (
                        <p
                          id={errorId}
                          className="text-xs leading-relaxed text-destructive"
                        >
                          {error}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
              <datalist id="company-time-zones">
                {commonTimeZones.map((zone) => (
                  <option value={zone} key={zone} />
                ))}
              </datalist>

              <div className="company-form-footer mt-7 border-t pt-5">
                <div className="company-form-actions flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    className="company-button h-11 gap-2 rounded-xl bg-signal px-5 text-signal-foreground hover:bg-signal/90"
                    disabled={!dirty || readingLogo}
                  >
                    <Check aria-hidden="true" className="size-4" />
                    Save profile
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="company-button h-11 rounded-xl px-4"
                    disabled={!dirty && !readingLogo && !logoError}
                    onClick={cancelChanges}
                  >
                    Cancel changes
                  </Button>
                </div>
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 min-h-5 text-xs leading-relaxed text-muted-foreground"
                >
                  {status || (dirty ? "You have unsaved changes." : "")}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <aside aria-label="Workspace setup" className="min-w-0 space-y-5">
          <Card className="workspace-panel company-setup-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-medium">
                Workspace setup
              </CardTitle>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                The essentials behind your team’s workspace.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="company-setup-list space-y-5">
                <SetupItem
                  icon={Building2}
                  title="Company identity"
                  state="Editable here"
                  description="A shared name and logo across this workspace."
                  available
                />
                <SetupItem
                  icon={ShieldCheck}
                  title="Account & team"
                  state="Not connected"
                  description="Sign-in, membership and invitations are not available yet."
                />
                <SetupItem
                  icon={Globe2}
                  title="Subscription"
                  state="Subscription not connected"
                  description="No paid plan or billing account is attached to this preview."
                />
                <SetupItem
                  icon={Mail}
                  title="Support channels"
                  state="Not connected"
                  description="Adding a contact address does not receive customer messages."
                />
              </ul>
            </CardContent>
          </Card>

          <div className="company-handoff rounded-3xl border p-5">
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-signal-surface text-signal">
              <ShieldCheck aria-hidden="true" className="size-4" />
            </div>
            <h2 className="font-heading text-lg font-medium">
              Keep people in control.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Review recommendations against company policies before making a
              decision. Decisions here stay local and do not change customer
              accounts.
            </p>
            <div className="mt-3 flex flex-col">
              <Link
                href="/knowledge"
                className="company-resource-link inline-flex min-h-11 items-center justify-between gap-3 rounded-lg text-sm font-medium"
              >
                Company knowledge
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/tickets"
                className="company-resource-link inline-flex min-h-11 items-center justify-between gap-3 rounded-lg text-sm font-medium"
              >
                Review the inbox
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SetupItem({
  icon: Icon,
  title,
  state,
  description,
  available = false,
}: {
  icon: typeof Building2
  title: string
  state: string
  description: string
  available?: boolean
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p
          className={`mt-1 flex items-center gap-1.5 text-xs ${available ? "text-signal" : "text-muted-foreground"}`}
        >
          {available ? (
            <ImagePlus aria-hidden="true" className="size-3 shrink-0" />
          ) : (
            <CircleDashed aria-hidden="true" className="size-3 shrink-0" />
          )}
          {state}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </li>
  )
}
