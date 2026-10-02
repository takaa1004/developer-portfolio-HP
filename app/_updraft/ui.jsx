export function Logo({ className = "" }) {
  return (
    <svg viewBox="0 0 64 44" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="5">
        <ellipse cx="25" cy="22" rx="13" ry="18" transform="rotate(28 25 22)" />
        <ellipse cx="39" cy="22" rx="13" ry="18" transform="rotate(28 39 22)" />
      </g>
    </svg>
  );
}

export function CheckIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12.5l4.5 4.5L19 7"
      />
    </svg>
  );
}

export function SectionHeading({ eyebrow, children, className = "" }) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <p className="text-sm font-bold tracking-wider text-muted md:text-base">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl font-black leading-snug text-navy-dark md:text-4xl">
        {children}
      </h2>
    </div>
  );
}

export function PipeDiagram({ className = "" }) {
  const pipe = "M246 142 H318 V78";
  const pipeBack = "M246 160 H334 V78";
  return (
    <svg
      viewBox="0 0 400 230"
      role="img"
      aria-label="浴槽の吸い込み口と給湯器をつなぐ追い焚き配管の図"
      className={className}
    >
      {/* 壁 */}
      <rect x="268" y="96" width="14" height="118" fill="#eef1f6" />
      <text x="275" y="226" textAnchor="middle" fontSize="11" fill="#5b6577">壁の中</text>

      {/* 給湯器 */}
      <rect x="296" y="18" width="78" height="60" rx="8" fill="#0f3a8a" />
      <text x="335" y="53" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">給湯器</text>

      {/* 配管 */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={pipe} stroke="#ffd84d" strokeWidth="9" />
        <path d={pipeBack} stroke="#ffd84d" strokeWidth="9" />
        <path d={pipe} stroke="#e0452b" strokeWidth="2.5" strokeDasharray="6 8" className="pipe-flow" />
        <path d={pipeBack} stroke="#e0452b" strokeWidth="2.5" strokeDasharray="6 8" className="pipe-flow-reverse" />
      </g>

      {/* 浴槽 */}
      <path d="M34 112 H246 V168 Q246 196 218 196 H62 Q34 196 34 168 Z" fill="#cfe3f5" />
      <path
        d="M24 92 H256 V168 Q256 206 218 206 H62 Q24 206 24 168 Z"
        fill="none"
        stroke="#0b1f44"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M60 128 q12 -6 24 0 t24 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M140 150 q12 -6 24 0 t24 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="238" cy="151" r="9" fill="#fff" stroke="#0b1f44" strokeWidth="3" />
      <text x="140" y="80" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0b1f44">浴槽</text>
      <text x="200" y="186" textAnchor="middle" fontSize="11" fill="#0f3a8a">吸い込み口</text>

      {/* ラベル */}
      <g>
        <rect x="282" y="168" width="108" height="28" rx="4" fill="#e0452b" />
        <text x="336" y="187" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">追い焚き配管</text>
      </g>
    </svg>
  );
}
