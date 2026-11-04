export function FlatmatesIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 620 480"
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

      {/* Background Soft Rolling Hills */}
      <path
        d="M20 380C80 320 180 300 280 340C380 380 460 320 540 310C580 305 605 315 620 325V480H20V380Z"
        fill="url(#hillGrad1)"
        opacity="0.65"
      />
      <path
        d="M280 380C340 330 420 315 500 345C560 368 600 340 620 325V480H280V380Z"
        fill="#079B6B"
        opacity="0.9"
      />

      {/* Distant Apartment Buildings on the right hill */}
      <g opacity="0.45" transform="translate(540, 200)">
        {/* Building 1 */}
        <rect x="0" y="30" width="28" height="60" rx="3" fill="#087F5B" />
        <rect x="5" y="36" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="17" y="36" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="5" y="48" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="17" y="48" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="5" y="60" width="6" height="6" rx="1" fill="#DDF8EC" />
        <rect x="17" y="60" width="6" height="6" rx="1" fill="#DDF8EC" />

        {/* Building 2 */}
        <rect x="34" y="10" width="32" height="80" rx="3" fill="#079B6B" />
        <rect x="40" y="18" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="53" y="18" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="40" y="32" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="53" y="32" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="40" y="46" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="53" y="46" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="40" y="60" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
        <rect x="53" y="60" width="7" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* Floating Soft Clouds */}
      <g fill="#D7F3E5" opacity="0.7">
        <path d="M560 120C560 112 568 106 576 106C580 102 586 100 592 100C601 100 608 106 610 114C615 115 620 119 620 125C620 131 615 136 609 136H570C564 136 560 131 560 125C560 123 560 121 560 120Z" />
      </g>

      {/* Mint Radiate Marks above the Flatmates (from reference) */}
      <g stroke="#079B6B" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <line x1="340" y1="110" x2="335" y2="124" />
        <line x1="352" y1="102" x2="352" y2="118" />
        <line x1="364" y1="110" x2="369" y2="124" />
      </g>

      {/* PERSON 3: Guy on the right */}
      <g id="person-right">
        <path
          d="M380 320C380 270 415 250 445 250C475 250 510 270 510 320V370H380V320Z"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M430 250L445 275L460 250"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M435 240V255H455V240" fill="#FDE7DA" stroke="#101D2B" strokeWidth="2.5" />
        <ellipse
          cx="445"
          cy="205"
          rx="26"
          ry="32"
          fill="#FDE7DA"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M420 200C418 175 432 165 448 165C465 165 476 178 474 200C474 190 468 180 456 180C440 180 435 190 420 200Z"
          fill="#1E293B"
        />
        <path
          d="M420 200C422 170 435 160 452 160C468 160 478 174 474 205C468 186 450 178 438 182C428 186 422 195 420 200Z"
          fill="#101D2B"
          stroke="#101D2B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M432 205C434 203 438 203 440 205"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M450 205C452 203 456 203 458 205"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="436" cy="208" r="2.2" fill="#101D2B" />
        <circle cx="454" cy="208" r="2.2" fill="#101D2B" />
        <path d="M445 214V218" stroke="#101D2B" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M436 224C440 230 450 230 454 224"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* PERSON 2: Girl in the Center */}
      <g id="person-center">
        <path
          d="M305 210C305 160 380 160 380 210C390 260 385 300 375 320C365 315 360 290 360 290L325 290C325 290 320 315 310 320C300 300 295 260 305 210Z"
          fill="#101D2B"
          stroke="#101D2B"
          strokeWidth="2"
        />
        <path
          d="M310 310C315 270 370 270 375 310L385 370H300L310 310Z"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path d="M336 250V266H350V250" fill="#FCEADE" stroke="#101D2B" strokeWidth="2" />
        <ellipse
          cx="343"
          cy="216"
          rx="25"
          ry="30"
          fill="#FCEADE"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M320 206C324 180 340 172 355 174C370 176 374 190 372 210C366 186 352 184 344 190C336 196 328 214 320 206Z"
          fill="#101D2B"
        />
        <path
          d="M331 210C334 205 338 205 341 210"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M349 210C352 205 356 205 359 210"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M333 226C333 238 355 238 355 226Z"
          fill="#D94E4E"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M335 228C340 231 348 231 353 228"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M312 330C320 340 330 345 338 340"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="338"
          y="324"
          width="22"
          height="24"
          rx="4"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M360 330C364 330 366 334 366 338C366 342 364 346 360 346"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* PERSON 1: Guy on Left (Spectacles, Green Shirt, Phone) */}
      <g id="person-left">
        <path
          d="M240 310C240 260 295 250 315 255L325 370H230L240 310Z"
          fill="#079B6B"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M245 320C260 335 280 340 295 330"
          fill="none"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="285"
          y="288"
          width="24"
          height="42"
          rx="5"
          fill="#1E293B"
          stroke="#101D2B"
          strokeWidth="2"
        />
        <rect x="288" y="293" width="18" height="30" rx="2" fill="#DDF8EC" />
        <line
          x1="292"
          y1="300"
          x2="302"
          y2="300"
          stroke="#079B6B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="292"
          y1="306"
          x2="299"
          y2="306"
          stroke="#079B6B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M280 310C285 308 288 312 288 316"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M308 310C305 312 305 316 308 318"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M276 244V260H290V244" fill="#FCEADE" stroke="#101D2B" strokeWidth="2" />
        <ellipse
          cx="282"
          cy="210"
          rx="25"
          ry="31"
          fill="#FCEADE"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M260 205C255 178 272 160 292 162C310 164 316 182 312 205C305 180 290 176 278 184C268 190 264 200 260 205Z"
          fill="#101D2B"
          stroke="#101D2B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="273" cy="208" r="9" fill="none" stroke="#101D2B" strokeWidth="2.5" />
        <circle cx="293" cy="208" r="9" fill="none" stroke="#101D2B" strokeWidth="2.5" />
        <line x1="282" y1="208" x2="284" y2="208" stroke="#101D2B" strokeWidth="2.5" />
        <circle cx="273" cy="208" r="2.5" fill="#101D2B" />
        <circle cx="293" cy="208" r="2.5" fill="#101D2B" />
        <path d="M282 214V218" stroke="#101D2B" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M276 225C280 230 288 230 292 225"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* TABLE WITH PIZZA & COFFEE MUGS */}
      <g id="table-scene">
        <line
          x1="180"
          y1="365"
          x2="480"
          y2="365"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="250"
          y="342"
          width="22"
          height="23"
          rx="4"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M250 348C244 348 242 352 242 356C242 360 244 363 250 363"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x="382"
          y="342"
          width="22"
          height="23"
          rx="4"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M404 348C410 348 412 352 412 356C412 360 410 363 404 363"
          stroke="#101D2B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <ellipse
          cx="328"
          cy="365"
          rx="36"
          ry="14"
          fill="#FFFFFF"
          stroke="#101D2B"
          strokeWidth="2.5"
        />
        <path
          d="M298 365C305 356 350 356 358 365C350 374 305 374 298 365Z"
          fill="#FDE68A"
          stroke="#101D2B"
          strokeWidth="2"
        />
        <line x1="328" y1="358" x2="328" y2="372" stroke="#101D2B" strokeWidth="1.5" />
        <line x1="306" y1="362" x2="350" y2="368" stroke="#101D2B" strokeWidth="1.5" />
        <circle cx="316" cy="364" r="2.5" fill="#EF4444" />
        <circle cx="338" cy="363" r="2.5" fill="#EF4444" />
        <circle cx="327" cy="368" r="2.2" fill="#10B981" />
      </g>
    </svg>
  )
}
