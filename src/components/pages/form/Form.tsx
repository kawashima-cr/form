import { useState } from "react";
import TextInput from "../../form/InputField";
import { formSchema, type FormData } from "./Form.schema";
import { inputFields, prefectures } from "./Form.constants";
import { fetchAddress } from "../../../api/postalCode";

export default function Form() {
  const [data, setData] = useState<FormData>({
    company: "",
    postalCode: "",
    prefecture: "",
    city: "",
    address: "",
    building: "",
    tel: "",
    emails: [""],
    contractDate: "",
    contractStatus: "initial",
    cancellationDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailErrors, setEmailErrors] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setEmailErrors([]);

    // 空のemailを除外してバリデーション
    const validEmails = data.emails.filter((email) => email.trim() !== "");
    const formData = {
      ...data,
      emails: validEmails.length > 0 ? validEmails : [""],
    };

    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      const newEmailErrors: string[] = [];

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;

        // emailsのエラー処理
        if (field === "emails" && issue.path.length > 1) {
          const emailIndex = issue.path[1] as number;
          newEmailErrors[emailIndex] = issue.message;
        } else {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      setEmailErrors(newEmailErrors);
      return;
    }

    console.log("フォーム送信:", formData);
  };

  const handleSearchAddress = async () => {
    setErrors({});
    try {
      setLoading(true);
      const result = await fetchAddress(data.postalCode);
      if (result) {
        setData((prev) => ({
          ...prev,
          prefecture: result.address1,
          city: result.address2,
          address: result.address3,
        }));
      }
    } catch (error) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        postalCode: "住所の取得に失敗しました",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = () => {
    setData((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  const handleEmailChange = (index: number, value: string) => {
    setData((prev) => {
      const newEmails = [...prev.emails];
      newEmails[index] = value;
      return { ...prev, emails: newEmails };
    });

    // エラーをクリア
    if (emailErrors[index]) {
      setEmailErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = "";
        return newErrors;
      });
    }
    if (errors.emails) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.emails;
        return newErrors;
      });
    }
  };

  const handleRemoveEmail = (index: number) => {
    if (data.emails.length > 1) {
      setData((prev) => ({
        ...prev,
        // TODO
        emails: prev.emails.filter((_, i) => i !== index),
      }));
      setEmailErrors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="w-[400px] my-5 mx-auto">
      <form className="max-w-full text-xl" onSubmit={handleSubmit}>
        {inputFields.map((inputField) => (
          <div key={inputField.id}>
            {inputField.name === "prefecture" ? (
              <div className="mb-1">
                <label className="block" htmlFor="contractStatus">
                  {inputField.label}
                </label>
                <select
                  className="
                  w-full py-2 border-2 border-indigo-500 rounded-sm 
                  focus:outline-1 focus:outline-indigo-700
                "
                  id={inputField.id}
                  name={inputField.name}
                  value={data.prefecture}
                  onChange={handleChange}
                >
                  <option value="">---- 選択してください ----</option>
                  {prefectures.map((prefecture) => (
                    <option key={prefecture} value={prefecture}>
                      {prefecture}
                    </option>
                  ))}
                </select>
              </div>
            ) : inputField.name === "emails" ? (
              <div>
                {data.emails.map((email, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <TextInput
                          label={index === 0 ? inputField.label : ""}
                          type={
                            inputField.type as "text" | "email" | "tel" | "date"
                          }
                          name={`${inputField.name}_${index}`}
                          id={`${inputField.id}_${index}`}
                          value={email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleEmailChange(index, e.target.value)
                          }
                        />
                      </div>
                      {data.emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(index)}
                          className="rounded-full bg-red-100 hover:bg-red-200 w-10 h-10 mb-1 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {/* 各email入力欄のエラー */}
                    {emailErrors[index] && (
                      <p className="text-red-600 text-sm/normal m-0 mt-1">
                        {emailErrors[index]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="grid place-content-center mb-2">
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="rounded-full bg-neutral-200 hover:bg-neutral-300 w-10 h-10 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <TextInput
                label={inputField.label}
                type={inputField.type}
                name={inputField.name}
                id={inputField.id}
                value={data[inputField.name] ?? ""}
                onChange={handleChange}
              />
            )}

            {/* エラー */}
            <div className="min-h-6 mt-1">
              {errors[inputField.name] && (
                <p className="text-red-600 text-sm/normal m-0">
                  {errors[inputField.name]}
                </p>
              )}
            </div>

            {/* 住所自動入力 */}
            {inputField.name === "postalCode" && (
              <div className="flex flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  disabled={loading}
                  className="
                    bg-neutral-50 hover:bg-neutral-200 transition-all
                    w-60 text-base px-5 py-2 border rounded-sm
                  "
                >
                  {loading ? "入力中..." : "郵便番号から住所を自動入力"}
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="mb-1">
          <label className="block" htmlFor="contractStatus">
            契約状態
          </label>
          <select
            className="
              w-full py-2 border-2 border-indigo-500 rounded-sm 
              focus:outline-1 focus:outline-indigo-700
            "
            id="contractStatus"
            name="contractStatus"
            value={data.contractStatus}
            onChange={handleChange}
          >
            <option value="initial">---- 選択してください ----</option>
            <option value="contract">契約中</option>
            <option value="negotiation">商談中</option>
            <option value="cancellation">解約</option>
          </select>
        </div>

        {data.contractStatus === "cancellation" && (
          <div>
            <div className="min-h-6 mt-1" />
            <label className="block" htmlFor="cancellationDate">
              解約日
            </label>
            <input
              type="date"
              id="cancellationDate"
              name="cancellationDate"
              value={data.cancellationDate}
              onChange={handleChange}
              className="
                w-full py-2 border-2 border-indigo-500 rounded-sm 
                focus:outline-1 focus:outline-indigo-700
              "
            />
            <div className="min-h-6 mt-1">
              {errors.cancellationDate && (
                <p className="text-red-600 text-sm/normal m-0">
                  {errors.cancellationDate}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="min-h-6 mt-1">
          {errors.contractStatus && (
            <p className="text-red-600 text-sm/normal m-0">
              {errors.contractStatus}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="
            bg-neutral-50 hover:bg-neutral-200 transition-all
              text-lg w-50 px-8 py-4 border rounded-sm block mx-auto mt-2
            "
        >
          送信する
        </button>
      </form>
    </div>
  );
}
