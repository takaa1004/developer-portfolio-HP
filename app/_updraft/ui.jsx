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
