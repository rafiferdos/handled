import { cn } from "@/lib/utils"
import { ScrollHeading } from "@/components/motion/scroll-heading"

export function SectionHeading({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("section-heading max-w-2xl", className)}>
      <p className="eyebrow mb-5 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span aria-hidden="true" className="h-px w-7 bg-signal" />
        {eyebrow}
      </p>
      <ScrollHeading
        text={title}
        mode="highlight"
        className="font-heading text-4xl leading-[1.06] font-medium tracking-[-0.055em] text-balance md:text-5xl lg:text-6xl"
      />
      {children && (
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
          {children}
        </p>
      )}
    </div>
  )
}
