import { useId } from "react"

/** An original glass aperture, drawn as a static vector rather than a 3D scene. */
export function ApertureArtwork() {
  const id = useId().replaceAll(":", "")
  const paint = (name: string) => `url(#${id}-${name})`

  return (
    <svg
      className="hero-aperture-artwork h-full w-full"
      viewBox="0 0 600 520"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-body`}
          x1="170"
          y1="82"
          x2="426"
          y2="416"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F3FFF8" stopOpacity=".93" />
          <stop offset=".12" stopColor="#9FBEB3" stopOpacity=".54" />
          <stop offset=".25" stopColor="#EFFCF4" stopOpacity=".92" />
          <stop offset=".36" stopColor="#536F63" stopOpacity=".42" />
          <stop offset=".49" stopColor="#142D24" stopOpacity=".88" />
          <stop offset=".62" stopColor="#8EB6A1" stopOpacity=".68" />
          <stop offset=".77" stopColor="#E2FFF0" stopOpacity=".94" />
          <stop offset=".88" stopColor="#789D8B" stopOpacity=".55" />
          <stop offset="1" stopColor="#D9FCE9" stopOpacity=".8" />
        </linearGradient>
        <linearGradient
          id={`${id}-depth`}
          x1="180"
          y1="142"
          x2="386"
          y2="442"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8BB3A0" stopOpacity=".5" />
          <stop offset=".4" stopColor="#122C21" stopOpacity=".8" />
          <stop offset=".72" stopColor="#071A13" />
          <stop offset="1" stopColor="#83B99D" stopOpacity=".74" />
        </linearGradient>
        <linearGradient
          id={`${id}-outer-edge`}
          x1="173"
          y1="108"
          x2="422"
          y2="411"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset=".26" stopColor="#D9FFEA" stopOpacity=".7" />
          <stop offset=".44" stopColor="#D9FFEA" stopOpacity="0" />
          <stop offset=".68" stopColor="#90BC9F" stopOpacity=".34" />
          <stop offset=".84" stopColor="#E9FFF2" stopOpacity=".95" />
          <stop offset="1" stopColor="#D9FFEA" stopOpacity=".18" />
        </linearGradient>
        <linearGradient
          id={`${id}-inner-edge`}
          x1="412"
          y1="134"
          x2="212"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#07251A" stopOpacity=".95" />
          <stop offset=".28" stopColor="#DBFFEC" stopOpacity=".8" />
          <stop offset=".43" stopColor="#ADDEC1" stopOpacity=".18" />
          <stop offset=".7" stopColor="#D8FFE8" stopOpacity=".7" />
          <stop offset="1" stopColor="#0B281A" stopOpacity=".95" />
        </linearGradient>
        <radialGradient id={`${id}-lens`} cx=".27" cy=".2" r=".97">
          <stop stopColor="#E2FFF0" stopOpacity=".2" />
          <stop offset=".38" stopColor="#71AD8D" stopOpacity=".1" />
          <stop offset=".73" stopColor="#0C271B" stopOpacity=".62" />
          <stop offset="1" stopColor="#B0EAC6" stopOpacity=".25" />
        </radialGradient>
        <linearGradient
          id={`${id}-reflection`}
          x1="224"
          y1="120"
          x2="338"
          y2="342"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F4FFF9" stopOpacity=".26" />
          <stop offset=".55" stopColor="#D4FFE4" stopOpacity=".05" />
          <stop offset="1" stopColor="#D4FFE4" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${id}-mark`}
          x1="6"
          y1="5"
          x2="25"
          y2="27"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F1FFF7" />
          <stop offset=".55" stopColor="#C2F5D7" />
          <stop offset="1" stopColor="#80B99A" />
        </linearGradient>
        <linearGradient
          id={`${id}-orbit`}
          x1="46"
          y1="197"
          x2="552"
          y2="312"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B2F5D0" stopOpacity="0" />
          <stop offset=".15" stopColor="#B2F5D0" stopOpacity=".2" />
          <stop offset=".38" stopColor="#EDFFF4" stopOpacity=".7" />
          <stop offset=".65" stopColor="#B2F5D0" stopOpacity=".16" />
          <stop offset=".86" stopColor="#D9FFE8" stopOpacity=".65" />
          <stop offset="1" stopColor="#B2F5D0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor="#071A12" stopOpacity=".6" />
          <stop offset="1" stopColor="#071A12" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="301" cy="470" rx="181" ry="26" fill={paint("shadow")} />

      <g className="hero-aperture-orbits">
        <g transform="rotate(-19 300 252)">
          <ellipse
            cx="300"
            cy="252"
            rx="254"
            ry="81"
            stroke={paint("orbit")}
            strokeWidth=".85"
          />
          <path
            d="M48 243C61 205 155 177 272 172"
            stroke="#E7FFF0"
            strokeOpacity=".55"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <circle cx="75" cy="216" r="3" fill="#CCFFE1" />
          <circle cx="522" cy="290" r="2.4" fill="#CCFFE1" fillOpacity=".65" />
        </g>
        <g transform="rotate(31 300 252)">
          <ellipse
            cx="300"
            cy="252"
            rx="242"
            ry="73"
            stroke={paint("orbit")}
            strokeWidth=".75"
          />
          <circle cx="492" cy="297" r="2" fill="#EDFFF4" fillOpacity=".85" />
        </g>
      </g>

      <g className="hero-aperture-outer">
        <g transform="rotate(-19 300 252)">
          <path
            d="M308 77a166 188 0 1 1 0 376a166 188 0 1 1 0-376Zm-1 37a132 151 0 1 0 0 302a132 151 0 1 0 0-302Z"
            fill={paint("depth")}
            fillRule="evenodd"
          />
          <path
            d="M300 64a166 188 0 1 1 0 376a166 188 0 1 1 0-376Zm0 37a132 151 0 1 0 0 302a132 151 0 1 0 0-302Z"
            fill={paint("body")}
            fillRule="evenodd"
          />
          <ellipse
            cx="300"
            cy="252"
            rx="165.5"
            ry="187.5"
            stroke={paint("outer-edge")}
            strokeWidth="1.6"
          />
          <ellipse
            cx="300"
            cy="252"
            rx="157"
            ry="178.5"
            stroke="#E9FFF1"
            strokeOpacity=".17"
            strokeWidth=".8"
          />
          <ellipse
            cx="300"
            cy="252"
            rx="135"
            ry="154"
            stroke={paint("inner-edge")}
            strokeWidth="5"
          />
          <ellipse
            cx="300"
            cy="252"
            rx="131"
            ry="150"
            stroke="#102F20"
            strokeOpacity=".64"
            strokeWidth="1.1"
          />
          <path
            d="M159 162C179 109 224 77 274 71"
            stroke="#FFFFFF"
            strokeOpacity=".92"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M162 163C181 116 220 87 262 81"
            stroke="#D8FFE9"
            strokeOpacity=".4"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M435 350C413 393 377 421 333 431"
            stroke="#E7FFF0"
            strokeOpacity=".72"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M433 371C411 411 366 441 322 448"
            stroke="#80B89A"
            strokeOpacity=".58"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </g>
      </g>

      <g className="hero-aperture-inner">
        <g transform="rotate(-19 300 252)">
          <ellipse
            cx="300"
            cy="252"
            rx="130"
            ry="149"
            fill="#10291F"
            fillOpacity=".88"
          />
          <ellipse cx="300" cy="252" rx="130" ry="149" fill={paint("lens")} />
          <path
            d="M180 198C197 144 251 109 301 105C343 103 374 122 397 154L207 342C173 303 164 250 180 198Z"
            fill={paint("reflection")}
          />
          <path
            d="M210 144C240 119 280 109 315 115"
            stroke="#E9FFF2"
            strokeOpacity=".41"
            strokeWidth=".8"
            strokeLinecap="round"
          />
          <path
            d="M398 328C380 359 357 379 328 387"
            stroke="#A8DDBA"
            strokeOpacity=".28"
            strokeWidth=".8"
            strokeLinecap="round"
          />
          <ellipse
            cx="300"
            cy="252"
            rx="120"
            ry="139"
            stroke="#D5FFE6"
            strokeOpacity=".055"
            strokeWidth="1"
          />
        </g>
        <g transform="translate(255.2 207.2) scale(2.8)">
          <path
            d="M6 5h7v9a4 4 0 0 0 4 4h9v7H15a9 9 0 0 1-9-9V5Z"
            fill={paint("mark")}
          />
          <path
            d="M26 5h-7v6a2 2 0 0 0 2 2h5V5ZM6 27h7v-5a2 2 0 0 0-2-2H6v7Z"
            fill={paint("mark")}
            fillOpacity=".5"
          />
        </g>
      </g>
    </svg>
  )
}
