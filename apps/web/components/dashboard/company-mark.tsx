import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  companyInitials,
  type CompanyProfile,
} from "@/lib/workspace/company-profile"
import { cn } from "@/lib/utils"

export function CompanyMark({
  profile,
  className,
}: {
  profile: CompanyProfile
  className?: string
}) {
  return (
    <Avatar
      className={cn(
        "size-8 shrink-0 rounded-lg border border-signal/15 bg-signal-surface text-xs text-signal after:rounded-lg",
        className
      )}
    >
      {profile.logoDataUrl && (
        <AvatarImage
          src={profile.logoDataUrl}
          alt="Company logo"
          className="rounded-[inherit] object-contain p-1"
        />
      )}
      <AvatarFallback className="rounded-[inherit] bg-signal-surface text-[length:inherit] font-semibold text-signal">
        {companyInitials(profile.companyName)}
      </AvatarFallback>
    </Avatar>
  )
}
