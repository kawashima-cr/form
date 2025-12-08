import { z } from "zod";

const contractStatusSchema = z.enum([
  "initial",
  "contract",
  "negotiation",
  "cancellation",
]);

export const formSchema = z
  .object({
    company: z.string().trim().trim().min(1, "会社名を入力してください"),
    postalCode: z
      .string()
      .trim()
      .regex(
        /^\d{3}-?\d{4}$/,
        "郵便番号は「1234567」または「123-4567」の形式で入力してください"
      ),
    prefecture: z.string().trim().min(1, "都道府県を入力してください"),
    city: z.string().trim().min(1, "市区町村を入力してください"),
    address: z.string().trim().min(1, "残りの住所を入力してください"),
    building: z.string().trim().optional(),
    tel: z
      .string()
      .trim()
      .min(1, "電話番号を入力してください")
      .regex(/^[0-9\-+\s()]{7,20}$/, "電話番号の形式が不正です"),
    emails: z
      .array(z.email("正しいメールアドレスを入力してください"))
      .min(1, "最低1つのメールアドレスを入力してください")
      .refine(
        (emails) => emails.some((email) => email.trim() !== ""),
        "最低1つのメールアドレスを入力してください"
      ),
    contractDate: z.string().trim().min(1, "日付を入力してください"),
    contractStatus: contractStatusSchema.refine((v) => v !== "initial", {
      message: "契約ステータスを選択してください",
    }),
    cancellationDate: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      // 契約ステータスが「解約」の場合、解約日は必須
      if (data.contractStatus === "cancellation") {
        return data.cancellationDate && data.cancellationDate.length > 0;
      }
      return true;
    },
    {
      message: "解約日を入力してください",
      path: ["cancellationDate"],
    }
  );

export type FormData = z.infer<typeof formSchema>;
