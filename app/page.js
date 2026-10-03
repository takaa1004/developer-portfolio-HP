import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLine, FaPhone } from "react-icons/fa6";
import {
  causes,
  checklist,
  company,
  faqs,
  families,
  glossary,
  isCampaignActive,
  price,
  process,
  reasons,
  steps,
  telHref,
} from "./_updraft/data";
import {
  CheckIcon,
  KidsBathIllust,
  LineChatIllust,
  PipeDiagram,
  SectionHeading,
  SeniorBathIllust,
} from "./_updraft/ui";
import { CtaStrip, Footer, Header, LineButton, MobileCallBar, More, PhoneButton } from "./_updraft/site";

// キャンペーン終了日を過ぎたら表示を切り替えるため、1時間ごとに再生成する
export const revalidate = 3600;

const yen = (n) => n.toLocaleString("ja-JP");

const gallery = [
  { src: "/updraft/case-foam-wide.jpg", alt: "浴槽いっぱいに広がった配管からの汚れ" },
  { src: "/updraft/case-scoop-1.jpg", alt: "浴槽に出てきた汚れをすくい取る作業" },
  { src: "/updraft/case-yellow.jpg", alt: "配管から押し出された黄土色の汚れ" },
  { src: "/updraft/case-port.jpg", alt: "循環口まわりに集まった汚れ" },
  { src: "/updraft/case-scoop-3.jpg", alt: "泡立った汚れを取り除く作業" },
  { src: "/updraft/case-ladle.jpg", alt: "洗浄中の浴槽と、汚れをすくうひしゃく" },
  { src: "/updraft/case-sludge.jpg", alt: "かたまりになった汚れを取り除く様子" },
];


