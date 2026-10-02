import Image from "next/image";
import { FaInstagram, FaLine, FaPhone } from "react-icons/fa6";
import {
  causes,
  checklist,
  company,
  faqs,
  families,
  isCampaignActive,
  price,
  process,
  reasons,
  steps,
  telHref,
} from "./_updraft/data";
import { CheckIcon, Logo, PipeDiagram, SectionHeading } from "./_updraft/ui";

// キャンペーン終了日を過ぎたら表示を切り替えるため、1時間ごとに再生成する
export const revalidate = 3600;

const yen = (n) => n.toLocaleString("ja-JP");

const nav = [
  { href: "#about", label: "配管の汚れ" },
  { href: "#reasons", label: "選ばれる理由" },
  { href: "#process", label: "作業内容" },
  { href: "#cases", label: "作業の様子" },
  { href: "#price", label: "料金" },
  { href: "#flow", label: "ご依頼の流れ" },
  { href: "#faq", label: "よくある質問" },
  { href: "#company", label: "会社概要" },
];

function PhoneButton({ className = "", label }) {
  return (
    <a
      href={telHref(company.mobile)}
      className={`flex items-center justify-center gap-2 rounded-full bg-navy font-bold text-white hover:bg-navy-dark ${className}`}
    >
      <FaPhone className="h-4 w-4" />
      {label ?? company.mobile}
    </a>
  );
}

