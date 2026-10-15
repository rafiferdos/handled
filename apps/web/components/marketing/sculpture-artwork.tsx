import { useId } from "react"
import { cn } from "@/lib/utils"

/** Decorative vector sculpture, not a render loop or a third-party 3D scene. */
export function SculptureArtwork({ className }: { className?: string }) {
  const id = useId().replaceAll(":", "")
  return (
    <svg
      className={cn("sculpture-artwork h-full w-full", className)}
      viewBox="0 0 560 580"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${id}-metal`}
          x1="106"
          y1="112"
          x2="426"
          y2="492"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F7FAFA" />
          <stop offset=".14" stopColor="#A7B2B5" />
          <stop offset=".28" stopColor="#F8FAFA" />
          <stop offset=".37" stopColor="#58666D" />
          <stop offset=".48" stopColor="#E6EBEB" />
          <stop offset=".61" stopColor="#253139" />
          <stop offset=".72" stopColor="#AEBBBF" />
          <stop offset=".85" stopColor="#E8ECEC" />
          <stop offset="1" stopColor="#63717A" />
        </linearGradient>
        <linearGradient
          id={`${id}-edge`}
          x1="172"
          y1="64"
          x2="404"
          y2="468"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset=".35" stopColor="#D7E1E2" />
          <stop offset=".6" stopColor="#35454F" />
          <stop offset=".78" stopColor="#F3F6F5" />
          <stop offset="1" stopColor="#8E9A9E" />
        </linearGradient>
        <linearGradient
          id={`${id}-inner`}
          x1="90"
          y1="300"
          x2="450"
          y2="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#46545D" />
          <stop offset=".22" stopColor="#BCC8CB" />
          <stop offset=".45" stopColor="#FAFCFB" />
          <stop offset=".62" stopColor="#66777F" />
          <stop offset=".82" stopColor="#F2F5F5" />
          <stop offset="1" stopColor="#4D606D" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor="#1F2D35" stopOpacity=".22" />
          <stop offset="1" stopColor="#1F2D35" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="290" cy="524" rx="162" ry="27" fill={`url(#${id}-shadow)`} />
      <g className="sculpture-float">
        <path
          d="M279 93C355 39 467 114 448 214C432 300 351 302 327 384C307 454 220 506 151 447C78 384 100 294 157 252C215 210 209 145 279 93Z"
          stroke={`url(#${id}-metal)`}
          strokeWidth="80"
        />
        <path
          d="M279 93C355 39 467 114 448 214C432 300 351 302 327 384C307 454 220 506 151 447C78 384 100 294 157 252C215 210 209 145 279 93Z"
          stroke={`url(#${id}-edge)`}
          strokeWidth="2"
          transform="translate(-18 -16)"
          opacity=".65"
        />
        <path
          d="M164 262C204 218 252 254 280 300C313 354 377 373 419 327C458 284 426 229 375 209C316 185 313 128 348 89"
          stroke={`url(#${id}-inner)`}
          strokeWidth="63"
          strokeLinecap="round"
        />
        <path
          d="M172 247C213 216 255 259 280 300C313 354 377 373 419 327"
          stroke="white"
          strokeOpacity=".55"
          strokeWidth="1.8"
          strokeLinecap="round"
          transform="translate(-12 -20)"
        />
        <path
          d="M144 387C125 336 145 309 177 285"
          stroke="#F6FAFA"
          strokeOpacity=".6"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