function Hero({ campaignActive }) {
  const facts = [
    ["作業時間", "約2時間"],
    ["お手入れ", "年1回"],
    ["お見積り", "無料"],
  ];
  return (
    <section id="top" className="bg-sky">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold text-navy">大阪の追い焚き配管クリーニング</p>
          <h1 className="mt-4 text-[1.9rem] font-black leading-[1.35] text-navy-dark sm:text-5xl sm:leading-[1.3]">
            <span className="whitespace-nowrap">家族が毎日入るお風呂を、</span>
            <br />
            <span className="whitespace-nowrap">
              <span className="bg-[linear-gradient(transparent_62%,#ffd84d_62%)]">見えない配管</span>
              まで
            </span>
            <span className="whitespace-nowrap">きれいに。</span>
          </h1>
          <p className="mt-4 text-ink">小さいお子さまやご高齢の方がいるご家庭こそ、年に1回の配管洗浄を。</p>
          <dl className="mt-6 flex max-w-md divide-x divide-navy/20 border-y border-navy/20">
            {facts.map(([k, v]) => (
              <div key={k} className="flex-1 py-3 text-center">
                <dt className="text-xs font-bold text-muted">{k}</dt>
                <dd className="text-xl font-black text-navy md:text-2xl">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LineButton className="px-7 py-4 text-lg" label="LINEで無料相談" />
            <PhoneButton className="px-7 py-4 text-lg" label="電話で相談する" />
          </div>
          {campaignActive && (
            <a href="#price" className="mt-4 inline-block text-sm font-bold text-brand-red underline underline-offset-4">
              チラシをお持ちの方は{price.campaignEndLabel}まで {yen(price.campaign)}円 →
            </a>
          )}
        </div>
        <figure className="border-l-4 border-navy bg-white p-5 md:p-6">
          <figcaption className="text-sm font-bold text-navy-dark">追い焚き配管とは？</figcaption>
          <PipeDiagram className="mt-2 w-full" />
          <p className="mt-2 text-sm text-muted">浴槽と給湯器をつなぐ配管。お湯はりや保温のたびにお湯が通ります。</p>
        </figure>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeading eyebrow="配管の中のこと">
        見えないところに、
        <br className="md:hidden" />
        汚れはたまります
      </SectionHeading>
      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-2 gap-2">
          {["/updraft/case-scoop-2.jpg", "/updraft/case-green.jpg"].map((src) => (
            <figure key={src} className="relative aspect-square overflow-hidden rounded-md">
              <Image
                src={src}
                alt="追い焚き配管の洗浄中に浴槽へ出てきた汚れ"
                fill
                sizes="(min-width: 1024px) 280px, 45vw"
                className="object-cover"
              />
            </figure>
          ))}
          <p className="col-span-2 text-sm text-muted">実際の洗浄で、配管から出てきた汚れです。</p>
        </div>
        <div>
          <p className="text-xl font-black leading-relaxed text-navy-dark">
            見た目がきれいなお風呂でも、
            <br />
            配管の中はこの状態です。
          </p>
          <p className="mt-3">毎日のお湯は、この配管を通って浴槽に届いています。</p>
          <More className="mt-6 text-navy" label="汚れがたまる理由を見る">
            <ol className="divide-y divide-line border-y border-line">
              {causes.map((c, i) => (
                <li key={c.title} className="flex gap-4 py-4">
                  <span className="font-black text-navy">{i + 1}</span>
                  <div>
                    <p className="font-bold text-navy-dark">{c.title}</p>
                    <p className="mt-1 text-[15px] text-ink">{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[15px] text-ink">
              <strong className="text-navy-dark">レジオネラ属菌</strong>
              は温かい水で増える菌で、湯気やしぶきを吸い込むと肺炎の原因になることがあります。
            </p>
          </More>
        </div>
      </div>
    </section>
  );
}

function Checklist() {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:px-6 md:py-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-sm font-bold text-white/70">こんな方におすすめです</p>
          <h2 className="mt-2 text-2xl font-black leading-snug md:text-4xl">こんなことはありませんか？</h2>
          <p className="mt-3 text-white/80">ひとつでも当てはまれば、お手入れどきです。</p>
        </div>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {checklist.map((item) => (
            <li key={item.title} className="flex items-start gap-3 border-b border-white/15 py-3.5">
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-yellow" />
              <span className="font-bold">{item.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Families() {
  const tones = { coral: "text-brand-red border-brand-red", teal: "text-brand-teal border-brand-teal" };
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeading eyebrow="こんなご家庭は特に">
        <span className="text-brand-red">小さいお子さま</span>や
        <br className="md:hidden" />
        <span className="text-brand-teal">ご高齢の方</span>がいるご家庭
      </SectionHeading>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {families.map((f) => (
          <div key={f.key} className={`border-t-4 pt-5 ${tones[f.tone]}`}>
            {f.key === "kids" ? (
              <KidsBathIllust className="mb-3 h-24 w-auto" />
            ) : (
              <SeniorBathIllust className="mb-3 h-24 w-auto" />
            )}
            <h3 className="text-lg font-black text-navy-dark md:text-xl">{f.title}</h3>
            <ul className="mt-3 space-y-1.5">
              {f.items.map((item) => (
                <li key={item.title} className="flex gap-2 font-bold">
                  <span aria-hidden="true">・</span>
                  {item.title}
                </li>
              ))}
            </ul>
            <More className="mt-4" label="理由を見る">
              <dl className="space-y-3 text-[15px] text-ink">
                {f.items.map((item) => (
                  <div key={item.title}>
                    <dt className="font-bold text-navy-dark">{item.title}</dt>
                    <dd>{item.body}</dd>
                  </div>
                ))}
              </dl>
            </More>
          </div>
        ))}
      </div>
    </section>
  );
}

function Reasons() {
  return (
    <section id="reasons" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeading eyebrow="Up draftが選ばれる理由">安心してお任せいただくために</SectionHeading>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <li key={r.title} className="border-t-2 border-navy pt-4">
            <h3 className="text-lg font-black leading-snug text-navy-dark">{r.title}</h3>
            <p className="mt-2 text-[15px] text-ink">{r.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Process() {
  const photos = process.filter((p) => p.photo);
  return (
    <section id="process" className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <SectionHeading eyebrow="作業工程">7つの工程で洗浄します</SectionHeading>
        <p className="mt-4 text-center font-bold text-brand-teal">
          マイクロバブル発生機（細かい泡を出す機械）と4種類の薬品を使い、全工程でpH値を確認します
        </p>
        <ol className="mx-auto mt-10 grid max-w-4xl gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <li key={p.title} className="flex items-start gap-3 bg-white p-4">
              <span className="font-black text-navy">{i + 1}</span>
              <div>
                <p className="font-bold leading-snug text-navy-dark">{p.title}</p>
                {p.tag && <p className="text-sm text-muted">{p.tag}</p>}
              </div>
            </li>
          ))}
          <li className="flex items-center bg-navy p-4 text-white">
            <p className="font-bold">
              ここまで <span className="text-2xl font-black">約2時間</span>
            </p>
          </li>
        </ol>
        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-2 md:grid-cols-4">
          {photos.map((p) => (
            <li key={p.photo}>
              <figure className="relative aspect-[3/4] overflow-hidden rounded-md">
                <Image src={p.photo} alt={p.photoAlt} fill sizes="(min-width: 768px) 220px, 45vw" className="object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-navy-dark/80 px-2 py-1 text-xs font-bold text-white">
                  {p.title}（{p.tag}）
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <More className="mx-auto mt-8 block max-w-4xl text-navy" label="むずかしい言葉の説明を見る">
          <dl className="divide-y divide-line border-y border-line bg-white text-[15px]">
            {glossary.map(([term, desc]) => (
              <div key={term} className="grid gap-1 px-4 py-3 md:grid-cols-[11rem_1fr] md:gap-4">
                <dt className="font-bold text-navy-dark">{term}</dt>
                <dd className="text-ink">{desc}</dd>
              </div>
            ))}
          </dl>
        </More>
        <More className="mx-auto mt-4 block max-w-4xl text-navy" label="各工程の説明を見る">
          <ol className="divide-y divide-line border-y border-line bg-white">
            {process.map((p, i) => (
              <li key={p.title} className="flex gap-4 px-4 py-3">
                <span className="font-black text-navy">{i + 1}</span>
                <p className="text-[15px] text-ink">
                  <strong className="text-navy-dark">{p.title}</strong>　{p.body}
                </p>
              </li>
            ))}
          </ol>
        </More>
      </div>
    </section>
  );
}

function Cases() {
  return (
    <section id="cases" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeading eyebrow="作業の様子">実際の現場の写真と動画</SectionHeading>
      <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,280px)_1fr] md:items-center lg:gap-14">
        <figure className="mx-auto w-full max-w-[280px] overflow-hidden rounded-md bg-navy-dark">
          <video
            poster="/updraft/case-video-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label="配管洗浄中に浴槽へ出てきた汚れをすくい取る様子の動画"
            className="aspect-[9/16] w-full object-cover"
          >
            <source src="/updraft/case-video.mp4" type="video/mp4" />
            <source src="/updraft/case-video.webm" type="video/webm" />
          </video>
        </figure>
        <div>
          <h3 className="text-xl font-black leading-snug text-navy-dark md:text-2xl">
            最後の中和の工程でも、
            <br className="hidden md:block" />
            汚れがこれだけ出てきます
          </h3>
          <p className="mt-3">青いお湯に浮いているのが、配管から押し出された汚れです。</p>
          <More className="mt-5 text-navy" label="この現場について">
            <p className="text-[15px] text-ink">
              ふだんは最初の薬品（スケール汚れ用）ではあまり変化が出ませんが、このお宅ではその段階から汚れが出はじめました。それだけ配管に汚れがたまっていたということです。
            </p>
          </More>
        </div>
      </div>
      <ul className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4">
        {gallery.slice(0, 4).map((g) => (
          <li key={g.src} className="relative aspect-square overflow-hidden rounded-md">
            <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 280px, 50vw" className="object-cover" />
          </li>
        ))}
      </ul>
      <More className="mt-5 text-navy" label="写真をもっと見る">
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {gallery.slice(4).map((g) => (
            <li key={g.src} className="relative aspect-square overflow-hidden rounded-md">
              <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 280px, 50vw" className="object-cover" />
            </li>
          ))}
        </ul>
      </More>
      <p className="mt-4 text-sm text-muted">写真はすべて薬品C（配管内部の汚れ洗浄）の工程です。</p>
      <Link
        href="/works"
        className="mt-8 flex items-center justify-between rounded-md border-2 border-navy px-5 py-4 font-black text-navy hover:bg-sky"
      >
        大阪府内の施工実績を見る
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

function Price({ campaignActive }) {
  const rows = [
    ["料金", `${yen(price.regular)}円（税込）`],
    ["出張費", "大阪府内は料金に含みます（交通費込み）"],
    ["作業時間", "約2時間"],
    ["対応エリア", company.area],
    ["お支払い", company.payment],
  ];
  return (
    <section id="price" className="bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
        <SectionHeading eyebrow="料金">追い焚き配管クリーニング</SectionHeading>
        <dl className="mt-10 divide-y divide-line border-y-2 border-navy bg-white">
          {rows.map(([k, v], i) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 px-4 py-4 md:grid-cols-[9rem_1fr]">
              <dt className="font-bold text-muted">{k}</dt>
              <dd className={i === 0 ? "text-2xl font-black text-navy-dark md:text-3xl" : "font-bold text-navy-dark"}>{v}</dd>
            </div>
          ))}
        </dl>
        {campaignActive && (
          <div className="mt-6 border-l-4 border-brand-red bg-white p-5">
            <p className="text-sm font-black text-brand-red">
              チラシをお持ちの方限定（{price.campaignEndLabel}までのお申し込み）
            </p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span className="text-muted line-through">{yen(price.regular)}円</span>
              <span className="text-3xl font-black text-brand-red">{yen(price.campaign)}円</span>
              <span className="text-sm font-bold">（税込）</span>
            </p>
            <p className="mt-1 text-sm">お申し込みの際に、チラシ番号をお伝えください。</p>
          </div>
        )}
        <More className="mt-6 text-navy" label="ご依頼の前にご確認ください">
          <ul className="list-disc space-y-1.5 pl-5 text-[15px] text-ink">
            <li>追い焚き機能のないお風呂（給水だけで循環しないタイプ）、2つ穴タイプ（吸い込み口が上下2つある古い型）、ヒノキの浴槽は対応できません。</li>
            <li>ご自宅のお風呂の品番（給湯器のリモコンや本体に書かれた型番）をご確認ください。</li>
            <li>エコキュート（電気でお湯をわかしてタンクにためる給湯器）の場合は、お湯が残っているかをご確認ください。</li>
          </ul>
        </More>
      </div>
    </section>
  );
}

function Flow() {
  return (
    <section id="flow" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeading eyebrow="ご依頼の流れ">ご相談から完了まで</SectionHeading>
      <ol className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="border-t-2 border-navy pt-3">
            <p className="text-sm font-black text-brand-red">STEP {i + 1}</p>
            <p className="text-lg font-black text-navy-dark">{step.title}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 pb-16 md:px-6 md:pb-20">
      <SectionHeading eyebrow="FAQ">よくあるご質問</SectionHeading>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-start gap-3 py-4 font-bold text-navy-dark [&::-webkit-details-marker]:hidden">
              <span className="font-black text-navy">Q</span>
              <span className="flex-1">{f.q}</span>
              <span aria-hidden="true" className="text-xl leading-none text-navy transition-transform group-open:rotate-45">
                ＋
              </span>
            </summary>
            <div className="flex gap-3 pb-5">
              <span className="font-black text-brand-red">A</span>
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
      note: "メッセージだけでOK",
      href: company.lineUrl,
      qr: "/updraft/qr-line.svg",
      icon: FaLine,
      color: "bg-line-green",
      text: "text-line-green",
      cta: "友だち追加",
    },
    {
      title: "Instagram",
      note: `${company.instagramId}（DMで相談OK）`,
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
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="flex items-center gap-5">
          <div className="flex-1">
            <h2 className="text-2xl font-black leading-snug md:text-4xl">「まずは相談だけ」でも大丈夫です。</h2>
            <p className="mt-2 text-white/80">お見積り・ご相談は無料です。お風呂の写真をLINEで送っていただくとスムーズです。</p>
          </div>
          <LineChatIllust className="h-28 w-auto shrink-0 md:h-36" />
        </div>
        <a href={telHref(company.mobile)} className="mt-8 inline-flex items-center gap-3 text-3xl font-black tracking-wide md:text-5xl">
          <FaPhone className="h-7 w-7 md:h-9 md:w-9" />
          {company.mobile}
        </a>
        <p className="mt-1 text-sm text-white/75">受付時間 {company.hours}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {channels.map((c) => (
            <div key={c.title} className="flex gap-4 rounded-md bg-white p-4 text-ink">
              <Image src={c.qr} alt={`${c.title}のQRコード`} unoptimized width={96} height={96} className="hidden h-24 w-24 shrink-0 sm:block" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className={`flex items-center gap-2 font-black ${c.text}`}>
                    <c.icon className="h-5 w-5" />
                    {c.title}
                  </p>
                  <p className="text-sm text-muted">{c.note}</p>
                </div>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 rounded-md ${c.color} px-4 py-2 text-center text-sm font-bold text-white hover:opacity-90`}
                >
                  {c.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/80">
          メール：
          <a href={`mailto:${company.email}`} className="font-bold underline underline-offset-4">
            {company.email}
          </a>
        </p>
      </div>
    </section>
  );
}

function CompanyRows({ rows, className = "" }) {
  return (
    <dl className={`divide-y divide-line border-y border-line text-[15px] text-ink ${className}`}>
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 py-3 md:grid-cols-[9rem_1fr] md:gap-6">
          <dt className="font-bold text-muted">{k}</dt>
          <dd className="break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Company() {
  const rows = [
    ["会社名", company.name],
    ["代表者", `${company.representativeTitle}　${company.representative}`],
    ...company.offices.map((o) => [o.label, `${o.zip}　${o.address}`]),
    ["TEL / FAX", `${company.tel} / ${company.fax}`],
    ["携帯", company.mobile],
    ["Mail", company.email],
    ["受付時間", company.hours],
    ["対応エリア", company.area],
    ["保険", "損害保険加入"],
  ];
  return (
    <section id="company" className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeading eyebrow="会社概要">{company.name}</SectionHeading>
      <CompanyRows rows={rows.slice(0, 4)} className="mt-8" />
      <More className="mt-5 text-navy" label="連絡先・その他を見る">
        <CompanyRows rows={rows.slice(4)} />
      </More>
    </section>
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
        <CtaStrip lead="気になったら、まずはご相談ください" />
        <Reasons />
        <Process />
        <Cases />
        <CtaStrip lead="作業は約2時間。お見積りは無料です" />
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
