import type { FormDataType } from "./Form.schema";

type InputField = {
  label: string;
  type: string;
  name: keyof FormDataType;
  id: keyof FormDataType;
};
export const inputFields: InputField[] = [
  { label: "会社名", type: "text", name: "company", id: "company" },
  { label: "郵便番号", type: "text", name: "postalCode", id: "postalCode" },
  { label: "都道府県", type: "text", name: "prefecture", id: "prefecture" },
  { label: "市区町村", type: "text", name: "city", id: "city" },
  { label: "その他の住所", type: "text", name: "address", id: "address" },
  {
    label: "アパートマンション名",
    type: "text",
    name: "building",
    id: "building",
  },
  { label: "電話番号", type: "text", name: "tel", id: "tel" },
  { label: "メールアドレス", type: "text", name: "emails", id: "emails" },
  { label: "契約日", type: "date", name: "contractDate", id: "contractDate" },
];

export const prefectures = [
  "東京都",
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;
