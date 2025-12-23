import z from "zod";

export const RegistrationSchema = z.object({
  name: z.string().trim().trim().min(1, "顧客名は必須項目です"),
  tel: z
    .string()
    .trim()
    .min(1, "電話番号を入力してください")
    .regex(/^[0-9\-+\s()]{7,20}$/, "電話番号の形式が不正です"),
  postalCode: z
    .string()
    .trim()
    .regex(
      /^\d{3}-?\d{4}$/,
      "郵便番号は「1234567」または「123-4567」の形式で入力してください"
    ),
  prefecture: z.string().trim().min(1, "都道府県を選択してください"),
  address: z.string().trim().min(1, "住所を入力してください"),
  issueDate: z.string().trim().min(1, "日付を入力してください"),
  expiryDate: z.string().trim().min(1, "日付を入力してください"),
  notes: z.string().trim().optional(),
  projectMemo: z.string().trim().optional(),
});

export type RegistrationSchemaType = z.infer<typeof RegistrationSchema>;
