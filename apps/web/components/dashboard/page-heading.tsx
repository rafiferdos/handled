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
      className="workspace-page-heading mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
    >
      <div className="min-w-0">
        <p className="eyebrow mb-4 flex items-center gap-2.5 text-[11px] text-muted-foreground">
          <span aria-hidden="true" className="h-px w-5 bg-signal" />
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-heading text-[2rem] leading-[1.12] font-medium tracking-[-0.045em] md:text-[2.65rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-[40rem] text-sm leading-[1.75] text-muted-foreground">
          {description}
        </p>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </Reveal>
  )
}
