import Link from "next/link";
import { Footer, Header, LineButton, PhoneButton } from "./_updraft/site";

export const metadata = {
  title: "ページが見つかりません｜有限会社Up draft",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6">
        <p className="text-sm font-bold text-muted">404</p>
        <h1 className="mt-2 text-2xl font-black text-navy-dark md:text-3xl">ページが見つかりません</h1>
        <p className="mt-4 text-ink">
          お探しのページは移動したか、削除された可能性があります。
        </p>
        <Link prefetch={false}
          href="/"
          className="mt-8 inline-block rounded-md border-2 border-navy px-6 py-3 font-bold text-navy hover:bg-sky"
        >
          トップページへ戻る
        </Link>
        <div className="mx-auto mt-10 grid max-w-md gap-2 sm:grid-cols-2">
          <LineButton className="py-3.5" label="LINEで相談" />
          <PhoneButton className="py-3.5" label="電話する" />
        </div>
      </main>
      <Footer />
    </>
  );
}
