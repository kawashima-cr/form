import type { FormData } from "./Form.schema";

type InputField = {
  label: string;
  type: string;
  name: keyof FormData;
  id: keyof FormData;
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
  { label: "メールアドレス", type: "text", name: "email", id: "email" },
  { label: "契約日", type: "date", name: "contractDate", id: "contractDate" },
];
