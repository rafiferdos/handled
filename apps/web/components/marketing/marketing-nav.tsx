"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowRight,
  ArrowUpRight,
  Layers3,
  Menu,
  ShieldCheck,
  Workflow,
  X,
} from "lucide-react"
import { Brand, BrandMark } from "@/components/shared/brand"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { ButtonLink } from "@/components/shared/button-link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"

const links = [
  {
    label: "Product",
    href: "/product",
    description: "The whole support picture, in one place.",
    icon: Layers3,
  },
  {
    label: "How it works",
    href: "/how-it-works",
    description: "From a question to a thoughtful next step.",
    icon: Workflow,
  },
  {
    label: "Our approach",
    href: "/#approach",
    description: "Evidence first. A person in control.",
    icon: ShieldCheck,
  },
]

export function MarketingNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    const closeAtDesktop = () => {
      if (desktop.matches) setOpen(false)
    }
    const closeOnHistory = () => setOpen(false)
    desktop.addEventListener("change", closeAtDesktop)
    window.addEventListener("popstate", closeOnHistory)
    return () => {
      desktop.removeEventListener("change", closeAtDesktop)
      window.removeEventListener("popstate", closeOnHistory)
    }
  }, [])

  return (
    <header className="marketing-nav premium-nav sticky top-0 z-40">
      <div className="nav-shell">
        <div className="nav-brand">
          <Brand />
        </div>
        <nav aria-label="Main navigation" className="nav-destinations">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="nav-destination"
            >
              <span className="nav-active-dot" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-utilities">
          <Link href="/login" className="nav-login">
            Log in
          </Link>
          <div className="nav-theme">
            <ThemeToggle />
          </div>
          <span className="nav-utility-divider" aria-hidden="true" />
          <ButtonLink
            href="/dashboard"
            className="signal-button nav-desktop-action"
          >
            Explore Handled <ArrowUpRight aria-hidden="true" />
          </ButtonLink>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  className="nav-menu-trigger"
                  aria-label="Open navigation menu"
                />
              }
            >
              <span>Menu</span>
              <Menu aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="top"
              showCloseButton={false}
              className="mobile-nav-panel"
            >
              <SheetHeader className="mobile-nav-header">
                <div className="mobile-nav-heading">
                  <BrandMark className="mobile-nav-brand-mark" />
                  <div>
                    <SheetTitle>Explore Handled</SheetTitle>
                    <SheetDescription>
                      A clearer way to support.
                    </SheetDescription>
                  </div>
                </div>
                <SheetClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mobile-nav-close"
                      aria-label="Close navigation"
                    />
                  }
                >
                  <X aria-hidden="true" />
                </SheetClose>
              </SheetHeader>
              <nav
                aria-label="Mobile navigation"
                className="mobile-nav-destinations"
              >
                {links.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-label={link.label}
                    aria-describedby={`mobile-nav-description-${index}`}
                    aria-current={pathname === link.href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="mobile-nav-destination"
                  >
                    <span className="mobile-nav-icon" aria-hidden="true">
                      <link.icon />
                    </span>
                    <span className="mobile-nav-copy">
                      <strong>{link.label}</strong>
                      <small id={`mobile-nav-description-${index}`}>
                        {link.description}
                      </small>
                    </span>
                    <ArrowRight
                      className="mobile-nav-link-arrow"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
              <div className="mobile-nav-footer">
                <div className="mobile-nav-actions">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="mobile-nav-login"
                  >
                    Log in <ArrowUpRight aria-hidden="true" />
                  </Link>
                  <ButtonLink
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="signal-button mobile-nav-primary"
                  >
                    Explore Handled <ArrowUpRight aria-hidden="true" />
                  </ButtonLink>
                </div>
                <p>
                  <span /> No sign-in required.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
