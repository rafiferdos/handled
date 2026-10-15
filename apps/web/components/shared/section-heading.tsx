import { cn } from "@/lib/utils"

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
    <div className={cn("max-w-2xl", className)}>
      <p className="eyebrow mb-5">{eyebrow}</p>
      <h2 className="font-heading text-4xl leading-[1.07] font-medium tracking-[-0.045em] text-balance md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {children && (
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
          {children}
        </p>
      )}
    </div>
  )
}
