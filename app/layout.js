import { GoogleTagManager } from "@next/third-parties/google";
import { Noto_Sans_JP } from "next/font/google";
import "./updraft.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata = {
  title: "追い焚き配管クリーニング｜有限会社Up draft（大阪・枚方・交野）",
  description:
    "大阪の追い焚き配管クリーニングなら有限会社Up draft。マンションのお風呂の配管にたまった汚れを約2時間で洗浄します。出張費込み（大阪市内）、お見積り・ご相談は無料。お電話・LINE・Instagramからどうぞ。",
};

export const viewport = {
  themeColor: "#0f3a8a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>{children}</body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
    </html>
  );
}
