import Image from "next/image";
import Link from "next/link";
import { WORKS_ARE_SAMPLE, works } from "../_updraft/data";
import { CtaStrip, Footer, Header, MobileCallBar } from "../_updraft/site";
import { SectionHeading } from "../_updraft/ui";

export const metadata = {
  title: "施工実績｜大阪の追い焚き配管クリーニング｜有限会社Up draft",
  description:
    "大阪府内で行った追い焚き配管クリーニングの施工実績です。実際に配管から出てきた汚れの写真を、時期と地域ごとに掲載しています。",
  alternates: { canonical: "/works" },
};

export default function WorksPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-sky">
          <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
            <p className="text-sm font-bold text-navy">
              <Link href="/" className="underline underline-offset-4">
                トップ
              </Link>
              　›　施工実績
            </p>
            <h1 className="mt-3 text-3xl font-black text-navy-dark md:text-4xl">施工実績</h1>
            <p className="mt-3 text-ink">
              大阪府内で行った追い焚き配管クリーニングの記録です。写真はすべて、実際に配管から出てきた汚れです。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          {WORKS_ARE_SAMPLE && (
            <p className="mb-8 border-l-4 border-brand-red bg-brand-red-soft px-4 py-3 text-sm font-bold text-brand-red">
              確認用：時期と地域は仮の内容です。公開前に実際の記録に差し替えます。
            </p>
          )}
          <SectionHeading eyebrow="大阪府内の施工実績">{works.length}件の施工記録</SectionHeading>
          <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((w) => (
              <li key={`${w.date}-${w.area}`}>
                <figure className="relative aspect-[4/3] overflow-hidden rounded-md bg-paper">
                  <Image
                    src={w.photo}
                    alt={w.alt}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                </figure>
                <p className="mt-3 flex items-baseline gap-3">
                  <span className="text-sm font-bold text-muted">{w.date}</span>
                  <span className="font-black text-navy-dark">大阪府{w.area}</span>
                </p>
                <p className="text-sm text-muted">マンション・追い焚き配管クリーニング</p>
                <p className="mt-2 text-[15px] text-ink">{w.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <CtaStrip lead="ご自宅のお風呂も、まずはご相談ください" />
      </main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
