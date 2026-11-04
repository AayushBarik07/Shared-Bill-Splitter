export function FlatmatesIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 680 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Illustration of flatmates happily sharing expenses over pizza"
    >
      <title>Flatmates sharing expenses over pizza</title>
      <defs>
        <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2F6ED" />
          <stop offset="100%" stopColor="#C8EEDC" />
        </linearGradient>
      </defs>

      {/* Background Soft Rolling Hills across full scene */}
      <path
        d="M0 380C60 320 160 300 260 340C360 380 460 320 560 310C620 305 650 315 680 325V480H0V380Z"
        fill="url(#hillGrad1)"
        opacity="0.65"
      />
      <path
        d="M240 380C300 330 380 315 460 345C520 368 620 340 680 320V480H240V380Z"
        fill="#079B6B"
        opacity="0.85"
      />

      {/* Distant Apartment Buildings on the right hill */}
      <g opacity="0.45" transform="translate(560, 180)">
        {/* Building 1 */}
        <rect x="0" y="30" width="28" height="70" rx="3" fill="#087F5B" />
        <rect x="5" y="36" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="17" y="36" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="5" y="48" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="17" y="48" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="5" y="60" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="17" y="60" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="5" y="72" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="17" y="72" width="6" height="6" rx="1" fill="#DDF8EC" />

        {/* Building 2 */}
        <rect x="34" y="10" width="34" height="90" rx="3" fill="#079B6B" />
        <rect x="40" y="18" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="53" y="18" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="40" y="32" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="53" y="32" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="40" y="46" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="53" y="46" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="40" y="60" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="53" y="60" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="40" y="74" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="53" y="74" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* Floating Soft Clouds */}
      <g fill="#D7F3E5" opacity="0.7">
        <path d="M580 110C580 102 588 96 596 96C600 92 606 90 612 90C621 90 628 96 630 104C635 105 640 109 640 115C640 121 635 126 629 126H590C584 126 580 121 580 115C580 113 580 111 580 110Z" />
      </g>

      {/* Mint Radiate Marks above the Flatmates (aligned above girl's head) */}
      <g stroke="#079B6B" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <line x1="200" y1="110" x2="195" y2="124" />
        <line x1="212" y1="102" x2="212" y2="118" />
        <line x1="224" y1="110" x2="229" y2="124" />
      </g>

      {/* ======================================================== */}
      {/* FLATMATES GROUP (Shifted left to leave room for the card) */}
      {/* ======================================================== */}

      {/* PERSON 3: Guy on the right */}
      <g id="person-right">
        <path
          d="M245 320C245 270 280 250 310 250C340 250 375 270 375 320V370H245V320Z"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M295 250L310 275L325 250"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M300 240V255H320V240" fill="#FDE7DA" stroke="#101D2B" strokeWidth="2.5" />
        <ellipse
          cx="310"
          cy="205"
          rx="26"
          ry="32"
          fill="#FDE7DA"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M285 200C283 175 297 165 313 165C330 165 341 178 339 200C339 190 333 180 321 180C305 180 300 190 285 200Z"
          fill="#1E293B"
        />
        <path
          d="M285 200C287 170 300 160 317 160C333 160 343 174 339 205C333 186 315 178 303 182C293 186 287 195 285 200Z"
          fill="#101D2B"
          stroke="#101D2B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M297 205C299 203 303 203 305 205"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M315 205C317 203 321 203 323 205"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="301" cy="208" r="2.2" fill="#101D2B" />
        <circle cx="319" cy="208" r="2.2" fill="#101D2B" />
        <path d="M310 214V218" stroke="#101D2B" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M301 224C305 230 315 230 319 224"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* PERSON 2: Girl in the Center */}
      <g id="person-center">
        <path
          d="M170 210C170 160 245 160 245 210C255 260 250 300 240 320C230 315 225 290 225 290L190 290C190 290 185 315 175 320C165 300 160 260 170 210Z"
          fill="#101D2B"
          stroke="#101D2B"
          strokeWidth="2"
        />
        <path
          d="M175 310C180 270 235 270 240 310L250 370H165L175 310Z"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path d="M201 250V266H215V250" fill="#FCEADE" stroke="#101D2B" strokeWidth="2" />
        <ellipse
          cx="208"
          cy="216"
          rx="25"
          ry="30"
          fill="#FCEADE"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M185 206C189 180 205 172 220 174C235 176 239 190 237 210C231 186 217 184 209 190C201 196 193 214 185 206Z"
          fill="#101D2B"
        />
        <path
          d="M196 210C199 205 203 205 206 210"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M214 210C217 205 221 205 224 210"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M198 226C198 238 220 238 220 226Z"
          fill="#D94E4E"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M200 228C205 231 213 231 218 228"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M177 330C185 340 195 345 203 340"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="203"
          y="324"
          width="22"
          height="24"
          rx="4"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M225 330C229 330 231 334 231 338C231 342 229 346 225 346"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* PERSON 1: Guy on Left (Spectacles, Green Shirt, Phone) */}
      <g id="person-left">
        <path
          d="M105 310C105 260 160 250 180 255L190 370H95L105 310Z"
          fill="#079B6B"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M110 320C125 335 145 340 160 330"
          fill="none"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="150"
          y="288"
          width="24"
          height="42"
          rx="5"
          fill="#1E293B"
          stroke="#101D2B"
          strokeWidth="2"
        />
        <rect x="153" y="293" width="18" height="30" rx="2" fill="#DDF8EC" />
        <line
          x1="157"
          y1="300"
          x2="167"
          y2="300"
          stroke="#079B6B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="157"
          y1="306"
          x2="164"
          y2="306"
          stroke="#079B6B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M145 310C150 308 153 312 153 316"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M173 310C170 312 170 316 173 318"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M141 244V260H155V244" fill="#FCEADE" stroke="#101D2B" strokeWidth="2" />
        <ellipse
          cx="147"
          cy="210"
          rx="25"
          ry="31"
          fill="#FCEADE"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M125 205C120 178 137 160 157 162C175 164 181 182 177 205C170 180 155 176 143 184C133 190 129 200 125 205Z"
          fill="#101D2B"
          stroke="#101D2B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="138" cy="208" r="9" fill="none" stroke="#101D2B" strokeWidth="2.5" />
        <circle cx="158" cy="208" r="9" fill="none" stroke="#101D2B" strokeWidth="2.5" />
        <line x1="147" y1="208" x2="149" y2="208" stroke="#101D2B" strokeWidth="2.5" />
        <circle cx="138" cy="208" r="2.5" fill="#101D2B" />
        <circle cx="158" cy="208" r="2.5" fill="#101D2B" />
        <path d="M147 214V218" stroke="#101D2B" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M141 225C145 230 153 230 157 225"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* TABLE WITH PIZZA & COFFEE MUGS */}
      <g id="table-scene">
        <line
          x1="50"
          y1="365"
          x2="350"
          y2="365"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="115"
          y="342"
          width="22"
          height="23"
          rx="4"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M115 348C109 348 107 352 107 356C107 360 109 363 115 363"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="247"
          y="342"
          width="22"
          height="23"
          rx="4"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M269 348C275 348 277 352 277 356C277 360 275 363 269 363"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <ellipse
          cx="193"
          cy="365"
          rx="36"
          ry="14"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M163 365C170 356 215 356 223 365C215 374 170 374 163 365Z"
          fill="#FDE68A"
          stroke="#101D2B"
          strokeWidth="2"
        />
        <line x1="193" y1="358" x2="193" y2="372" stroke="#101D2B" strokeWidth="1.5" />
        <line x1="171" y1="362" x2="215" y2="368" stroke="#101D2B" strokeWidth="1.5" />
        <circle cx="181" cy="364" r="2.5" fill="#EF4444" />
        <circle cx="203" cy="363" r="2.5" fill="#EF4444" />
        <circle cx="192" cy="368" r="2.2" fill="#10B981" />
      </g>
    </svg>
  )
}
