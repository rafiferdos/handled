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
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow mb-3 text-muted-foreground">{eyebrow}</p>
        <h1 className="font-heading text-3xl font-medium tracking-[-0.04em] md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground md:text-sm">
          {description}
        </p>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  )
}
