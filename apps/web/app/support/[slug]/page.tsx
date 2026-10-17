import { SupportForm } from "@/features/support/support-form"
import { Brand } from "@/components/shared/brand"

export const metadata = {
  title: "Contact support",
  robots: { index: false, follow: false },
}
export default async function SupportPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <main id="main-content" className="mx-auto max-w-xl px-6 py-12">
      <Brand />
      <div className="workspace-panel mt-10 rounded-3xl border p-6 sm:p-9">
        <p className="eyebrow text-muted-foreground">Customer support</p>
        <h1 className="mt-3 font-heading text-3xl">How can we help?</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Send your request to {slug}. You do not need a Handled account. Your
          details help the team verify your account.
        </p>
        <SupportForm slug={slug} />
      </div>
    </main>
  )
}
