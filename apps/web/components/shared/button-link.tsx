import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ButtonLink({
  href,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "render" | "nativeButton"> & {
  href: string
}) {
  return (
    <Button render={<Link href={href} />} nativeButton={false} {...props}>
      {children}
    </Button>
  )
}
