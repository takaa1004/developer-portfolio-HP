import Link from "next/link";
import { FaLine, FaPhone } from "react-icons/fa6";
import { company, telHref } from "./data";
import { Logo } from "./ui";

// ページをまたいで使う部品（ヘッダー・フッター・ボタンなど）
export const nav = [
  { href: "/#about", label: "配管の汚れ" },
  { href: "/#process", label: "作業工程" },
  { href: "/works", label: "施工例" },
  { href: "/#price", label: "料金" },
  { href: "/#faq", label: "よくある質問" },
  { href: "/#company", label: "会社概要" },
];

export function PhoneButton({ className = "", label }) {
  return (
    <a
      href={telHref(company.mobile)}
      className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-navy font-bold text-white hover:bg-navy-dark ${className}`}
    >
      <FaPhone className="h-4 w-4" />
      {label ?? company.mobile}
    </a>
  );
}

export function LineButton({ className = "", label = "LINEで相談する" }) {
  return (
    <a
      href={company.lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-line-green font-bold text-white hover:opacity-90 ${className}`}
    >
      <FaLine className="h-5 w-5" />
      {label}
    </a>
  );
}

// 補足情報は閉じておき、押したときだけ開く
export function More({ label = "詳しく見る", children, className = "" }) {
  return (
    <details className={`group ${className}`}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 border-b-2 border-current pb-0.5 text-sm font-bold [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{label}</span>
        <span className="hidden group-open:inline">閉じる</span>
        <span aria-hidden="true" className="text-base leading-none transition-transform group-open:rotate-45">
          ＋
        </span>
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}

export function CtaStrip({ lead }) {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="text-lg font-black text-navy-dark">{lead}</p>
          <p className="text-sm text-muted">お見積り・ご相談は無料です（受付 {company.hours}）</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:w-[26rem]">
          <LineButton className="py-3.5" label="LINEで無料見積り" />
          <PhoneButton className="py-3.5" label="電話する" />
        </div>
      </div>
    </section>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-navy">
          <Logo className="h-8 w-11 md:h-9 md:w-12" />
          <span className="whitespace-nowrap leading-none">
            <span className="block text-xl font-black tracking-wide text-navy-dark md:text-2xl">
              Up draft
            </span>
            <span className="mt-1 block text-[10px] font-bold text-muted md:text-xs">
              追い焚き配管クリーニング
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 whitespace-nowrap text-sm font-bold text-ink xl:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-navy">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LineButton className="hidden px-5 py-2.5 text-sm md:flex" label="LINEで相談" />
          <PhoneButton className="hidden px-5 py-2.5 text-sm md:flex" />
          <Link href="/#contact" className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white md:hidden">
            お問い合わせ
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-dark pb-24 pt-10 text-white/80 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-2 text-white">
          <Logo className="h-7 w-10" />
          <span className="text-lg font-black">{company.name}</span>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} 有限会社 Up draft</p>
      </div>
    </footer>
  );
}

export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white p-2 md:hidden">
      <PhoneButton className="py-3" label="電話する" />
      <LineButton className="py-3" label="LINEで相談" />
    </div>
  );
}
