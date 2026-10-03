import { GoogleTagManager } from "@next/third-parties/google";
import "./updraft.css";

const SITE_URL = "https://up-draft-official.jp";
const TITLE = "大阪の追い焚き配管クリーニング｜有限会社Up draft";
const DESCRIPTION =
  "大阪府内全域対応の追い焚き配管クリーニング。マイクロバブル発生機と4種類の薬品で、お風呂の配管にたまった汚れを約2時間で洗浄します。全工程でpH値を確認。大阪府内は交通費込み、お見積り・ご相談は無料。LINE・お電話でどうぞ。";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "有限会社Up draft",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

// 検索結果に地域のお店として表示されやすくするための構造化データ
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "有限会社Up draft",
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  telephone: "+81-80-7574-4875",
  email: "y.asamura@up-draft-official.jp",
  priceRange: "¥25,000",
  areaServed: { "@type": "AdministrativeArea", name: "大阪府" },
  address: {
    "@type": "PostalAddress",
    postalCode: "573-0073",
    addressRegion: "大阪府",
    addressLocality: "枚方市",
    streetAddress: "高田2丁目6-15 平山ビル302号",
    addressCountry: "JP",
  },
  sameAs: ["https://www.instagram.com/000updraft000"],
  makesOffer: {
    "@type": "Offer",
    price: 25000,
    priceCurrency: "JPY",
    itemOffered: { "@type": "Service", name: "追い焚き配管クリーニング" },
  },
};

export const viewport = {
  themeColor: "#0f3a8a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GTM && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />}
    </html>
  );
}