function LineButton({ className = "", label = "LINEで相談する" }) {
  return (
    <a
      href={company.lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 rounded-full bg-line-green font-bold text-white hover:opacity-90 ${className}`}
    >
      <FaLine className="h-5 w-5" />
      {label}
    </a>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <a href="#top" className="flex items-center gap-2 text-navy">
          <Logo className="h-8 w-11 md:h-9 md:w-12" />
          <span className="leading-none">
            <span className="block text-xl font-black tracking-wide text-navy-dark md:text-2xl">
              Up draft
            </span>
            <span className="mt-1 block text-[10px] font-bold text-muted md:text-xs">
              追い焚き配管クリーニング
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-bold text-ink xl:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-navy">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LineButton className="hidden px-5 py-2.5 text-sm md:flex" label="LINEで相談" />
          <PhoneButton className="hidden px-5 py-2.5 text-sm md:flex" />
          <a
            href="#contact"
            className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white md:hidden"
          >
            お問い合わせ
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ campaignActive }) {
  const points = [
    ["作業時間", "約2時間"],
    ["お手入れの目安", "年1回"],
    ["お見積り・ご相談", "無料"],
  ];
  return (
    <section id="top" className="relative overflow-hidden bg-sky">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/60" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-sky-deep/50" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <p className="inline-block rounded-full bg-white px-4 py-1.5 text-sm font-bold text-navy shadow-sm">
            マンションにお住まいのご家庭へ
          </p>
          <h1 className="mt-5 text-[1.9rem] font-black leading-[1.35] text-navy-dark sm:text-5xl sm:leading-[1.3]">
            <span className="whitespace-nowrap">家族が毎日入るお風呂を、</span>
            <br />
            <span className="whitespace-nowrap">
              <span className="bg-[linear-gradient(transparent_62%,#ffd84d_62%)]">見えない配管</span>
              まで
            </span>
            <span className="whitespace-nowrap">きれいに。</span>
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-ink">
            浴槽をどれだけ洗っても、お湯の通り道である「追い焚き配管」の中は普段のお掃除では届きません。
            Up draftが、配管の中にたまった汚れを洗い流します。
          </p>
          <ul className="mt-7 grid max-w-lg grid-cols-3 gap-2">
            {points.map(([label, value]) => (
              <li key={label} className="rounded-xl bg-white px-2 py-3 text-center shadow-sm">
                <p className="text-[11px] font-bold leading-tight text-muted md:text-xs">{label}</p>
                <p className="mt-1 text-xl font-black leading-none text-navy md:text-2xl">{value}</p>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <LineButton className="px-7 py-4 text-lg" label="LINEで無料相談" />
            <PhoneButton className="px-7 py-4 text-lg" label="電話で相談する" />
          </div>
          {campaignActive && (
            <a
              href="#price"
              className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm hover:text-navy"
            >
              <span className="rounded bg-brand-red px-2 py-0.5 text-xs text-white">チラシをお持ちの方</span>
              {price.campaignEndLabel}までのお申し込みで {yen(price.campaign)}円 →
            </a>
          )}
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-xl shadow-navy/5 md:p-7">
          <p className="text-sm font-bold text-muted">追い焚き配管ってどこのこと？</p>
          <PipeDiagram className="mt-3 w-full" />
          <p className="mt-3 text-sm leading-relaxed text-ink">
            浴槽の吸い込み口から給湯器までをつなぐ配管です。お湯はりや保温、追い焚きのたびに、お湯がこの中を行き来しています。
          </p>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading eyebrow="配管の中のこと">
        見えないところに、
        <br className="md:hidden" />
        汚れはたまっていきます
      </SectionHeading>
      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="grid grid-cols-2 gap-3">
            {["/updraft/case-scoop-2.jpg", "/updraft/case-green.jpg"].map((src) => (
              <figure key={src} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={src}
                  alt="追い焚き配管の洗浄中に浴槽へ出てきた汚れ"
                  fill
                  sizes="(min-width: 1024px) 280px, 45vw"
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">
            実際に追い焚き配管を洗浄したときに、浴槽へ出てきた汚れです。
          </p>
        </div>
        <div>
          <p className="text-lg font-bold leading-relaxed text-navy-dark">
            見た目はきれいなお風呂でも、配管の中から出てくるのはこうした汚れです。
            毎日入るお湯は、この配管を通って浴槽に届いています。
          </p>
          <ol className="mt-8 space-y-5">
            {causes.map((c, i) => (
              <li key={c.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky font-black text-navy">
                  {i + 1}
                </span>
                <div>
                  <p className="font-black text-navy-dark">{c.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-2xl bg-cream p-5">
            <p className="font-black text-navy-dark">レジオネラ属菌とは？</p>
            <p className="mt-1 text-[15px] leading-relaxed">
              温かい水で増える菌です。湯気やしぶきを吸い込むと、
              <strong className="text-brand-red">肺炎の原因</strong>
              になることがあります。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Checklist() {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-bold text-white/70">セルフチェック</p>
          <h2 className="mt-2 text-2xl font-black leading-snug md:text-4xl">
            こんなことは
            <br className="hidden lg:block" />
            ありませんか？
          </h2>
          <p className="mt-4 text-white/85">
            ひとつでも当てはまったら、配管のお手入れどきかもしれません。お気軽にご相談ください。
          </p>
        </div>
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li key={item.title} className="flex gap-4 rounded-2xl bg-white p-5 text-ink">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-red text-white">
                <CheckIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-navy-dark">{item.title}</p>
                {item.note && <p className="mt-1 text-sm text-muted">{item.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Families() {
  const tones = {
    coral: { text: "text-brand-red", bg: "bg-brand-red-soft" },
    teal: { text: "text-brand-teal", bg: "bg-brand-teal-soft" },
  };
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading eyebrow="こんなご家庭に">
        <span className="text-brand-red">小さいお子さま</span>や
        <br className="md:hidden" />
        <span className="text-brand-teal">ご高齢の方</span>がいる
        <br className="md:hidden" />
        ご家庭こそ
      </SectionHeading>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {families.map((f) => {
          const t = tones[f.tone];
          return (
            <div key={f.key} className={`rounded-3xl ${t.bg} p-6 md:p-8`}>
              <p className={`text-sm font-bold ${t.text}`}>{f.lead}</p>
              <h3 className="mt-1 text-xl font-black text-navy-dark md:text-2xl">{f.title}</h3>
              <ul className="mt-6 space-y-3">
                {f.items.map((item) => (
                  <li key={item.title} className="rounded-2xl bg-white p-4">
                    <p className={`font-black ${t.text}`}>{item.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Reasons() {
  return (
    <section id="reasons" className="bg-sky">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading eyebrow="Up draftが選ばれる理由">はじめてでも、頼みやすく</SectionHeading>
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <li key={r.title} className="rounded-3xl bg-white p-7">
              <p className="text-4xl font-black text-sky-deep">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-black leading-snug text-navy-dark">{r.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed">{r.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading eyebrow="作業工程">配管洗浄はこのように進めます</SectionHeading>
      <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-3 rounded-2xl bg-brand-teal-soft p-5 text-center md:flex-row md:text-left">
        <span className="shrink-0 rounded-full bg-brand-teal px-4 py-2 text-sm font-black text-white">
          全工程でpH値を確認
        </span>
        <p className="text-[15px] font-bold leading-relaxed text-navy-dark">
          マイクロバブル発生機で細かい泡を送り込みながら、4種類の薬品を順番に使い、最後は中和剤で仕上げます。ひとつひとつの工程でpH値を確かめながら作業します。
        </p>
      </div>
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {process.map((p, i) => (
          <li
            key={p.title}
            className="flex flex-col rounded-3xl border border-line bg-white p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-black text-white">
                {i + 1}
              </span>
              <p className="font-black leading-snug text-navy-dark">{p.title}</p>
            </div>
            {p.tag && (
              <p className="mt-3 self-start rounded-md bg-sky px-2.5 py-1 text-sm font-bold text-navy">
                {p.tag}
              </p>
            )}
            <p className="mt-3 flex-1 text-[15px] leading-relaxed">{p.body}</p>
            <p className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-teal">
              <CheckIcon className="h-4 w-4" />
              pH値を確認
            </p>
          </li>
        ))}
        <li className="flex flex-col justify-center rounded-3xl bg-navy p-6 text-white">
          <p className="text-sm font-bold text-white/75">ここまでの作業時間</p>
          <p className="mt-1 text-4xl font-black">
            約2<span className="text-lg">時間</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/85">
            次のお手入れは年1回が目安です。
          </p>
        </li>
      </ol>
      <h3 className="mt-14 text-center text-lg font-black text-navy-dark md:text-xl">
        薬品ごとの浴槽の様子
      </h3>
      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {process
          .filter((p) => p.photo)
          .map((p) => (
            <li key={p.photo}>
              <figure className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={p.photo}
                  alt={p.photoAlt}
                  fill
                  sizes="(min-width: 768px) 270px, 45vw"
                  className="object-cover"
                />
              </figure>
              <p className="mt-2 text-sm font-black text-navy-dark">{p.title}</p>
              <p className="text-xs font-bold text-muted">{p.tag}</p>
            </li>
          ))}
      </ul>
      <p className="mt-3 text-sm text-muted">
        薬品Dの写真の泡の部分は、配管の中から出てきた汚れです。
      </p>
    </section>
  );
}

const gallery = [
  { src: "/updraft/case-foam-wide.jpg", alt: "浴槽いっぱいに広がった配管からの汚れ", wide: true },
  { src: "/updraft/case-scoop-1.jpg", alt: "浴槽に出てきた汚れをすくい取る作業" },
  { src: "/updraft/case-scoop-3.jpg", alt: "泡立った汚れを取り除く作業" },
  { src: "/updraft/case-ladle.jpg", alt: "洗浄中の浴槽と、汚れをすくうひしゃく" },
  { src: "/updraft/case-yellow.jpg", alt: "配管から押し出された黄土色の汚れ" },
  { src: "/updraft/case-port.jpg", alt: "循環口まわりに集まった汚れ" },
  { src: "/updraft/case-sludge.jpg", alt: "かたまりになった汚れを取り除く様子" },
];

function Cases() {
  return (
    <section id="cases" className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading eyebrow="作業の様子">実際の現場から</SectionHeading>
        <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:items-center lg:gap-14">
          <figure className="mx-auto w-full max-w-[300px] overflow-hidden rounded-3xl bg-navy-dark shadow-xl">
            <video
              poster="/updraft/case-video-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="配管洗浄中に浴槽へ出てきた汚れをすくい取る様子の動画"
              className="aspect-[9/16] w-full object-cover"
            >
              <source src="/updraft/case-video.webm" type="video/webm" />
              <source src="/updraft/case-video.mp4" type="video/mp4" />
            </video>
          </figure>
          <div>
            <p className="inline-block rounded-full bg-white px-3 py-1 text-sm font-bold text-brand-red">
              ある日の現場より
            </p>
            <h3 className="mt-3 text-xl font-black leading-snug text-navy-dark md:text-3xl">
              最初の薬品を入れた時点で、
              <br className="hidden md:block" />
              汚れが出はじめたお宅です
            </h3>
            <p className="mt-5 leading-relaxed">
              1回目の薬品（スケール汚れ用）では、ふだんはまだ大きな変化が出ないことがほとんどです。
              このご家庭では、その段階からすでに汚れが浮き出てきました。それだけ配管の中に汚れがたまっていたということです。
            </p>
            <p className="mt-4 leading-relaxed">
              動画は最後の中和（薬品D）の工程です。青いお湯に、配管から押し出された汚れがまだこれだけ浮いてきます。浴槽に出てきた汚れは、ひしゃくでていねいにすくい取ります。
            </p>
          </div>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {gallery.map((g) => (
            <li
              key={g.src}
              className={`relative overflow-hidden rounded-2xl ${g.wide ? "col-span-2 aspect-[2/1] md:aspect-auto" : "aspect-square"}`}
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes={g.wide ? "(min-width: 768px) 560px, 100vw" : "(min-width: 768px) 280px, 50vw"}
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded-md bg-navy-dark/80 px-2 py-0.5 text-xs font-bold text-white">
                薬品C 投入後
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">すべて実際の作業で撮影した写真です。汚れが一番たくさん出てくるのは、薬品C（配管内部の汚れ洗浄）の工程です。</p>
      </div>
    </section>
  );
}

function Price({ campaignActive }) {
  return (
    <section id="price" className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading eyebrow="料金">追い焚き配管クリーニング</SectionHeading>
      <div className="mt-10 overflow-hidden rounded-3xl border-2 border-navy">
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <div className="p-7 md:p-9">
            <p className="font-bold text-muted">配管洗浄 1回（税込）</p>
            <p className="mt-2 flex items-baseline gap-1 text-navy-dark">
              <span className="text-5xl font-black tracking-tight md:text-6xl">{yen(price.regular)}</span>
              <span className="text-lg font-bold">円</span>
            </p>
            <p className="mt-3 inline-block rounded-full bg-sky px-3 py-1 text-sm font-bold text-navy">
              出張費込み（大阪市内）
            </p>
          </div>
          <dl className="grid grid-cols-2 border-t-2 border-navy bg-paper md:grid-cols-1 md:border-l-2 md:border-t-0">
            <div className="p-6 text-center">
              <dt className="text-sm font-bold text-muted">作業時間</dt>
              <dd className="mt-1 text-2xl font-black text-navy-dark">約2時間</dd>
            </div>
            <div className="border-l-2 border-navy p-6 text-center md:border-l-0 md:border-t-2">
              <dt className="text-sm font-bold text-muted">お手入れの目安</dt>
              <dd className="mt-1 text-2xl font-black text-navy-dark">年1回</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">
        対応エリアは{company.area}です。大阪市外の方は、お住まいの地域をお知らせください。お支払いは{company.payment}。お見積り・ご相談は無料です。
      </p>
      <p className="mt-2 text-sm text-muted">
        ※追い焚き機能のないお風呂（給水だけで循環しないタイプ）、吸い込み口が2つあるタイプ（2つ穴）、ヒノキの浴槽は対応できません。
      </p>

      {campaignActive && (
        <div className="mt-10 rounded-3xl bg-brand-red p-7 text-white md:p-9">
          <p className="inline-block rounded bg-brand-yellow px-3 py-1 text-sm font-black text-navy-dark">
            チラシをお持ちの方限定｜{price.campaignEndLabel}までのお申し込み
          </p>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
            <span className="text-white/80 line-through">{yen(price.regular)}円</span>
            <span className="text-5xl font-black md:text-6xl">{yen(price.campaign)}</span>
            <span className="text-lg font-bold">円（税込）</span>
          </p>
          <p className="mt-4 rounded-xl bg-white px-4 py-3 text-[15px] font-bold text-ink">
            お申し込みの際に、チラシに記載の<span className="text-brand-red">チラシ番号</span>をお伝えください。
            ご予約が混み合うことが予想されます。お早めにご連絡ください。
          </p>
        </div>
      )}
    </section>
  );
}

function Flow() {
  return (
    <section id="flow" className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading eyebrow="ご依頼の流れ">ご相談から完了まで</SectionHeading>
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-3xl bg-white p-6">
              <p className="text-sm font-black text-brand-red">STEP {i + 1}</p>
              <p className="mt-1 text-lg font-black text-navy-dark">{step.title}</p>
              <p className="mt-3 text-[15px] leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading eyebrow="よくあるご質問">気になること、お答えします</SectionHeading>
      <div className="mt-10 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-line bg-white open:bg-sky/40">
            <summary className="flex cursor-pointer list-none items-start gap-3 p-5 font-bold text-navy-dark [&::-webkit-details-marker]:hidden">
              <span className="font-black text-navy">Q.</span>
              <span className="flex-1">{f.q}</span>
              <span className="mt-0.5 text-xl leading-none text-navy transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="flex gap-3 px-5 pb-5">
              <span className="font-black text-brand-red">A.</span>
              <p className="flex-1 leading-relaxed">{f.a}</p>
            </div>
          </details>
        ))}
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
      color: "bg-line-green",
      text: "text-line-green",
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
            className="flex flex-col justify-center rounded-3xl bg-white/10 p-7 ring-1 ring-white/20 hover:bg-white/15 md:col-span-2"
          >
            <p className="text-sm font-bold text-white/80">お電話でのご相談</p>
            <p className="mt-2 flex items-center gap-3 text-3xl font-black tracking-wide md:text-5xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-navy md:h-14 md:w-14">
                <FaPhone className="h-5 w-5 md:h-6 md:w-6" />
              </span>
              {company.mobile}
            </p>
            <p className="mt-3 text-sm text-white/75">
              受付時間 {company.hours}　スマートフォンからはタップで発信できます
            </p>
          </a>
          {channels.map((c) => (
            <div key={c.title} className="flex gap-4 rounded-3xl bg-white p-5 text-ink">
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
    ["受付時間", company.hours],
    ["対応エリア", company.area],
    ["事業内容", "追い焚き配管クリーニング"],
    ["保険", "損害保険加入"],
  ];
  return (
    <section id="company" className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading eyebrow="会社概要">{company.name}</SectionHeading>
      <dl className="mt-10 divide-y divide-line border-y border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 py-4 md:grid-cols-[10rem_1fr] md:gap-6">
            <dt className="text-sm font-bold text-muted">{k}</dt>
            <dd className="break-words">{v}</dd>
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
      <PhoneButton className="rounded-lg py-3" label="電話する" />
      <LineButton className="rounded-lg py-3" label="LINEで相談" />
    </div>
  );
}

export default function Home() {
  const campaignActive = isCampaignActive();
  return (
    <>
      <Header />
      <main>
        <Hero campaignActive={campaignActive} />
        <About />
        <Checklist />
        <Families />
        <Reasons />
        <Process />
        <Cases />
        <Price campaignActive={campaignActive} />
        <Flow />
        <Faq />
        <Contact />
        <Company />
      </main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
