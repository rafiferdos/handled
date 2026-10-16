import { Reveal } from "@/components/motion/reveal"

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <Reveal
      preset="rise"
      className="workspace-page-heading mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
    >
      <div className="min-w-0">
        <p className="eyebrow mb-3 flex items-center gap-2.5 text-xs text-muted-foreground">
          <span aria-hidden="true" className="h-px w-5 bg-signal" />
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-heading text-[1.875rem] leading-[1.12] font-medium tracking-[-0.045em] md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-[40rem] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </Reveal>
  )
}
