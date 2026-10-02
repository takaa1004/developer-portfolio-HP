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

// 差し込み用のイラスト（線画・ブランドカラー）
const INK = "#0b1f44";
const WATER = "#cfe3f5";

function Tub({ children }) {
  return (
    <>
      <path d="M22 70 H198 V100 Q198 124 174 124 H46 Q22 124 22 100 Z" fill={WATER} />
      <path d="M14 58 H206" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M22 58 V100 Q22 128 50 128 H170 Q198 128 198 100 V58" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M48 128 L42 140 M172 128 L178 140" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {children}
    </>
  );
}

export function KidsBathIllust({ className = "" }) {
  return (
    <svg viewBox="0 0 220 150" role="img" aria-label="湯船に浮かぶアヒルのおもちゃのイラスト" className={className}>
      <Tub>
        {/* アヒル */}
        <path d="M70 70 q0 -14 14 -14 q12 0 12 11 q10 -2 14 4 q4 10 -8 13 h-26 q-8 0 -6 -14 z" fill="#ffd84d" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M96 62 l9 2 l-9 3" fill="#e0452b" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="88" cy="62" r="2" fill={INK} />
        {/* 船 */}
        <path d="M128 76 h34 l-6 8 h-22 z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M145 76 V56 l12 12 h-12" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        {/* 泡 */}
        <circle cx="52" cy="48" r="6" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <circle cx="40" cy="36" r="4" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <circle cx="176" cy="44" r="5" fill="#fff" stroke={INK} strokeWidth="2.5" />
      </Tub>
    </svg>
  );
}

export function SeniorBathIllust({ className = "" }) {
  return (
    <svg viewBox="0 0 220 150" role="img" aria-label="湯気の立つ湯船と湯おけ、たたんだタオルのイラスト" className={className}>
      <Tub>
        {/* 湯気 */}
        <path d="M70 46 q-8 -8 0 -16 q8 -8 0 -16" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M100 46 q-8 -8 0 -16 q8 -8 0 -16" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M130 46 q-8 -8 0 -16 q8 -8 0 -16" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        {/* タオル */}
        <path d="M150 50 h40 v8 h-40 z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M156 50 v8 M184 50 v8" stroke="#1b6e62" strokeWidth="2" />
        {/* 湯おけ */}
        <path d="M30 32 h34 l-4 22 h-26 z" fill="#f3e3c3" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M33 40 h28" stroke={INK} strokeWidth="2" />
        {/* 水面 */}
        <path d="M44 84 q10 -5 20 0 t20 0 M120 96 q10 -5 20 0 t20 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </Tub>
    </svg>
  );
}

export function LineChatIllust({ className = "" }) {
  return (
    <svg viewBox="0 0 160 200" role="img" aria-label="スマートフォンでお風呂の写真を送って相談しているイラスト" className={className}>
      <rect x="30" y="8" width="100" height="184" rx="14" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M66 20 h28" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {/* 送った写真 */}
      <rect x="62" y="36" width="56" height="42" rx="4" fill={WATER} stroke={INK} strokeWidth="2.5" />
      <path d="M68 66 h44 v4 q0 4 -4 4 h-36 q-4 0 -4 -4 z" fill="#fff" stroke={INK} strokeWidth="2" />
      <circle cx="104" cy="48" r="5" fill="#ffd84d" stroke={INK} strokeWidth="2" />
      {/* 吹き出し */}
      <rect x="62" y="86" width="56" height="20" rx="4" fill="#06c755" />
      <path d="M68 96 h36" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <rect x="42" y="116" width="62" height="30" rx="4" fill="#eef1f6" stroke={INK} strokeWidth="2" />
      <path d="M48 126 h44 M48 136 h30" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="62" y="156" width="56" height="20" rx="4" fill="#06c755" />
      <path d="M68 166 h26" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
