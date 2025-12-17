import { useState } from "react";
import { TextInput } from "../../form/InputField";
import { formSchema, type FormDataType } from "./Form.schema";
import {
  inputFields,
  prefectures,
  contractStatusOptions,
} from "./Form.constants";
import { fetchAddress } from "../../../api/postalCode";
import { ErrorMessage } from "../../form/ErrorMessage";
import { useFormData } from "../../../hooks/useFormData";
import { SavedDataList } from "../../form/SavedDataList";
import { CirclePlus, CircleX } from "lucide-react";

type FormProps = {
  initialValues?: FormDataType;
  onSubmit?: (data: FormDataType) => Promise<void> | void;
  submitLabel?: string;
  mode?: "create" | "edit";
};

export default function Form({
  initialValues,
  onSubmit,
  submitLabel = "送信する",
  mode = "create",
}: FormProps) {
  const {
    data,
    setData,
    errors,
    setErrors,
    emailErrors,
    setEmailErrors,
    handleChange,
    handleEmailChange,
    handleAddEmail,
    handleRemoveEmail,
    resetForm,
  } = useFormData(initialValues);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setEmailErrors([]);
    setSubmitting(true);

    const validEmails = data.emails.filter((email) => email.trim() !== "");
    const formData = {
      ...data,
      emails: validEmails.length > 0 ? validEmails : [""], // 空なら[""]でエラーを出す
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
      setSubmitting(false);
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(result.data);
      } else {
        const response = await fetch("http://localhost:3001/api/data", {
          method: "POST",
          headers: { "content-Type": "application/json" },
          body: JSON.stringify(result.data),
        });
        const json = await response.json();

        if (json.success) {
          console.log("送信成功:", json.data);
          resetForm();
        }
      }
    } catch (error) {
      console.error("送信エラー:", error);
    } finally {
      setSubmitting(false);
    }
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

  const handleLoadData = (loadedData: FormDataType) => {
    setData(loadedData);
  };

  return (
    <div className="w-150 mx-auto bg-neutral-50 py-6 px-10 rounded-2xl">
      {mode === "create" && <SavedDataList onLoadData={handleLoadData} />}
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
                          <CircleX className="m-auto text-red-700" />
                        </button>
                      )}
                    </div>
                    {/* 各email入力欄のエラー */}
                    <ErrorMessage
                      message={emailErrors[index]}
                      className="min-h-0 mt-0"
                    />
                  </div>
                ))}
                <div className="grid place-content-center mb-2">
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="rounded-full bg-neutral-200 hover:bg-neutral-300 w-10 h-10 transition-colors"
                  >
                    <CirclePlus className="m-auto" />
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

            <ErrorMessage message={errors[inputField.name]} />

            {/* 住所自動入力 */}
            {inputField.name === "postalCode" && (
              <div className="flex flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  disabled={loading}
                  className="
                    bg-white hover:bg-neutral-200 transition-all
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
            <option value="">---- 選択してください ----</option>
            {contractStatusOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <ErrorMessage message={errors.contractStatus} />

        {data.contractStatus === "cancellation" && (
          <div>
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
            <ErrorMessage message={errors.cancellationDate} />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="
            bg-white hover:bg-neutral-200 transition-all
              text-lg w-50 px-8 py-4 border rounded-sm block mx-auto mt-2
            "
        >
          {submitting ? "送信中..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
