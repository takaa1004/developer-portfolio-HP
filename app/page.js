import Image from "next/image";
import { FaInstagram, FaLine, FaPhone } from "react-icons/fa6";
import { checklist, company, isCampaignActive, price, risks, steps, telHref } from "./_updraft/data";
import { CheckIcon, Logo, SectionHeading } from "./_updraft/ui";

// キャンペーン終了日を過ぎたら表示を切り替えるため、1時間ごとに再生成する
export const revalidate = 3600;

const yen = (n) => n.toLocaleString("ja-JP");

const nav = [
  { href: "#risk", label: "配管の汚れ" },
  { href: "#price", label: "料金" },
  { href: "#flow", label: "ご依頼の流れ" },
  { href: "#company", label: "会社概要" },
];

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <a href="#top" className="flex items-center gap-2 text-navy">
          <Logo className="h-8 w-11 md:h-9 md:w-12" />
          <span className="text-xl font-black tracking-wide text-navy-dark md:text-2xl">
            Up draft
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold text-ink lg:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-navy">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={telHref(company.mobile)}
            className="hidden items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-dark md:flex"
          >
            <FaPhone className="h-4 w-4" />
            {company.mobile}
          </a>
          <a
            href="#contact"
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white hover:opacity-90 md:hidden"
          >
            お問い合わせ
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-dark text-white">
      <Image
        src="/updraft/work-2.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-110 object-cover opacity-25 blur-sm"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/85 to-navy-dark/40" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-brand-red px-3 py-1.5 text-sm font-bold md:text-base">
              追い焚き配管クリーニング
            </span>
            <span className="rounded-full border border-white/70 px-3 py-1 text-xs font-bold md:text-sm">
              マンションにお住まいのみなさまへ
            </span>
          </div>
          <h1 className="mt-6 text-[1.85rem] font-black leading-tight sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem]">
            <span className="whitespace-nowrap">家族が毎日入るお風呂。</span>
            <br />
            <span className="text-brand-yellow">配管の中</span>は、
            <br />
            <span className="whitespace-nowrap">こうなっています。</span>
          </h1>
          <p className="mt-6 font-bold text-white/90 md:text-lg">
            追い焚き配管を洗浄したときに、実際に出てきた汚れです。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={telHref(company.mobile)}
              className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-bold text-navy-dark hover:bg-paper"
            >
              <FaPhone className="h-4 w-4" />
              電話で相談する
            </a>
            <a
              href={company.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#06C755] px-6 py-3.5 font-bold text-white hover:opacity-90"
            >
              <FaLine className="h-5 w-5" />
              LINEで相談・見積り
            </a>
          </div>
          <p className="mt-3 text-sm text-white/75">お見積り・ご相談は無料です。</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {["/updraft/work-1.jpg", "/updraft/work-2.jpg"].map((src, i) => (
            <figure
              key={src}
              className={`relative aspect-square overflow-hidden rounded-lg border-4 border-white shadow-2xl ${i === 1 ? "mt-8" : ""}`}
            >
              <Image
                src={src}
                alt="追い焚き配管の洗浄中に浴槽へ出てきた汚れ"
                fill
                sizes="(min-width: 1024px) 240px, 45vw"
                className="object-cover"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function RiskCard({ group, tone }) {
  const styles =
    tone === "red"
      ? { head: "bg-brand-red", body: "bg-brand-red-soft", border: "border-brand-red", text: "text-brand-red" }
      : { head: "bg-brand-teal", body: "bg-brand-teal-soft", border: "border-brand-teal", text: "text-brand-teal" };
  return (
    <div className={`overflow-hidden rounded-xl border ${styles.border}`}>
      <h3 className={`${styles.head} px-5 py-4 text-lg font-black text-white md:text-xl`}>
        {group.title}
      </h3>
      <ol className={`${styles.body} space-y-5 px-5 py-6`}>
        {group.items.map((item, i) => (
          <li key={item.title} className="flex gap-3">
            <span
              className={`${styles.head} flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white`}
            >
              {i + 1}
            </span>
            <div>
              <p className={`text-lg font-black ${styles.text}`}>{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink md:text-base">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Risk() {
  return (
    <section id="risk" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading eyebrow="毎日のお湯は、この配管を通って浴槽に届きます">
        <span className="text-brand-red">小さいお子さま</span>や
        <br className="md:hidden" />
        <span className="text-brand-teal">ご高齢の方</span>がいる
        <br className="md:hidden" />
        ご家庭は特に注意
      </SectionHeading>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <RiskCard group={risks.kids} tone="red" />
        <RiskCard group={risks.seniors} tone="teal" />
      </div>
      <div className="mt-8 flex flex-col items-start gap-3 rounded-xl bg-paper p-5 md:flex-row md:items-center md:justify-center">
        <span className="shrink-0 rounded bg-navy-dark px-3 py-1 text-sm font-bold text-white">
          レジオネラ属菌とは？
        </span>
        <p className="font-bold leading-relaxed text-navy-dark">
          温かい水で増える菌。
          <span className="text-brand-red">湯気やしぶきを吸い込むと、肺炎の原因</span>
          になることがあります。
        </p>
      </div>
    </section>
  );
}

function Checklist() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading>こんなことはありませんか？</SectionHeading>
        <ul className="mt-10 space-y-3">
          {checklist.map((item) => (
            <li key={item.title} className="flex gap-4 rounded-xl border border-line bg-white p-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 border-navy text-brand-red">
                <CheckIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-bold text-navy-dark">{item.title}</p>
                {item.note && <p className="mt-1 text-sm text-muted">{item.note}</p>}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 rounded-lg bg-navy px-5 py-4 text-center font-bold text-white">
          ひとつでも当てはまったら、一度ご相談ください
        </p>
      </div>
    </section>
  );
}

function Price() {
  const campaignActive = isCampaignActive();
  return (
    <section id="price" className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading eyebrow="料金・作業時間">追い焚き配管クリーニング</SectionHeading>
      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-paper py-5 text-center">
          <p className="text-sm font-bold text-muted">作業時間</p>
          <p className="mt-1 text-2xl font-black text-navy-dark md:text-3xl">
            約2<span className="text-base">時間</span>
          </p>
        </div>
        <div className="rounded-xl bg-paper py-5 text-center">
          <p className="text-sm font-bold text-muted">目安</p>
          <p className="mt-1 text-2xl font-black text-navy-dark md:text-3xl">
            年1<span className="text-base">回</span>
          </p>
        </div>
      </div>

      <div className="relative mt-8 rounded-2xl bg-brand-red px-6 pb-8 pt-10 text-white md:px-10">
        {campaignActive && (
          <p className="absolute -top-4 left-1/2 w-max max-w-[92%] -translate-x-1/2 rounded-md bg-brand-yellow px-4 py-1.5 text-center text-sm font-black text-navy-dark md:text-base">
            チラシ限定｜{price.campaignEndLabel}までのお申し込み
          </p>
        )}
        <p className="text-lg font-bold">追い焚き配管クリーニング</p>
        {campaignActive && (
          <p className="mt-1 text-sm text-white/80 line-through">
            通常価格 {yen(price.regular)}円（税込）
          </p>
        )}
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-6xl font-black tracking-tight md:text-7xl">
            {yen(campaignActive ? price.campaign : price.regular)}
          </span>
          <span className="text-lg font-bold">円（税込）</span>
        </p>
        <p className="mt-2 text-sm font-bold">出張費込み（大阪市内）</p>
        {campaignActive && (
          <p className="mt-6 rounded-lg border-2 border-dashed border-white/80 bg-white px-4 py-3 text-sm font-bold text-ink">
            この料金はチラシをお持ちの方が対象です。お申し込みの際に、チラシに記載の
            <span className="text-brand-red">チラシ番号</span>をお伝えください。
          </p>
        )}
      </div>
      <p className="mt-8 text-center text-lg font-black text-navy-dark md:text-2xl">
        ご予約が混み合うことが予想されます。
        <br className="md:hidden" />
        <span className="text-brand-red">お早めにご連絡ください</span>
      </p>
    </section>
  );
}

function Flow() {
  return (
    <section id="flow" className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading eyebrow="ご依頼の流れ">ご相談から完了まで</SectionHeading>
        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-xl bg-white p-6">
              <p className="text-sm font-black text-brand-red">STEP {i + 1}</p>
              <p className="mt-1 text-xl font-black text-navy-dark">{step.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Contact() {
  const channels = [
    {
      title: "LINEで相談・見積り",
      note: "メッセージだけでOK。写真があるとスムーズです",
      href: company.lineUrl,
      qr: "/updraft/qr-line.svg",
      icon: FaLine,
      color: "bg-[#06C755]",
      text: "text-[#06C755]",
      cta: "友だち追加",
    },
    {
      title: "Instagram",
      note: `${company.instagramId}　DMで相談OK`,
      href: company.instagramUrl,
      qr: "/updraft/qr-instagram.svg",
      icon: FaInstagram,
      color: "bg-[#C13584]",
      text: "text-[#C13584]",
      cta: "Instagramを見る",
    },
  ];
  return (
    <section id="contact" className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <h2 className="text-2xl font-black leading-snug md:text-4xl">
          「まずは相談だけ」でも大丈夫です。
        </h2>
        <p className="mt-3 text-white/85">
          お電話・LINE・Instagramからどうぞ。お見積り・ご相談は無料です。
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <a
            href={telHref(company.mobile)}
            className="flex flex-col justify-center rounded-2xl bg-white/10 p-6 md:col-span-2 ring-1 ring-white/20 hover:bg-white/15"
          >
            <p className="text-sm font-bold text-white/80">お電話でのご相談</p>
            <p className="mt-2 flex items-center gap-3 text-3xl font-black tracking-wide md:text-4xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-navy">
                <FaPhone className="h-5 w-5" />
              </span>
              {company.mobile}
            </p>
            <p className="mt-3 text-sm text-white/75">タップで発信できます</p>
          </a>
          {channels.map((c) => (
            <div key={c.title} className="flex gap-4 rounded-2xl bg-white p-5 text-ink">
              <Image
                src={c.qr}
                alt={`${c.title}のQRコード`}
                unoptimized
                width={112}
                height={112}
                className="hidden h-28 w-28 shrink-0 sm:block"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <p className={`flex items-center gap-2 font-black ${c.text}`}>
                    <c.icon className="h-5 w-5" />
                    {c.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{c.note}</p>
                </div>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 inline-block rounded-full ${c.color} px-4 py-2 text-center text-sm font-bold text-white hover:opacity-90`}
                >
                  {c.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/80">
          メールでのお問い合わせ：
          <a href={`mailto:${company.email}`} className="font-bold underline underline-offset-4">
            {company.email}
          </a>
        </p>
      </div>
    </section>
  );
}

function Company() {
  const rows = [
    ["会社名", company.name],
    ["代表者", `${company.representativeTitle}　${company.representative}`],
    ...company.offices.map((o) => [o.label, `${o.zip}　${o.address}`]),
    ["TEL", company.tel],
    ["FAX", company.fax],
    ["携帯", company.mobile],
    ["Mail", company.email],
    ["事業内容", "追い焚き配管クリーニング"],
  ];
  return (
    <section id="company" className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading eyebrow="会社概要">{company.name}</SectionHeading>
      <dl className="mt-10 divide-y divide-line border-y border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 py-4 md:grid-cols-[10rem_1fr] md:gap-6">
            <dt className="text-sm font-bold text-muted">{k}</dt>
            <dd className="break-words text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Footer() {
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

function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white p-2 md:hidden">
      <a
        href={telHref(company.mobile)}
        className="flex items-center justify-center gap-2 rounded-lg bg-navy py-3 font-bold text-white"
      >
        <FaPhone className="h-4 w-4" />
        電話する
      </a>
      <a
        href={company.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg bg-[#06C755] py-3 font-bold text-white"
      >
        <FaLine className="h-5 w-5" />
        LINEで相談
      </a>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Risk />
        <Checklist />
        <Price />
        <Flow />
        <Contact />
        <Company />
      </main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
