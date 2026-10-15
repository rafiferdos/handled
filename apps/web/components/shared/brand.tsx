import Link from "next/link"
import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-8 shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M6 5h7v9a4 4 0 0 0 4 4h9v7H15a9 9 0 0 1-9-9V5Z"
        fill="currentColor"
      />
      <path
        d="M26 5h-7v6a2 2 0 0 0 2 2h5V5ZM6 27h7v-5a2 2 0 0 0-2-2H6v7Z"
        fill="currentColor"
        opacity=".55"
      />
    </svg>
  )
}

export function Brand({
  className,
  href = "/",
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      aria-label="Handled home"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg font-heading text-2xl font-medium tracking-[-0.055em] focus-visible:outline-2 focus-visible:outline-offset-4",
        className
      )}
    >
      <BrandMark />
      handled
      <span className="mt-1 ml-0.5 text-[9px] tracking-normal opacity-60">
        ®
      </span>
    </Link>
  )
}
