import Link from "next/link"
import type { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"

type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>

/** Native link semantics, styled with the installed shadcn Button recipe. */
export function ButtonLink({
  href,
  children,
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </Link>
  )
}
