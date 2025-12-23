export type MenuCategory =
  | "airConditioner"
  | "washingMachine"
  | "floor"
  | "other";

export type MenuDataType = {
  id: string;
  category: MenuCategory;
  name: string;
  price: number;
  unit: string;
};

export const categoryOptions: Array<{
  value: MenuCategory | null;
  label: string;
}> = [
  { value: null, label: "すべて" },
  { value: "airConditioner", label: "エアコン" },
  { value: "washingMachine", label: "洗濯機" },
  { value: "floor", label: "床" },
  { value: "other", label: "その他" },
];

export const menuData: MenuDataType[] = [
  {
    id: "other-1",
    category: "other",
    name: "その他（自分で入力）",
    price: 0,
    unit: "",
  },
  {
    id: "ac-1",
    category: "airConditioner",
    name: "エアコン（壁掛設置）／一般",
    price: 9980,
    unit: "式",
  },
  {
    id: "ac-2",
    category: "airConditioner",
    name: "エアコン（壁掛設置）／各種機能付き",
    price: 18700,
    unit: "式",
  },
  {
    id: "ac-3",
    category: "airConditioner",
    name: "エアコン（壁掛設置）／壁掛埋め込み式",
    price: 14300,
    unit: "式",
  },
  {
    id: "wm-1",
    category: "washingMachine",
    name: "洗濯機／縦型",
    price: 8800,
    unit: "機",
  },
  {
    id: "wm-2",
    category: "washingMachine",
    name: "洗濯機／ドラム式",
    price: 26000,
    unit: "機",
  },
  {
    id: "floor-1",
    category: "floor",
    name: "床／床清掃のみ（水拭き、掃除機掛け）",
    price: 330,
    unit: "㎡",
  },
  {
    id: "floor-2",
    category: "floor",
    name: "床／カーペット洗浄",
    price: 770,
    unit: "㎡",
  },
  {
    id: "floor-3",
    category: "floor",
    name: "床／剥離サービス",
    price: 1100,
    unit: "㎡",
  },
];
