export const company = {
  name: "有限会社 Up draft",
  representative: "浅村 有弥",
  representativeTitle: "代表取締役",
  mobile: "080-7574-4875",
  tel: "072-896-6695",
  fax: "072-896-6696",
  email: "y.asamura@up-draft-official.jp",
  lineUrl: "https://lin.ee/LtbwFbz",
  instagramUrl: "https://www.instagram.com/000updraft000",
  instagramId: "@000updraft000",
  offices: [
    {
      label: "本店",
      zip: "〒576-0014",
      address: "大阪府交野市星田山手1丁目9番7号",
    },
    {
      label: "枚方営業所",
      zip: "〒573-0073",
      address: "大阪府枚方市高田2丁目6-15 平山ビル302号",
    },
  ],
};

export const telHref = (number) => `tel:${number.replaceAll("-", "")}`;

export const price = {
  regular: 25000,
  campaign: 20000,
  // この日の23:59（日本時間）を過ぎるとキャンペーン表示が自動で消える
  campaignEnd: "2026-10-20T23:59:59+09:00",
  campaignEndLabel: "10月20日（火）",
};

export const risks = {
  kids: {
    title: "小さいお子さまがいるご家庭",
    items: [
      {
        title: "お湯を飲んでしまう",
        body: "お風呂で遊んでいると、どうしても口に入ります。",
      },
      {
        title: "肌が弱い",
        body: "子どもの肌は大人より薄く、刺激を受けやすいです。",
      },
      {
        title: "抵抗力がまだ弱い",
        body: "大人なら平気な菌でも、影響を受けることがあります。",
      },
    ],
  },
  seniors: {
    title: "ご高齢の方がいるご家庭",
    items: [
      {
        title: "抵抗力が落ちやすい",
        body: "レジオネラ症は高齢の方がかかりやすいとされています。",
      },
      {
        title: "保温を長く使うことが多い",
        body: "保温中も、お湯は浴槽と配管を行き来しています。",
      },
      {
        title: "自分で掃除するのは大変",
        body: "かがんでの作業は体に負担がかかります。お任せください。",
      },
    ],
  },
};

export const checklist = [
  { title: "お湯に黒いカスや茶色いカスが浮く" },
  { title: "お湯がなんとなく臭う" },
  {
    title: "自動お湯はりや保温を使っている",
    note: "追い焚きを使わなくても、お湯はりのたびに配管を通ります",
  },
  { title: "配管の掃除を1年以上していない" },
];

export const steps = [
  {
    title: "ご相談",
    body: "お電話・LINE・Instagramからお気軽にどうぞ。写真があるとスムーズです。",
  },
  {
    title: "お見積り",
    body: "お見積り・ご相談は無料です。日程を決めてご予約いただきます。",
  },
  {
    title: "配管洗浄",
    body: "ご自宅に伺って追い焚き配管を洗浄します。作業時間は約2時間です。",
  },
  {
    title: "完了",
    body: "作業が終われば完了です。次のお手入れは年1回が目安です。",
  },
];

export const isCampaignActive = (now = new Date()) =>
  now.getTime() <= new Date(price.campaignEnd).getTime();
